import { Router } from 'express';
import { ClassesController } from '../controllers/classes.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { Role } from '../services/auth.service.js';

const router = Router();

router.use(authenticate);

router.post('/', requireRole([Role.TEACHER, Role.ADMIN]), ClassesController.createClass);
router.get('/', ClassesController.getClasses);
router.get('/:id', ClassesController.getClassById);
router.post('/:id/start', requireRole([Role.TEACHER, Role.ADMIN]), ClassesController.startClass);
router.post('/:id/join', ClassesController.joinClass);

export default router;