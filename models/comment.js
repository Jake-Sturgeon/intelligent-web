var mongoose = require('mongoose');

var Schema = mongoose.Schema;


//Create comment schema
var CommentSchema = new Schema ({
    postid:{type: String},
    eventid:{type: Number},
    comment:{type: String, required: true, max: 250},
    created:{type: Date, required: true},
});

CommentSchema.set('toObject', {getters: true, virtuals:true});

module.exports = mongoose.model('Comment', CommentSchema)
