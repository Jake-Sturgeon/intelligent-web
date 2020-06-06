const Posts = require('../models/post');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Post controller!');
};


/**
 * This route is used to save an post to the mongodb, returns the resulting id
 *
 * @param req -- The request data
 * @param res -- the respoonse
 * @param next -- next
 */
exports.postcreate = function (req, res, next) {
    let post = new Posts(
        {
            eventid: req.body.eventid,
            title: req.body.title,
            lat: req.body.lat,
            lon: req.body.lon,
            file: req.body.image,
            created: req.body.created,
        }
    );

    post.save(function (err, results) {
        if (err) {
            return next(err);
        }
        res.send(JSON.stringify(results._id))
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

    if (!Array.isArray(req.body._id)){
        req.body._id = [req.body._id]
    }

    if(req.body._id.length > 0 ) {
        console.log(req.body)
        for (var i = 0; i < req.body._id.length; i++) {
            s.$and.push({_id: {$ne: req.body._id[i]}})
        }
        console.log(s)
        Posts.find(s,function (err, event) {
            if (err) return next(err);
            res.send(event);
        })
    } else {
        Posts.find(function (err, event) {
            if (err) return next(err);
            res.send(event);
        })
    }

};
/**
 * Returns the given post
 *
 * @param req
 * @param res
 * @param next
 */
exports.postdetails = function (req, res, next) {
    Posts.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.send(post);
    })
};

/**
 * Updates the given post
 *
 * @param req
 * @param res
 * @param next
 */
exports.postupdate = function (req, res, next) {
    Posts.findOneAndUpdate(req.params.id, {$set: req.body}, function (err, post) {
        if (err) return next(err);
        res.send('Post udpated.');
    });
};

/**
 * Deletes the given post
 *
 * @param req
 * @param res
 * @param next
 */
exports.postdelete = function (req, res, next) {
    Posts.findOneAndDelete(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};