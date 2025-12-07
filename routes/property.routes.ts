// src/routes/property.routes.ts
import { Router } from 'express';
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateStatus, 
  updateIsSpecial,
  updatePropertyFull,
  deleteProperty
} from '../controllers/property.controller';

const router = Router();

router.post('/create', createProperty);
router.get('/readAll', getAllProperties);
router.get('/readOne/:id', getPropertyById);
router.put('/update/:id', updatePropertyFull); 
router.delete('/delete/:id', deleteProperty);

// Specific update APIs
router.patch('/:id/status', updateStatus);
router.patch('/:id/is-special', updateIsSpecial);

export default router;