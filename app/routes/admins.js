'use strict';

var Admin = require('../models/admin');

exports.register = function(req, res){
  var admin = new Admin(req.body);
  admin.hashPassword(function(){
    admin.insert(function(){
      res.send({});
    });
  });
};

exports.login =function(req,res){
  Admin.findByEmailAndPassword(req.body.email, req.body.password, function(admin){
    if(admin){
      req.session.adminId = admin._id;
      res.send({});
    }else{
      req.session = null;
      res.send({});
    }
  });
};

