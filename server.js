var express  = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Book = require('./app/models/book');


var uri = 'localhost/db_name';
if(process.env.VCAP_SERVICES)
{
    var vcap_services = JSON.parse(process.env.VCAP_SERVICES)
    uri = vcap_services.mongo[0].credentials.uri
}
console.log(uri);
mongoose.connect('mongodb://' + uri);
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log(req.body);
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'Move along, nothing to see here' });
});

router.route('/books')

    .post(function(req, res) {

        var book = new Book();
        book.case = req.body.case;

        book.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Book list saved!' });
        });
    })

    .get(function(req, res) {
    Book.find(function(err, books) {
        if (err)
            res.send(err);

        res.json(books);
    });
});

app.use('/api', router);

app.listen(port);
console.log('Express running on ' + port);
