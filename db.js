const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeDB', {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;