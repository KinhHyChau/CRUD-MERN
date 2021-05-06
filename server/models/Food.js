const mongoose = require('mongoose');

//Create Schema
const FoodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
    },
    daysSinceIAte:{
        type: Number,
        required: true,
    },
});

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food