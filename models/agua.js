const mongoose = require('../db');
var Float = require('mongoose-float').loadType(mongoose);

const AguaSchema = new mongoose.Schema({
    DATETIME: {
        type: Date,
        require: true
    },
    value:{
        type: Float,
        require: true
    }
})

const Agua = mongoose.model('Agua', AguaSchema);

module.exports = Agua;