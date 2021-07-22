const mongoose = require('../db');
var Float = require('mongoose-float').loadType(mongoose);

const EnergiaSchema = new mongoose.Schema({
    DATETIME: {
        type: Date,
        require: true
    },
    value:{
        type: Float,
        require: true
    }
})

const Energia = mongoose.model('Energia', EnergiaSchema);

module.exports = Energia;