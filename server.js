let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let app = express();

// App setter
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}))
app.use(require('./middlewares/flash.js'));

// Main page
app.get('/', (req,res) => {
    if(req.session.userId !== '' && req.session.userId !== undefined){
        res.redirect('/'+req.session.userId);
    }else{
        res.redirect('/connect');
    }
})

// Registration
app.get('/register', (req,res) => {
    if(req.body){
        res.render('pages/register', {body: req.body});
    }else{
        res.render('pages/register');
    }
})

app.post('/register', (req,res) => {
    let User = require('./models/user.js');
    User.register(req.body, (response, data) => {
        if(response === 'registered'){
            res.render('pages/connect', {success: 'Vous pouvez vous connecter !'});
        }else{
            req.flash('error', response)
            res.redirect('/register');
        }
    })
})

// Connection
app.get('/connect', (req,res) => {
    res.render('pages/connect');
})

app.post('/connect', (req,res) => {
    let User = require('./models/user.js');
    User.login(req.body, (response, data) => {
        if(response === 'connected'){
            req.session.userId = data.id;
            req.session.firstname = data.firstname;
            req.session.surname = data.surname;
            req.session.points = data.points;
            req.session.registerDate = data.creation;
            res.redirect('/');
        }else{
            req.flash('error', response);
            res.redirect('/connect');
        }
    })
})

// Disconnection
app.get('/disconnect', (req,res) => {
    req.session.id = undefined;
    res.redirect('/connect');
})

app.listen(8080);