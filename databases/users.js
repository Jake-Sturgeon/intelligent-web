var mongoose = require('mongoose');
var objectId = require('mongodb').ObjectID;

var mongoDB = 'mongodb://localhost:27017/Web';

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongonDB connection error'));

