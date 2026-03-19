const express = require('express');
const multer = require('multer');
const {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
} = require('../controllers/petController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllPets);
router.get('/:id', getPetById);
router.post('/', upload.single('image'), createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
