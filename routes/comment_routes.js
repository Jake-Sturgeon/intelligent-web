const express = require('express');
const router = express.Router();

var comment = require('../controllers/comments');


//Adapted the CRUD paradigm

// test
router.get('/test', comment.test);

// Create
router.post('/create', comment.eventcreate);

//READ
router.get('/:id', comment.eventdetails);

//Down sync
router.post('/downsync', comment.downsync);

//DELETE
router.delete('/:id/delete', comment.eventdelete);

//UPDATE
router.put('/:id/update', comment.eventupdate);


module.exports = router;