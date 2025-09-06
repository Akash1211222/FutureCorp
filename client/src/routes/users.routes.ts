import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN']), UsersController.getAll);
router.get('/stats', authenticate, requireRole(['ADMIN']), UsersController.getStats);
router.get('/:id', authenticate, requireRole(['ADMIN']), UsersController.getById);
router.put('/:id/role', authenticate, requireRole(['ADMIN']), UsersController.updateRole);
router.delete('/:id', authenticate, requireRole(['ADMIN']), UsersController.delete);

export default router;