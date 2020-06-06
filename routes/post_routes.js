const express = require('express');
const router = express.Router();


var post = require('../controllers/posts');

//Adapted the CRUD paradigm

//TEST
router.get('/test', post.test);

// CREATE
router.post('/create', post.postcreate);

//READ
router.get('/:id', post.postdetails);

//SYNC
router.post('/downsync', post.downsync);

//DELTE
router.delete('/:id/delete', post.postdelete);

//UPDATE
router.put('/:id/update', post.postupdate);


module.exports = router;