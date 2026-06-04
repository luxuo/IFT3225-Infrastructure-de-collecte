const mongoose = require("mongoose");
const validator = require("validator");

const dataSchema = new mongoose.Schema({
    noise_buffer:{
        type:[Double],
        required: true
    },
    time_buffer:{
        type:[Double],
        required: true,
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
        type:Double,
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
        type:Number,
        required: true,
        trim:true,
        lowercase:true,
        enum:{
            values:['transport', 'restauration', 'commerce', 'regroupement', 'industriel', 'communautaire', 'institutionnel'],
            message:'{VALUE} n\'est pas valide. Doit être [transport, restauration, commerce, regroupement, industriel, communautaire, institutionnel]'
        }
    }
}, {
    strict: "throw"
});

const Data = mongoose.model('data', dataSchema);

module.exports = Data;