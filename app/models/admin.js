'use strict';

module.exports = Admin;
var bcrypt = require('bcrypt');
var admins = global.nss.db.collection('admins');
var Mongo = require('mongodb');

function Admin(data){
  this.email = data.email;
  this.password = data.password;
}

Admin.prototype.hashPassword = function(fn){
  var self = this;

  bcrypt.hash(self.password, 8, function(err, hash){
    self.password = hash;
    fn();
  });
};

Admin.prototype.insert = function(fn){
  var self = this;

  admins.findOne({email:self.email}, function(err, record){
    if(!record){
      admins.insert(self, function(err, records){
        fn();
      });
    }else{
      fn();
    }
  });
};

Admin.findByEmailAndPassword = function(email, password, fn){
  admins.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result){
          fn(record);
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

Admin.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  admins.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};
