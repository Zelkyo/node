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
    User.register(req.body, (response) => {
        if(response == 'registered'){
            res.render('pages/register');
        }else{
            req.flash('error', response)
            res.render('pages/register');
        }
    })
})

app.listen(8080);