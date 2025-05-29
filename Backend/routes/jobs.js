const express =require('express');
const { JobSearch } = require('../controllers/jobs');
const router = express.Router();


router.get('/',JobSearch)


module.exports=router