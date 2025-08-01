const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const JWT_SECRET = 'your_very_secret_key';



const app = express();
app.use(cors());
app.use(express.json());

// Serve static images from uploads
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB (replace with your real connection string!)
mongoose.connect('mongodb+srv://232007712:01886738910@iffat-sayma.qwfodur.mongodb.net/choicehaat?retryWrites=true&w=majority&appName=IFFAT-SAYMA')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB error:', err));

// Product schema/model
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String   // <-- new
});

const Product = mongoose.model('Product', ProductSchema);

// User schema/model (with isAdmin)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model('User', UserSchema);

// Order schema/model
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  address: String,
  payment: String,
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// File upload for images
app.post('/api/upload', upload.single('file'), (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const oldPath = req.file.path;
  const newPath = path.join('uploads', req.file.originalname);
  fs.renameSync(oldPath, newPath);
  res.json({ filename: req.file.originalname });
});

// List all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a product

app.post('/api/products', async (req, res) => {
  const { name, price, image, description, category } = req.body; // now includes category
  const prod = new Product({ name, price, image, description, category });
  await prod.save();
  res.status(201).json(prod);
});


// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  res.json(prod);
});

// Register (make first user or email=your choice admin manually)
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  // Make first registered user admin:
  const isFirst = (await User.countDocuments()) === 0;
  const isAdmin = isFirst || email === "admin@choicehaat.com"; // or any logic you want!
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, isAdmin });
  await user.save();
  res.status(201).json({ message: 'Registered successfully' });
});

// Login (returns isAdmin)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });
  // Issue JWT
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
});

// Place order (userId is sent from frontend)
app.post('/api/orders', async (req, res) => {
  const { userId, name, address, payment, items, total } = req.body;
  const order = new Order({ user: userId, name, address, payment, items, total });
  await order.save();
  res.status(201).json({ success: true, order });
});

// Track order by order ID
app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Get logged-in user's order history
app.get('/api/my-orders/:userId', async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort({ date: -1 });
  res.json(orders);
});

app.listen(5000, () => console.log('API server running on http://localhost:5000'));

app.get('/api/categories', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Choice Haat API</title>
        <style>
          body {
            background: linear-gradient(135deg, #FFF8E1, #FFE082 90%);
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            margin: 0;
          }
          .api-box {
            background: white;
            padding: 32px 40px;
            border-radius: 24px;
            box-shadow: 0 4px 32px #ffd60055;
            text-align: center;
          }
          .api-box img {
            width: 72px; height: 72px;
            border-radius: 50%;
            margin-bottom: 16px;
            border: 2px solid #FFC700;
            background: #FFF;
          }
          h1 {
            color: #FFC700;
            font-size: 2.4rem;
            margin-bottom: 12px;
            letter-spacing: 1px;
          }
          p {
            color: #555;
            font-size: 1.1rem;
          }
          .api-link {
            color: #1976D2;
            text-decoration: underline;
            margin-top: 18px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="api-box">
          <img src="/logo.jpg" alt="Choice Haat logo" />
          <h1>Welcome to Choice Haat API!</h1>
          <p>Your backend is running.<br>
          <b>Visit <a href="/api/products" class="api-link">/api/products</a> to view the product list as JSON.</b></p>
        </div>
      </body>
    </html>
  `);
});
