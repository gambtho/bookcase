var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./app/models/book');
var mysql = require('mysql');

var port = process.env.PORT || 3000;
var router = express.Router();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    //var mongoUri = env['p-mongodb'][0]['credentials']['uri'];
    var mongoUri = env['mongolab'][0]['credentials']['uri'];
}
else {
    var mongoUri = 'mongodb://localhost/db_name';
}
mongoose.connect(mongoUri);

var pool  = mysql.createPool({
    connectionLimit : 5,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bookcase'
});

//var connection = mysql.createConnection('mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');

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

        pool.getConnection(function(err, connection) {
            // Use the connection
            connection.query('INSERT INTO list SET json ?', req.body, function (err, results) {
                connection.release();
                if (!err)
                    console.log('Inserted bookcase: ', results.id);
                else
                    console.log('Error while inserting: ', req.body, err);
            });
        });


    })
    .get(function (req, res) {
        
        Book.find(function (err, books) {
            if (err) {
                res.send(err);
            }
            res.json(books);
        });
        pool.getConnection(function(err, connection) {
            // Use the connection
            connection.query('SELECT json FROM list order by id desc limit 1', function (err, results) {
                connection.release();
                if (!err)
                    console.log('Selected: ', results);
                else
                    console.log('Selected ', results, err);
            });
        });

    });

router.route('/book/:book_id')

    .get(function (req, res) {
        Book.findById(req.params.book_id, function (err, book) {
            if (err)
                res.send(err);
            res.json(book);
        });
    })

    .delete(function (req, res) {
        Book.remove({
            _id: req.params.book_id
        }, function (err, book) {
            if (err)
                res.send(err);
            res.json({message: 'Successfully deleted'});
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
