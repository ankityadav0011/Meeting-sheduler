const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const auth = require('../middleware/auth');


router.post('/', auth, meetingController.scheduleMeeting);


router.get('/', auth, meetingController.getMeetings);




module.exports = router;
