const mongoose = require("mongoose");
const validator = require("validator");

const measurementSchema = new mongoose.Schema({
    noise_buffer:{
        type:[mongoose.Schema.Types.Double],
        required: true,
        default: [1.1]
    },
    time_buffer:{
        type:[mongoose.Schema.Types.Double],
        required: true,
        default: [0.0],
        validator (v){
            if (v.length != this.noise_buffer.length){
                throw new Error("Taille des buffers invalide: les listes ne sont pas de la même taille");
            }
        }
    },
    timestamp:{
        type:Date, // js UTC
        required: true
    },
    surrounding_people:{
        type:Number,
        required: true,
        validate (v){
            if (v < 0){
                throw new Error("Personnes autours ne peuvent pas être un nombre négatif");
            }
        }
    },
    ambiance:{
        type:String,
        trim:true,
        lowercase:true,
        enum:{
            values: ['calme', 'social', 'neutre', 'bruyant', 'chaotique'],
            message: '{VALUE} n\'est pas valide. Doit être [calme, social, neutre, bruyant, chaotique]'
        },
        required: true,
    },
    source_distance:{
        type:mongoose.Schema.Types.Double,
        required: true,
        validate (v) {
            if (v < 0){
                throw new Error("Distance doit être positif");
            }
        }
    },
    weather:{
        type:String,
        required: true,
        trim:true,
        lowerase:true,
        enum:{
            values:['clair', 'nuageux', 'brume', 'precipitante'],
            message:'{VALUE} n\'est pas valide. Doit être [clair, nuageux, brume, precipitante]'
        }
        
    },
    setting:{
        type:String,
        required: true,
        trim:true,
        lowercase:true,
        enum:{
            values:['transport', 'restauration', 'commerce', 'regroupement', 'industriel', 'communautaire', 'institutionnel', 'personnel'],
            message:'{VALUE} n\'est pas valide. Doit être [transport, restauration, commerce, regroupement, industriel, communautaire, institutionnel, personnel]'
        }
    },
    locationId:{
        type:Number,
        required: true
    },
    author:{
        type:String,
        required:true
    }
}, {
    strict: "throw"
});

measurementSchema.pre("save", async function (){
    if(this.$isDefault("time_buffer") || this.$isDefault("noise_buffer")){
        let noise_level = 0.0
        switch(this.ambiance){
            case 'calme': noise_level = -35.0; break;
            case 'social': noise_level = -55.0; break;
            case 'neutre': noise_level = -40.0; break;
            case 'bruyant': noise_level = -70.0; break;
            case 'chaotique': noise_level = -80.0;break;
        }
        this.noise_buffer = [noise_level]
    }
});

const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;