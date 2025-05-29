const express = require('express');
const multer = require('multer');
const { predictJobRole } = require('../controllers/uploadController');


const router = express.Router();
const upload = multer();

router.post('/', upload.single('resume'), predictJobRole);

module.exports = router;
