let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let fs = require('fs');
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
        res.redirect('/');
    }else{
        res.redirect('/connect');
    }
})

// Sign up + Sign in + Log out
eval(fs.readFileSync('./includes/sign.js')+'');
// API files
eval(fs.readFileSync('./api/ajax.js')+'');

// Profile page (must be the last app.get at the bottom)
app.get('/:username', (req,res) => {
    let User = require('./models/user.js');
    User.find(req.params.username, (data) => {
        if(data !== 'unknown'){
            User.countPublications(req.params.username, (publications) => {
                User.getSubscribers(req.params.username, (subscribers) => {
                    res.render('pages/profile.ejs', {user: data, countPublications: publications,subscribers: subscribers});
                })
            })
        }else{
            res.redirect('/');
        }
    })
})

app.listen(8080);