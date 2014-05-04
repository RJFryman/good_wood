'use strict';

var Product = require('../models/product');
var exec = require('child_process').exec;

exports.index = function(req, res){
  res.render('products/index');
};

exports.new = function(req, res){
  res.render('products/new');
};

exports.find = function(req, res){
  Product.find(req.query, function(products){
    res.send({products:products});
  });
};

exports.create = function(req, res){
  var product = new Product(req.body);
  product.insert(function(){
    product.mkDir(function(){
      product.addPhoto(req.files.photos.path, req.files.photos.name, function(){
        product.update(function(){
          res.redirect('/');
        });
      });
    });
  });
};

exports.addImage = function(req, res){
  Product.findById(req.params.id, function(product){
    product.addphoto(req.files.pic.path, req.files.pic.name, function(err){
      product.update(function(){
        res.redirect('/products');
      });
    });
  });
};

exports.removePic = function(req, res){
  Product.findById(req.params.id, function(product){
    product.removePhoto(req.body.url, function(removed){
      product.update(function(){
        res.send({product:true});
      });
    });
  });
};

exports.destroy = function(req, res){
  Product.findById(req.params.id, function(product){
    var cmd = 'rm -rf ' + __dirname + '/../static' + product.photoPath;
    Product.deleteById(req.params.id, function(){
      exec(cmd, function(){
        res.redirect('products');
      });
    });
  });
};


