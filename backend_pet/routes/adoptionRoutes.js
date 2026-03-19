const express = require('express');
const {
    createAdoptionRequest,
    getAllAdoptionRequests
} = require('../controllers/adoptionController');

const router = express.Router();

router.post('/', createAdoptionRequest);
router.get('/', getAllAdoptionRequests);

module.exports = router;
