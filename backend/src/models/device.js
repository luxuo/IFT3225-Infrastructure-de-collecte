require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const deviceSchema = new mongoose.Schema({
    location:{
        type:String,
        required: true,
        trim:true,
        lowercase:true,
        match: /^[a-z]{4,20}$/
    },
    username:{
        type:String,
        unique:true,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    authToken:{
        type:String,
        required: true
    },
    favorites: {
    type: [Number], // liste de nombres correspondants aux id des lieux favoris
    default: []
},
}, {
    strict: "throw"
});

deviceSchema.methods.toJSON = function(){
    const device = this.toObject();
    delete device.password;
    delete device.authToken;
    return device;
}

deviceSchema.methods.generateAuthTokenAndSaveDevice = async function() {
    const authToken = jwt.sign({ _id: this._id.toString()}, process.env.PHRASE_PASS);
    this.authToken = authToken;
    await this.save();
    return authToken;
}

deviceSchema.statics.findDevice = async(username, password) =>{
    const device = await Device.findOne({username});
    if (!device){
        throw new Error("Erreur : username ou mot de passe n'existe pas");
    }
    const isPasswordValid = await bcrypt.compare(password, device.password);
    if(!isPasswordValid){
        throw new Error("Erreur : username ou mot de passe n'existe pas");
    }
    return device;
}

deviceSchema.pre("save", async function (){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8);
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;