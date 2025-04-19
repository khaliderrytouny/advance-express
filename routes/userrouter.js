const express = require('express');
const router = express.Router();
const allUsers = require('../Controllers/userController')
const { verifyJWT } = require('../middleware/verifyJWT');


router.use(verifyJWT);
router.route('/').get(allUsers.getAllusers);

module.exports= router;