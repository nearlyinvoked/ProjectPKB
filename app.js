var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var routes = require('./routes/routes');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', usersRouter);

var server = http.createServer(app);

server.listen(2000,function(){
  console.log('Server Started on Port 2000 ...');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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



var io  = require('socket.io')(server); //for Socket.io


  io.on('connection',function(socket){
    console.log('A user Connected');

    socket.on('disconnect',function(){
      console.log('user Disconnected');
      });

    socket.on('imageUpload',function(info){
      // console.log(info.buffer);
      //image is transfered in websockets in base64 format from client to server
      var base64Data;
      if(info.format==='png')
      base64Data = info.buffer.replace(/^data:image\/png;base64,/, "");
      else if(info.format==='jpg')
      base64Data = info.buffer.replace(/^data:image\/jpeg;base64,/, "");
      else
      socket.emit('UploadSuccess','false');

      console.log(info.format);

      if(base64Data){//if data is not null
      require("fs").writeFile("./tmp/uploads/out.png", base64Data, 'base64', function(err) {//save image to out.png
        if(err){
          console.log(err);
          socket.emit('UploadSuccess','false');//return failure
          }
          else{
          socket.emit('UploadSuccess','true');//return success
          }
        });
      }
    });

  });


module.exports = app;
