require('dotenv').config(); //npm dotenv is to keep keys from going public
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { response } = require('express')
const app = express();
const FoodModel = require('./models/Food');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

//Use mongoose to connect with local mongodb 
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to MongoDB locally..."))
.catch(err => console.error("Couldn't connect to MongoDB locally", err)) 

//Use mongoose to connect with mongodb Atlas
// mongoose.connect(process.env.AtlasDatabase_URL, {useNewUrlParser: true, useUnifiedTopology: true})
// .then(() => console.log("Connected to MongoDB Atlas..."))
// .catch(err => console.error("Couldn't connect to MongoDB Atlas", err))

app.post('/insert', async(req, res) => {
    const foodName = req.body.foodName
    const days = req.body.days
    const food = new FoodModel({foodName: foodName, daysSinceIAte: days});

    try {
        await food.save();
        console.log('Data saved to local MongoDB')
        // console.log('Data saved to Mongo Atlas')
    } 
    catch(err){
        console.log("Couldn't save to local MongoDB", err);
    }
});

app.get('/list', async(req, res) => {
    FoodModel.find({}, (err, result) =>{
        if (err){
            res.send(err)
        }
        res.send(result)
    })
});

// app.get('/list', async(req, res) => {
//     try {
//         FoodModel.find()
//         res.send("List all")
//     } 
//     catch(err){
//         console.log("Couldn't list all", err);
//     } 
// });

app.put('/update', async(req, res) => {
    const newFoodName = req.body.newFoodName
    const id = req.body.id
    
    try {
        await FoodModel.findById(id, (err, updatedFood) => {
        updatedFood.foodName = newFoodName;
        updatedFood.save();
        res.send("update");
        console.log("Data updated to local MongoDB")
        // console.log("Data updated to Mongo Atlas")
    })
    } 
    catch(err){
        console.log("Couldn't update data to local MongoDB", err);
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await FoodModel.findOneAndDelete(id).exec();
        res.send('deleted');
        console.log("Data deleted from local MongoDB")
        // console.log("Data deleted from Mongo Atlas")
    } 
    catch(err){
        console.log("Couldn't delete data from local MongoDB", err)
    }
});

// app.get('/', (req, res) => {
//     res.redirect('http://localhost:3001/user')
// });

app.listen(PORT, () => console.log(`Server is running on Port: http://localhost:${PORT}`));