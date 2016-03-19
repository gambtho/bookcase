var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema   = new Schema({
    case: Object
});

module.exports = mongoose.model('Book', BookSchema);