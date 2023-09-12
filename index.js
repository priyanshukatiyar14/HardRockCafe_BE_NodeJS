const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const port = 3000;
const menuroute = require('./menuroute.js');
const authroute = require('./authroute.js');
const connectdb=require('./db.js');

connectdb();

app.use(
  express.urlencoded({ extended: true })
);
app.use('/menu', menuroute); 
app.use('/auth', authroute);

app.get('/', (req, res) => {
  res.send('Hello World, from express');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
