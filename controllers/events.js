const Event = require('../models/event');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

/**
 * This route is used to save an event to the mongodb, returns the resulting id
 *
 * @param req -- The request data
 * @param res -- the respoonse
 * @param next -- next
 */
exports.eventcreate = function (req, res, next) {
    let event = new Event(
        {
            id: req.body.id,
            title: req.body.title,
            lat: req.body.lat,
            lon: req.body.lon,
            file: req.body.file,
            created: req.body.created,
            radius: req.body.radius,
        }
    );

    event.save(function (err, results) {
        if (err) {
            return next(err);
        }
        res.send(JSON.stringify(results._id))
    })
};

/**
 * This route is used to return all the events
 *
 * @param req -- The request data
 * @param res -- the respoonse
 * @param next -- next
 */
exports.eventall = function (req, res, next) {
    Event.find(function (err, event) {
        if (err) return next(err);
        res.send(event);
    })
};

/**
 * This route creates a query of all the object ids that are stored in the indexdb.
 * This will return all the events that dont match any of the ids in the query
 *
 * @param req
 * @param res
 * @param next
 */
exports.downsync = function (req, res, next) {
   var s = {$and: []}
   console.log(req)

   //init query
   if (!Array.isArray(req.body._id)){
           req.body._id = [req.body._id]
       }
   //add the ids to the query
   for (i = 0; i < req.body._id.length; i++) {
      s.$and.push({_id: {$ne: req.body._id[i]}})
   }

   //if there is a id, use the query
   if(req.body._id.length > 0 ) {
       Event.find(s,function (err, event) {
           if (err) return next(err);
           res.send(event);
       })
   //    if empty list --> return all events
   } else {
       Event.find(function (err, event) {
           if (err) return next(err);
           res.send(event);
       })
   }

};

/**
 * This is used to return one event given the id
 *
 * @param req
 * @param res
 * @param next
 */
exports.eventdetails = function (req, res, next) {
    Event.findById(req.params.id, function (err, event) {
        if (err) return next(err);
        res.send(event);
    })
};

/**
 * Updates the given event
 *
 * @param req
 * @param res
 * @param next
 */
exports.eventupdate = function (req, res, next) {
    Event.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, event) {
        if (err) return next(err);
        res.send('event udpated.');
    });
};

/**
 * Deletes the given comment
 *
 * @param req
 * @param res
 * @param next
 */
exports.eventdelete = function (req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};