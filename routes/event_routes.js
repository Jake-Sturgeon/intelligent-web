const express = require('express');
const router = express.Router();

var event = require('../controllers/events');

//Adapted the CRUD paradigm


//TEST
router.get('/test', event.test);

//Get ALL
router.get('/all', event.eventall)

// Create
router.post('/create', event.eventcreate);

//SYNC
router.post('/downsync', event.downsync);

//READ
router.get('/:id', event.eventdetails);

//DELETE
router.delete('/:id/delete', event.eventdelete);

//UPDATE
router.put('/:id/update', event.eventupdate);


module.exports = router;