import { Router } from 'express';
import { AssignmentsController } from '../controllers/assignments.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', requireRole([Role.TEACHER, Role.ADMIN]), AssignmentsController.createAssignment);
router.get('/', AssignmentsController.getAssignments);
router.get('/:id', AssignmentsController.getAssignmentById);
router.post('/submit', requireRole([Role.STUDENT]), AssignmentsController.submitSolution);

export default router;