import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', requireRole([Role.ADMIN, Role.TEACHER]), UsersController.getAllUsers);
router.get('/students', requireRole([Role.ADMIN, Role.TEACHER]), UsersController.getStudents);
router.get('/:id', UsersController.getUserById);
router.get('/:id/stats', UsersController.getUserStats);

export default router;