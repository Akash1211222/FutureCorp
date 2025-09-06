import { Router } from 'express';
import { ClassesController } from '../controllers/classes.controller';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', ClassesController.getAll);
router.get('/:id', ClassesController.getById);
router.post('/', authenticate, requireRole(['TEACHER', 'ADMIN']), ClassesController.create);
router.put('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), ClassesController.update);
router.delete('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), ClassesController.delete);

export default router;