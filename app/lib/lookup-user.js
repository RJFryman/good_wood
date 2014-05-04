'use strict';

module.exports = function(req, res, next){
  var Admin = require('../models/admin');

  Admin.findById(req.session.adminId, function(user){
    res.locals.user = user;

    next();
  });
};
