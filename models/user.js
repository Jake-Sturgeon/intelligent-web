var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema ({

    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100}

});

User.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};

User.set('toObject', {getters: true, virtuals:true});

module.exports = mongoose.model('User', User)
