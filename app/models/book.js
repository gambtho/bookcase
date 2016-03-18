var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema   = new Schema({
    case: Buffer
});

module.exports = mongoose.model('Book', BookSchema);