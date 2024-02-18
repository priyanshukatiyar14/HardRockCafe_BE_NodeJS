const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const port = 3000;
const menuroute = require('./menuroute.js');
const authroute = require('./authroute.js');
const cartroute=require('./cartroute.js')
const connectdb=require('./db.js');
const http = require('http');
const { Server } = require("socket.io");

connectdb();

const io = new Server(3001, {
  cors: {
    origin: "*",
    credentials: true,
  },
  allowEIO3: true,
});


io.on("connection", async (socket) => {
  console.log('A user connected');

  // Send "hello" message every 10 seconds
  const interval = setInterval(() => {
    socket.emit('hello', 'Hello, world!');
  }, 10000);
  
  socket.on('chatMessage', (message) => {
    console.log(`Received message: ${message}`);
    
    // Broadcast the received message to all connected clients except the sender
    socket.broadcast.emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    clearInterval(interval);
  });
});

app.use(express.json());
app.use(
  express.urlencoded({ extended: true })
);
app.use('/menu', menuroute); 
app.use('/auth', authroute);
app.use('/cart', cartroute);


app.get('/', (req, res) => {
  res.send('Hello World, from express');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))