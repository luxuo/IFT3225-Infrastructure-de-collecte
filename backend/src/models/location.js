const mongoose = require("mongoose");
const validator = require("validator");

const locationSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    id:{
        type:Number,
        unique:true,
        required:true
    },
    lon:{
        type:mongoose.Schema.Types.Double,
        required: true,
        validator (v){
            if (v < -180.0 || v > 180.0){
                throw new Error("Valeur de latitude invalide, doit être entre [-180.0, 180.0]");
            }
        }
    },
    lat:{
        type:mongoose.Schema.Types.Double,
        required: true,
        validator (v){
            if (v < -90.0 ||  v > 90.0){
                throw new Error("Valeur de latitude invalide, doit être entre [-90.0, 90.0]");
            }
        }
    }
}, {
    strict: "throw"
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;