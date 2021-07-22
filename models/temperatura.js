const mongoose = require('../db');
var Float = require('mongoose-float').loadType(mongoose);

const TemperaturaSchema = new mongoose.Schema({
    DATETIME: {
        type: Date,
        require: true
    },
    value:{
        type: Float,
        require: true
    }
})

const Temperatura = mongoose.model('Temperatura', TemperaturaSchema);

module.exports = Temperatura;