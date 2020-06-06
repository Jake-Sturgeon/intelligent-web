var mongoose = require('mongoose');

var Schema = mongoose.Schema;


//Event schema
var EventSchema = new Schema ({

    title: {type: String, required: true, max: 100},
    id: {type: Number, required: true},
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    created:{type: Date, required: true},
    file:{type: Object, required: false},
    radius:{type: Number, required: true},

});

EventSchema.set('toObject', {getters: true, virtuals:true});

module.exports = mongoose.model('Event', EventSchema)
