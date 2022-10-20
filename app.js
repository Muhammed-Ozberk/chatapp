var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
const Sequelize = require('sequelize');


const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/database.js')[env];

var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth');


var app = express();

var SequelizeStore = require("connect-session-sequelize")(session.Store);

var sequelize = new Sequelize(config.database, config.username, config.password, config);


/** Middleware Import */
var authorize = require('./middleware/authorize');
var responseMiddleware = require('./middleware/responses');
var responseErrorMiddleware = require('./middleware/responseErrors');
/** Middleware Import END */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(responseErrorMiddleware);

app.use(responseMiddleware);

var myStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
  store: myStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Session expires after 1 min of inactivity.
    expires: 60000 
}
}));

app.use(passport.initialize());
app.use(passport.authenticate('session'));


app.use('/', authRouter);
app.use(authorize);
app.use('/', homeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

myStore.sync();

module.exports = app;
