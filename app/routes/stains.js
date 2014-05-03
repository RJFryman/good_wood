'use strict';

var stain = require('../models/stain');
var exec = require('child_process').exec;

exports.index = function(req, res){
  res.render('stains/index');
};

exports.new = function(req, res){
  res.render('stains/new');
};

exports.find = function(req, res){
  stain.find(req.query, function(stains){
    res.send({stains:stains});
  });
};

exports.create = function(req, res){
  var stain = new stain(req.body);
  stain.insert(function(){
    stain.mkDir(function(){
      stain.addPhoto(req.files.photo.path, req.files.photo.name, function(){
        stain.update(function(){
          res.redirect('/stains');
        });
      });
    });
  });
};

exports.addImage = function(req, res){
  stain.findById(req.params.id, function(stain){
    stain.addphoto(req.files.pic.path, req.files.pic.name, function(err){
      stain.update(function(){
        res.redirect('/stains');
      });
    });
  });
};

exports.removePic = function(req, res){
  stain.findById(req.params.id, function(stain){
    stain.removePhoto(req.body.url, function(removed){
      stain.update(function(){
        res.send({stain:true});
      });
    });
  });
};

exports.destroy = function(req, res){
  stain.findById(req.params.id, function(stain){
    var cmd = 'rm -rf ' + __dirname + '/../static' + stain.photoPath;
    stain.deleteById(req.params.id, function(){
      exec(cmd, function(){
        res.redirect('stains');
      });
    });
  });
};


