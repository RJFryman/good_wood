'use strict';

module.exports = Product;

var products = global.nss.db.collection('products');
var fs = require('fs');
var Mongo = require('mongodb');

function Product(data){
  this.name = data.name;
  this.desc = data.desc;
  this.pic = data.pic;
}

Product.prototype.insert = function(fn){
  products.insert(this, function(err, record){
    fn(record);
  });
};

Product.prototype.update = function(fn){
  products.update({_id:this._id}, this, function(err, count){
    fn(count);
  });
};

Product.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  products.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Product.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  products.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Product.find = function(query, fn){
  var limit = query.limit || 10;
  var skip = query.page ? (query.page - 1) * limit : 0;
  var filter = {};
  var sort = [];

  if(query.filterName === 'name'){
    query.filterValue = new RegExp(query.filterValue);
  }else if(query.filterValue === 'desc'){
    query.filterValue = new RegExp(query.filterValue);
  }

  filter[query.filtername] = query.filterValue;

  if(query.sort){
    var direction = query.direction ? query.direction * 1 : 1;
    sort.push([query.sort, direction]);
  }

  products.find(filter, {sort:sort, skip:skip, limit:limit}).toArray(function(err, records){
    fn(records);
  });
};

Product.prototype.mkDir = function(fn){
  var dirname = this.name.toString();
  var abspath = __dirname + '/../static';
  var relpath = '/img/products/' + dirname;
  fs.mkdirSync(abspath + relpath);
  this.photopath = relpath;
  fn();
};

Product.prototype.addPhoto = function(oldPath, filename, fn){
  var self = this;
  var abspath= __dirname + '/../static';
  var relpath = '/img/products/' + this.name.toString() + '/' + filename;

  fs.rename(oldPath, abspath + relpath, function(err){
    self.photos.push(relpath);
    fn();
  });
};

Product.prototype.removePhoto = function(path, fn){
  var removed = _.remove(this.photos, function(photo){
    return photo === path;
  });
  fn(removed);
};

