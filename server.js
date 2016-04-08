var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var port = process.env.PORT || 3000;
var router = express.Router();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var pool;

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    pool = mysql.createPool(env['mysql'][0]['credentials']['uri']);
}
else {
    pool = mysql.createPool({
        connectionLimit: 5,
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'bookcase'
    });
}

router.use(function (req, res, next) {
    next();
});

router.route('/books')
    .post(function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO list (json) VALUES (?)', JSON.stringify(req.body), function (err, results) {
                connection.release();
                if (!err) {
                    //console.log(results.insertId);
                    res.json({message: 'Book list saved!'});
                }
                else {
                    res.send(err);
                }
            });
        });
    });

router.route('/books/newest')
    .get(function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM list order by id desc limit 1', function (err, results) {
                connection.release();
                if (!err) {
                    res.json(`${results[0].json}`);
                }
                else {
                    res.send(err);
                }
            });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Express running on ' + port);

module.exports = app;
