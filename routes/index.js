/**
 * Index routes, provides information for main bulk of server. Produces get requests for main websites, as well as creation
 * @module Routing
 *  @class index-routing
 * @requires  express, router, postcodesIO
 *
 */
var express = require('express');
var session = require('express-session');
var router = express.Router();
var PostcodesIO = require('postcodesio-client');
var postcodes = new PostcodesIO();
const fs = require("fs-extra");







// var user = require('../controllers/users');

// add the mongo event routes
var event = require('./event_routes');
router.use('/events', event);

// add the mongo post routes
var post = require('./post_routes');
router.use('/posts', post);

// add the mongo comments routes
var comment = require('./comment_routes');
router.use('/comments', comment);

//init mondo database
var initDB = require('../controllers/init');
initDB.init();
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const Event = mongoose.model('Event');




//DATA BASE

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

router.use(session({ secret: "cats" }));
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log("User")
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true
    },
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
      failureRedirect: '/signin'})
);

router.get('/logout', function(req, res){
    req.logout();
    req.session.destroy(function (err) {

        res.redirect('/'); //Inside a callback… bulletproof!
    });
});


/* GET home page. */
/**
 * Router get main index, renders the main map.
 *
 * @method router.get('/' ...
 */
router.get('/', function(req, res, next) {
  res.render('map', { title: 'Rate My Selfie'});
});


/**
 * Router partial, renders the view for a post.
 *
 * @method
 */
router.get('/postpartial', function(req, res, next) {
    idval = req.query.id
    postid = req.query.postid
    res.render('partial/post', {id:idval, postid:postid, layout: !req.xhr});
});

/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method methodName
 * @param {String} foo Argument 1
 * @param {Object} config A config object
 * @param {String} config.name The name on the config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Boolean} Returns true on success
 */
router.get('/eventpartial', function(req, res, next) {
    id = req.query.id
    title = req.query.title
    radius = req.query.radius
    lat = req.query.lat
    lon = req.query.lon
    db = req.query.db
    city = ""
    pc = ""
    // postcodes.near(parseFloat(lat), parseFloat(lon)).then(postcode => {x
    //     console.log(postcode[0])
    //     city=postcode[0].nuts
    //     console.log(city)
    //     pc = (postcode[0].postcode)
    //     console.log(pc)
    //     res.render('partial/event', {id: id, title:title, radius:radius, postcode:pc, city:city, layout: !req.xhr});
    // }, function(error){
    //     console.log(error)
    //     city = "N/A"
    //     pc = "N/A"
    //     res.render('partial/event', {id: id, title:title, radius:radius, postcode:pc, city:city, layout: !req.xhr});
    // });
    res.render('partial/event', {id: id, title:title, radius:radius, postcode:pc, city:city, db:db, layout: !req.xhr});


});

/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method methodName
 * @param {String} foo Argument 1
 * @param {Object} config A config object
 * @param {String} config.name The name on the config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Boolean} Returns true on success
 */
router.get('/eventpartial', function(req, res, next) {
    id = req.query.id
    res.render('partial/event', {id: id, layout: !req.xhr});
});


router.get('/editeventpartial', function(req, res, next) {
    id = req.query.id
    title = req.query.title
    radius = req.query.radius
    lat = req.query.lat
    lon = req.query.lon
    res.render('partial/editevent', {id: id, title:title, radius:radius, lat:lat, lon:lon, layout: !req.xhr});
});
/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method methodName
 * @param {String} foo Argument 1
 * @param {Object} config A config object
 * @param {String} config.name The name on the config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Boolean} Returns true on success
 */
router.get('/index', isLoggedIn, function(req, res, next) {
  res.render('map', { title: 'Rate My Selfie'});
});

/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method methodName
 * @param {String} foo Argument 1
 * @param {Object} config A config object
 * @param {String} config.name The name on the config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Boolean} Returns true on success
 */
router.get('/map', isLoggedIn ,function(req, res, next) {
    res.render('map', { title: 'Map' });
});




/**
 * Get request for sign-in
 *
 * @method getSignIn
 */
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
});

/**
 * GET request for sign-up
 *
 * @method getSignup
 */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

/**
 * Post request for search
 *
 * @method postSearch
 * @param {String} Text
 * @param {Object} Option
 * @return {Boolean} Returns true on success
 */
router.post('/search', function(req, res, next) {
  var text = req.body.text
  var option = req.body.option
  var events = JSON.parse(req.body.events)
  var returned_events = new Array();
  var distance = 0

postcodes.lookup(text).then(postcode => {
  userData = postcode;
  var long = userData.longitude
  var lati = userData.latitude
  for (var i = 0, len = events.length; i < len; ++i) {
    var title = events[i].title;
    var long2 = events[i].lon;
    var lati2 = events[i].lat;
    var distance = (((parseFloat(long) - parseFloat(long2))**2 + (parseFloat(lati) - parseFloat(lati2))**2)**1/2)*111*100
    returned_events.push({"id":events[i].id, "dis":distance})
  }
  res.send(JSON.stringify(returned_events));
});

});

/**
 * Post request for search
 *
 * @method postSearch
 * @param {String} Text
 * @param {Object} Option
 * @return {Boolean} Returns true on success
 */
router.post('/searchpostcode', function(req, res, next) {
    var text = req.body.postcode
    console.log(text)
    if (text.length > 0) {
        postcodes.lookup(text).then(postcode => {
            res.send({lon: postcode.longitude, lat:postcode.latitude});
        });
    }
});

/**
 * Router post
 *
 * @method methodName
 * @param {String} foo Argument 1
 * @param {Object} config A config object
 * @param {String} config.name The name on the config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Boolean} Returns true on success
 */
router.post('/uploadpicture', function (req, res, next) {
      var userId= req.body.userId;
      var newString = new Date().getTime();
      var imageBlob = req.body.imageBlob.replace(/^data:image\/\w+;base64,/,
          "");
      var data = {user:userId, file:imageBlob}
      //AT THIS POINT, SAVE TO MONGODB
      res.end(JSON.stringify({data: 'Sent To Server'}));
});

/**
 * Checks if the user is logged in, if authenticated, carry on, else return to sign in page
 *
 * @method isLoggedIn
 * @param {Object} req, request object
 * @param {Object} res, result
 * @param {Object} next, next
 */
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(302, '/signin');
}

module.exports = router;
