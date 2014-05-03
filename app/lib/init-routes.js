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
  var users = require('../routes/users');
  var products = require('../routes/products');
  var woods = require('../routes/woods');
  var stains = require('../routes/stains');

  app.get('/', d, home.index);
  app.get('/register', d, users.fresh);
  app.post('/register', d, users.create);
  app.get('/login', d, users.auth);
  app.post('/login', d, users.login);
  app.post('/logout', d, users.logout);
  app.post('/products', d, products.create);
  app.post('/products', d, products.addImage);
  app.get('/products', d, products.index);
  app.get('/products/new', d, products.new);
  app.del('/products/:id', d, products.destroy);
  app.put('/products/:id', d, products.removePic);
  app.post('/woods', d, woods.create);
  app.post('/woods', d, woods.addImage);
  app.get('/woods', d, woods.index);
  app.get('/woods/new', d, woods.new);
  app.del('/woods/:id', d, woods.destroy);
  app.put('/woods/:id', d, woods.removePic);
  app.post('/stains', d, stains.create);
  app.post('/stains', d, stains.addImage);
  app.get('/stains', d, stains.index);
  app.get('/stains/new', d, stains.new);
  app.del('/stains/:id', d, stains.destroy);
  app.put('/stains/:id', d, stains.removePic);
  console.log('Routes Loaded');
  fn();
}

