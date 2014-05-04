'use strict';

module.exports = Wood;

var woods = global.nss.db.collection('woods');
var Mongo = require('mongodb');
var fs = require('fs');
var _ = require('lodash');


function Wood(data){
  this.name = data.name;
  this.desc = data.desc;
  this.photos = [];
  this.suggestedStain = data.suggestedStain;
  this.isPremium = data.isPremium;
}

Wood.prototype.insert = function(fn){
  woods.insert(this, function(err, record){
    fn(record);
  });
};

Wood.prototype.update = function(fn){
  woods.update({_id:this._id}, this, function(err,count){
    fn(count);
  });
};

Wood.deleteById= function(id, fn){
  var _id = Mongo.ObjectID(id);
  woods.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Wood.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  woods.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};


Wood.find = function(query, fn){
  var limit = query.limit || 10;
  var skip = query.page ? (query.page -1) * limit : 0;
  var filter = {};
  var sort = [];

  if(query.filterName === 'name'){
    query.filterValue = new RegExp(query.filterValue);
  }else if(query.filterName === 'desc'){
    query.filterValue = new RegExp(query.filterValue);
  }

  filter[query.filtername] = query.filterValue;

  if(query.sort){
    var direction = query.direction ? query.direction * 1 : 1;
    sort.push([query.sort, direction]);
  }

  woods.find(filter, {sort:sort, skip:skip, limit:limit}).toArray(function(err, records){
    fn(records);
  });
};

Wood.prototype.mkDir = function(fn){
  var dirname = this._id.toString();
  var abspath = __dirname + '/../static';
  var relpath = '/img/woods/' + dirname;
  fs.mkdirSync(abspath + relpath);
  this.photoPath = relpath;
  fn();
};

Wood.prototype.addPhoto = function(oldPath, filename, fn){
  var self = this;
  var abspath = __dirname + '/../static';
  var relpath = '/img/woods/' + this._id.toString() + '/' + filename;

  fs.rename(oldPath, abspath + relpath, function(err){
    self.photos.push(relpath);
    fn();
  });
};

Wood.prototype.removePhoto = function(path, fn){
  var removed = _.remove(this.photos, function(photo){
    return photo === path;
  });
  fn(removed);
};


