/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.use(express.static(__dirname));

const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

/* MONGOOSE SETUP */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testDB');
const UserDetails = require("./mongo/testmodel");

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

/* ROUTES */

const connectEnsureLogin = require('connect-ensure-login');

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) { 
      return res.redirect('/login?info=Incorrect Username or Password'); 
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/');
    });

  })(req, res, next);
});

app.get('/login',
  (req, res) => res.sendFile('html/login.html',
  { root: __dirname })
);

app.get('/signup',
  (req, res) => res.sendFile('html/signup.html',
  { root: __dirname })
);

app.post("/signup", (req, res, next) => {
  const {username, password} = req.body;
  UserDetails.register({ username }, password)
    .then((data) => {
      console.log(`New user ${data.username} is created`);
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(`Error ${err}`);
      return res.redirect('/signup?info=Username already existed'); 
    });
});

app.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

app.get('/',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('html/index.html', {root: __dirname})
);

app.get('/private',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('html/private.html', {root: __dirname})
);

app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user})
);