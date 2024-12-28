
const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConnect');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

dotenv.config();

dbConnect();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/',(req,res)=>{
    res.json("Health OK");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});