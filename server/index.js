// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const JWT_SECRET = 'your_very_secret_key';

const app = express();
app.use(cors());
app.use(express.json());

// static files
app.use('/uploads', express.static('uploads'));

// --- Mongo ---
mongoose
  .connect('mongodb+srv://232007712:01886738910@iffat-sayma.qwfodur.mongodb.net/choicehaat?retryWrites=true&w=majority&appName=IFFAT-SAYMA')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB error:', err));

// --- Schemas ---
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,        // filename stored (served from /uploads/<image>)
  description: String,
  category: String
});
const Product = mongoose.model('Product', ProductSchema);

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, index: true }, // CH-YYYYMMDD-1234
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  address: String,
  paymentMethod: { type: String, enum: ['COD', 'Card'], default: 'COD' },
  cardLast4: String,
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      qty: Number,
      image: String,
      category: String,
    }
  ],
  total: Number,
  status: { type: String, enum: ['Pending', 'Out for Delivery', 'Delivered'], default: 'Pending' },
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- Helpers ---
function genOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `CH-${y}${m}${day}-${rnd}`;
}

// --- Upload ---
app.post('/api/upload', upload.single('file'), (req, res) => {
  const oldPath = req.file.path;
  const newPath = path.join('uploads', req.file.originalname);
  fs.renameSync(oldPath, newPath);
  res.json({ filename: req.file.originalname });
});

// --- Products ---
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  res.json(prod);
});

app.post('/api/products', async (req, res) => {
  const { name, price, image, description, category } = req.body;
  const prod = new Product({ name, price, image, description, category });
  await prod.save();
  res.status(201).json(prod);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/categories', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// --- Auth ---
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const isFirst = (await User.countDocuments()) === 0;
  const isAdmin = isFirst || email === 'admin@choicehaat.com';
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, isAdmin });
  await user.save();
  res.status(201).json({ message: 'Registered successfully' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
});

// --- Orders ---
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, name, address, paymentMethod, cardNumber, items, total } = req.body;
    if (!userId || !items?.length) return res.status(400).json({ message: 'Missing userId or items' });

    const orderId = genOrderId();
    const order = new Order({
      orderId,
      user: userId,
      name,
      address,
      paymentMethod: paymentMethod || 'COD',
      cardLast4: paymentMethod === 'Card' && cardNumber ? cardNumber.slice(-4) : undefined,
      items,
      total,
    });
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not place order' });
  }
});

// Track by human-friendly orderId (NOT Mongo _id)
app.get('/api/orders/by-order-id/:orderId', async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// My orders
app.get('/api/my-orders/:userId', async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort({ date: -1 });
  res.json(orders);
});

// Admin: list and update status
app.get('/api/admin/orders', async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ date: -1 });
  res.json(orders);
});

app.patch('/api/admin/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Pretty root page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Choice Haat API</title>
        <style>
          body { background: linear-gradient(135deg,#FFF8E1,#FFE082 90%); font-family: Arial; min-height:100vh; display:flex; align-items:center; justify-content:center; margin:0; }
          .api-box { background:#fff; padding:32px 40px; border-radius:24px; box-shadow:0 4px 32px #ffd60055; text-align:center; }
          h1 { color:#FFC700; font-size:2.2rem; margin:8px 0 16px; }
          a { color:#1976D2; text-decoration:underline; }
        </style>
      </head>
      <body>
        <div class="api-box">
          <h1>Welcome to Choice Haat API</h1>
          <div>Try: <a href="/api/products">/api/products</a></div>
        </div>
      </body>
    </html>
  `);
});

app.listen(5000, () => console.log('API server running on http://localhost:5000'));
