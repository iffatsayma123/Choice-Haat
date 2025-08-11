# 🛒 Choice Haat

Choice Haat is a full-stack e-commerce web application built with **React (TypeScript)** for the frontend, **Node.js/Express** for the backend, and **MongoDB** for the database.  
It allows customers to browse products, add them to a cart, place orders, and track their order status.  
Admins can manage products, view orders, and update delivery status.

## 🚀 Features
### Customer:
- User registration & login (JWT authentication)
- Browse products by category
- View product details
- Add products to cart
- Checkout with Cash on Delivery / Card Payment (future enhancement)
- View order history with Order IDs
- Track orders

### Admin:
- Add, edit, and delete products with images
- Manage customer orders
- Update order status (Out for Delivery, Delivered)
- View all order history

## 🛠 Tech Stack
- **Frontend:** React (TypeScript), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, Multer (for image upload)
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (Frontend), Render (Backend)

## 📂 Folder Structure
Choice-Haat/
├── choice-haat-client/ # Frontend code (React + TS)
├── server/ # Backend code (Node.js/Express)


## ⚡ Getting Started
### 1️⃣ Clone the repository

```bash
git clone https://github.com/iffatsayma123/Choice-Haat.git
cd Choice-Haat
```

2️⃣ Install dependencies

# Install frontend dependencies
```bash
cd choice-haat-client
npm install
```
# Install backend dependencies
```bash
cd ../server
npm install
```

3️⃣ Setup environment variables

Create a .env file in server/:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run locally

```bash
cd ../server
npm install
```
# Start frontend
```bash
cd choice-haat-client
npm install
```
🌐 Live Demo

Frontend: [Choice Haat on Vercel](https://choice-haat.vercel.app/)

Backend API: [Choice Haat API on Render](https://choice-haat-backend-npzd.onrender.com)

🔗 API Endpoints

Products
  
| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/products`     | Get all products        |
| GET    | `/api/products/:id` | Get single product      |
| POST   | `/api/products`     | Add new product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin)  |

Users
| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/api/register` | Register new user |
| POST   | `/api/login`    | Login user        |


Orders

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| POST   | `/api/orders`            | Place a new order        |
| GET    | `/api/orders/:id`        | Get order details        |
| GET    | `/api/my-orders/:userId` | Get user's order history |

📸 Screenshots

HOMEPAGE:
<img width="1348" height="681" alt="image" src="https://github.com/user-attachments/assets/aa9f413e-35c4-40b3-83ce-f8c802a09f12" />

PRODUCT DETAILS PAGE:(IN GUEST MODE)
<img width="1366" height="646" alt="image" src="https://github.com/user-attachments/assets/5b2617ea-a932-4a9b-a722-dbcdf949a736" />

PRODUCT DETAILS PAGE:(IN USER MODE)
<img width="1344" height="641" alt="image" src="https://github.com/user-attachments/assets/0523deb1-0f11-4252-bc25-c9a2a4961c5d" />

CART PAGE:
<img width="1348" height="630" alt="image" src="https://github.com/user-attachments/assets/96c43c12-008b-4724-bbd9-ea0124875f8c" />

CHECKOUT PAGE:
<img width="1321" height="643" alt="image" src="https://github.com/user-attachments/assets/7a560994-ad71-421b-9fb8-84e0b626223b" />

LOGIN AND REGISTER PAGE:
<img width="1343" height="642" alt="image" src="https://github.com/user-attachments/assets/de643a42-8ebe-4c8b-b785-8a8797baecf3" />
<img width="1331" height="634" alt="image" src="https://github.com/user-attachments/assets/4e693f27-0872-49e4-9db8-a24f47754f82" />

ADMIN DASHBOARD:
<img width="1341" height="576" alt="image" src="https://github.com/user-attachments/assets/804bfdbb-e4b0-4aa0-8fa9-e49ec46899a7" />
<img width="1307" height="640" alt="image" src="https://github.com/user-attachments/assets/01005c38-aa90-4e5c-b347-b023890601b3" />

📜 License
This project is licensed under the **MIT License** - see the [[LICENSE](LICENSE) file for details.





