const express = require('express'); //common js module, ES6 module is import but in cllient only
const dotenv = require('dotenv').config();
const colors = require('colors');
const connectDB = require('./config/db');
const { errorHandlerMiddleware } = require('./middleware/errorMiddleware');
const { socketProtect } = require('./middleware/authMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

// Connect to DB
connectDB();

// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json()); // will allowd us to send raw json data to the server
app.use(express.urlencoded({ extended: false })); //to accapy url encoded data

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Wellcome to Babble Planet' });
});

// Routes
app.use('/api/users', require('./routes/userRoutes')); //endpoint must start with '/'

// Socket.io

io.use(socketProtect);
let onlineUsers = new Map();
const onConnected = require('./controllers/messageController')(io, onlineUsers);
io.on('connection', onConnected);

// Default Eror handler middleware - Register this function as global middleware, ensuring that it runs for every request.
app.use(errorHandlerMiddleware);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
