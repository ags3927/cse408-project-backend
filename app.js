const env = process.env.NODE_ENV || 'development';

console.log(env);

if (env === 'development') {
	process.env.MONGODB_URI = "mongodb://127.0.0.1:27017";
}

const mongoose = require('./db/mongoose');

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');
let userRouter = require('./routes/user');
let propertyRouter = require('./routes/property');
let reservationRouter = require('./routes/reservation');
let trendDestRouter = require('./routes/trendDest');
let reviewRouter = require('./routes/review');
let miscRouter = require('./routes/misc');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/user', userRouter);
app.use('/api/property', propertyRouter);
app.use('/api/review', reviewRouter);
app.use('/api/reservation', reservationRouter);
app.use('/api/trenddest', trendDestRouter);
app.use('/api/misc', miscRouter);

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

module.exports = app;
