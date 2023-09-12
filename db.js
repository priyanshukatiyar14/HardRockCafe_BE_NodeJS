const mongoose = require('mongoose');

const connectdb=async()=>{await mongoose.connect('mongodb://localhost:27017/HardRock-NodeJS', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));
}

module.exports=connectdb;