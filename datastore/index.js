const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => { 
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(new Error('error message for this id'));
    } else {
      callback(null, {id, text: text.toString()});
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var data = _.map(files, (file) => {
      var id = path.basename(file, `.txt`);
      return {
        id: id,
        text: id
      }
    });
    callback(null, data);
  });
};

exports.update = (id, text, callback) => { // readOne, but write instead of read
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, val) => {
    if (err) {
      callback(new Error("Error"));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error("Error"));
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error("Error"));
    } else {
      callback(null, id);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
