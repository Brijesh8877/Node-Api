const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configure/db');
const userroutes=require('./routes/authroutes')

dotenv.config();

connectDB(); // Establish the database connection

const app = express();
app.use(express.json());
app.use("/user",userroutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
