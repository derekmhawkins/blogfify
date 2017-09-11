const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const mainRoutes = require('./routes');
const careerRoutes = require('./routes/career');
const lifestyleRoutes = require('./routes/lifestyle');
const travelRoutes = require('./routes/travel');

const flash = require('express-flash');
const methodOverride = require('method-override');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models').User;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// use sessions for tracking logins
app.use(session({
  store: new pgSession({
    conString: 'postgres://derek:derek@127.0.0.1:5432/blogify_db'
  }),
  secret: "Welcome to the jungle!",
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  },
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  User.findOne({
    where: {
      id: user.id
    }
  }).then(user => {
    done(null, user);
  });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({
      where: {
        username: username
      }
    }).then(user => {
      if(!user) {
        return done(null, false, {
          message: 'Incorrect username'
        });
      } else if(!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect Password'
        });
      }
      return done(null, user);
    });
  }
));

// make username available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.username;
  next();
});

// Method override
app.use(methodOverride('_method'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use(mainRoutes);
app.use('/career', careerRoutes);
app.use('/lifestyle', lifestyleRoutes);
app.use('/travel', travelRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
