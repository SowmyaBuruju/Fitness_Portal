const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected')
});

// Models
require('./Users');
require('./Blogs');
require('./Comments');
require('./dietPlan');
