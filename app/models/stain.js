'use strict';

module.exports = Stain;

var stains = global.nss.db.collection('stains');
var Mongo = require('mongodb');
var fs = require('fs');

function Stain(data){
  this.name = data.name;
  this.desc = data.desc;
  this.pic = data.pic;
}

Stain.prototype.insert = function(fn){
  stains.inster(this, function(err, record){
    fn(record);
  });
};

Stain.prototype.update = function(fn){
  stains.update({_id:this._id}, this, function(err, count){
    fn(count);
  });
};

Stain.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  stains.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Stain.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  stains.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Stain.find = function(query, fn){
  var limit = query.limit || 10;
  var skip = query.page ? (query.page -1) * limit: 0;
  var filter = {};
  var sort = [];

  if(query.filterName === 'name'){
    query.filterValue = new RegExp(query.filterValue);
  }else if(query.filterValue === 'desc'){
    query.filterValue = new RegExp(query.filterValue);
  }

  filter[query.filtername]= query.filterValue;

  if(query.sort){
    var direction = query.direction ? query.direction * 1:1;
    sort.push([query.sort, direction]);
  }

  stains.find(filter, {sort:sort, skip:skip, limit:limit}).toArray(function(err, records){
    fn(records);
  });
};

Stain.prototype.mkdir = function(fn){
  var dirname = this.name.toString();
  var abspath = __dirname + '/../static';
  var relpath = '/img/stains/' + dirname;
  fs.mkdirSync(abspath + relpath);
  this.photopath = relpath;
  fn();
};

Stain.prototype.addPhoto = function(oldPath, filename, fn){
  var self = this;
  var abspath = __dirname + '/../static';
  var relpath = '/img/stains' + this.name.toString() + '/' + filename;

  fs.rename(oldPath, abspath + relpath , function(err){
    self.photos.push(relpath);
    fn();
  });
};

Stain.prototype.removePhoto = function(path, fn){
  var removed = _.remove(this.photos, function(photo){
    return photo === path;
  });
  fn(removed);
};


