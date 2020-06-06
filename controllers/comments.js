const Comments = require('../models/comment');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the comment controller!');
};


/**
 * This route is used to save an comment to the mongodb, returns the resulting id
 *
 * @param req -- The request data
 * @param res -- the respoonse
 * @param next -- next
 */
exports.eventcreate = function (req, res, next) {
    let comment = new Comments(
        {
            eventid: req.body.eventid,
            postid: req.body.postid,
            comment: req.body.comment,
            created: req.body.created,
        }
    );

    comment.save(function (err, results) {
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

    //init query
    var s = {$and: []}

    //add the ids to the query
    if (!Array.isArray(req.body._id)){
        req.body._id = [req.body._id]
    }

    //if there is a id, use the query
    if(req.body._id.length > 0 ) {
        console.log(req.body)
        for (var i = 0; i < req.body._id.length; i++) {
            s.$and.push({_id: {$ne: req.body._id[i]}})
        }
        console.log(s)
        Comments.find(s,function (err, event) {
            if (err) return next(err);
            res.send(event);
        })
    //    if empty list --> return all comments
    } else {
        Comments.find(function (err, event) {
            if (err) return next(err);
            res.send(event);
        })
    }

};

/**
 * This is used to return one comment given the id
 *
 * @param req
 * @param res
 * @param next
 */
exports.eventdetails = function (req, res, next) {
    Comments.findById(req.params.id, function (err, comment) {
        if (err) return next(err);
        res.send(comment);
    })
};


/**
 * Updates the given comment
 *
 * @param req
 * @param res
 * @param next
 */
exports.eventupdate = function (req, res, next) {
    Comments.findOneAndUpdate(req.params.id, {$set: req.body}, function (err, comment) {
        if (err) return next(err);
        res.send('comment udpated.');
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
    Comments.findOneAndDelete(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};