var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Post schema
var PostSchema = new Schema ({
    eventid: {type: Number, required: true},
    title: {type: String, required: true, max: 100},
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    created:{type: Date, required: true},
    file:{type: Object, required: false}
});

PostSchema.set('toObject', {getters: true, virtuals:true});

module.exports = mongoose.model('Post', PostSchema)
