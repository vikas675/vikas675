var express = require('express');
var app = express();
var dbservice = require('../Common/DB/dbservice');
var bodyparser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

/** set public directory for static content css, images, fonts and js */
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.urlencoded({
    extended: true,
}));

//Route http request
app.get('/', function (req, res) {
    console.log('Client requested the root....')
    res.render('index', { msg: 'Hello World! This request is sent from server' });

    // Once response is processed, dont write anything next to it as requeste has been respoded earliar.
    //To send any piece of data, use something like :
    //{msg:'Hello World! This request is sent from server'}
    //Here msg is the key, and 'Hello......' is its value. We can use this key on index.pug.
    /**
     * @desc: Invalid steps after response process. It will trow "Can't set headers after they are sent. error"
     * 
     * console.log('Client sent request..')
     * res.send('Hello World! This request is sent from server');
     */

});

app.get('/home', function (req, res) {
    res.render('home', { greet: 'This is it' })
    req.query.name
});

app.get('/trial', function (req, res) {
    res.render('trial')
});

app.post('/login', function (req, res) {
        dbservice.AuthenticateUser( req.body.username, req.body.password, function (err, data) {
            if (err) {
                res.redirect('/');
            } else {
               res.redirect('/home') 
            }
        });
});


module.exports = {
    Start: function () {
        app.listen(3000, function (req, res) {
            console.log('server started at port 3000')

        });
    },
    vikas: function () {
        console.log('Server Connected')
    }
}
