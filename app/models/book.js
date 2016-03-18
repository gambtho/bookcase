var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema   = new Schema({
    case: String
});

module.exports = mongoose.model('Book', BookSchema);