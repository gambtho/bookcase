var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./app/models/book');




if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongoUri = env['p-mongodb'][0]['credentials']['uri'];
}
else{
    var mongoUri = 'mongodb://localhost/db_name';
}

console.log(mongoUri);
mongoose.connect(mongoUri);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(function (req, res, next) {
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'Move along, nothing to see here'});
});

router.route('/books')
    .post(function (req, res) {
        var book = new Book();

        book.case = JSON.stringify(req.body);
        book.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Book list saved!'});
        });
    })
    .get(function (req, res) {
        Book.find(function (err, books) {
            if (err) {
                res.send(err);
            }
            res.json(books);
        });
    });


router.route('/books/newest')
    .get(function (req, res) {
        Book.findOne().sort({_id: -1}).exec(function (err, book) {
            if (err) {
                res.send(err);
            }
            res.json(book.case);
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Express running on ' + port);

module.exports = app;
