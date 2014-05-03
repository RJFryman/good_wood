'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');

  app.get('/', d, home.index);
  app.get('/register', d, home.fresh);
  app.post('/register', d, home.create);
  app.get('/login', d, home.auth);
  app.post('/login', d, home.login);
  app.post('/logout', d, home.logout);
  console.log('Routes Loaded');
  fn();
}

