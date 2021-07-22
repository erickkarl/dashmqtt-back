const mongoose = require('../db');
var Float = require('mongoose-float').loadType(mongoose);

const AlarmeSchema = new mongoose.Schema({
    dispositivo: {
        type: String,
        require: true,
    },
    type:{
        type: String,
        require: true
    },
    icon:{
        type: String,
        require: true
    },
    onoff:{
        type: String,
        require: true
    },
    regra:{
        type: String,
        require: true
    },
    tempo: {
        type: String,
        require: false
    },
    sensor:{
        type: String,
        require: false
    },
    sensor_value:{
        type: Float,
        require: false
    }
})

const Alarmes = mongoose.model('Alarmes', AlarmeSchema);

module.exports = Alarmes;