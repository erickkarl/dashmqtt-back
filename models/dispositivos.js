const mongoose = require('../db');
var Float = require('mongoose-float').loadType(mongoose);

const DispositivosSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
        unique: true,
    },
    type:{
        type: String,
        require: true
    },
    icon:{
        type: String,
        require: true
    },
    comodo:{
        type: String,
        require: true
    },
    value:{
        type: Number,
        require: true
    },
    flag:{
        type: Boolean,
        require: true
    }
})

const Dispositivos = mongoose.model('Dispositivos', DispositivosSchema);

module.exports = Dispositivos;