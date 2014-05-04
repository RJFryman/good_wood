'use strict';

var Wood = require('../models/wood');
var exec = require('child_process').exec;

exports.index = function(req, res){
  res.render('woods/index');
};

exports.new = function(req, res){
  res.render('woods/new');
};

exports.find = function(req, res){
  Wood.find(req.query, function(woods){
    res.send({woods:woods});
  });
};

exports.create = function(req, res){
  var wood = new Wood(req.body);
  wood.insert(function(){
    wood.mkDir(function(){
      wood.addPhoto(req.files.photo.path, req.files.photo.name, function(){
        wood.update(function(){
          res.redirect('/');
        });
      });
    });
  });
};

exports.addImage = function(req, res){
  Wood.findById(req.params.id, function(wood){
    wood.addPhoto(req.files.pic.path, req.files.pic.name, function(err){
      wood.update(function(){
        res.redirect('/woods');
      });
    });
  });
};

exports.removePic = function(req, res){
  Wood.findById(req.params.id, function(wood){
    wood.removePhoto(req.body.url, function(removed){
      wood.update(function(){
        res.send({wood:true});
      });
    });
  });
};

exports.destroy = function(req, res){
  Wood.findById(req.params.id, function(wood){
    var cmd = 'rm -rf ' + __dirname + '/../static' + wood.photoPath;
    Wood.deleteById(req.params.id, function(){
      exec(cmd, function(){
        res.redirect('woods');
      });
    });
  });
};


