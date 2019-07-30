var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const session = require('express-session');
const redisClient = require('./db/redis');
const RedisStore = require('connect-redis')(session);

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

var app = express();

// morgan 配置日志
if (process.env.NODE_ENV !== 'prd') {
  app.use(morgan('dev'));
} else {
  const fileName = path.join(__dirname, 'log', 'access.log');
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a'
  });
  app.use(
    morgan('combined', {
      stream: writeStream
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = new RedisStore({
  client: redisClient
});
app.use(
  session({
    secret: 'Qwer123-=()',
    cookie: {
      path: '/', // 默认值
      httpOnly: true, // 默认值
      maxAge: 24 * 60 * 60 * 1000
    },
    store: sessionStore
  })
);

app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
