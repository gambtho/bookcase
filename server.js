var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var Book        = require('./app/models/book');
var mysql       = require('mysql');

var port = process.env.PORT || 3000;
var router = express.Router();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    //var mongoUri = env['p-mongodb'][0]['credentials']['uri'];
    var mongoUri = env['mongolab'][0]['credentials']['uri'];
}
else{
    var mongoUri = 'mongodb://localhost/db_name';
}
mongoose.connect(mongoUri);

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'bookcase'
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

connection.query('SELECT * from bookcase LIMIT 1', function(err, rows, fields) {
    connection.end();
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.');
});


router.use(function (req, res, next) {
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'Move along, nothing to see here'});
});

router.route('/books')
    .post(function (req, res) {
        var book = new Book();

        book.case = req.body;
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

router.route('/book/:book_id')

    .get(function(req, res) {
        Book.findById(req.params.book_id, function(err, book) {
            if (err)
                res.send(err);
            res.json(book);
        });
    })

    .delete(function(req, res) {
        Book.remove({
            _id: req.params.book_id
        }, function(err, book) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
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
