import { Router } from 'express';
import { AssignmentsController } from '../controllers/assignments.controller';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', AssignmentsController.getAll);
router.get('/:id', AssignmentsController.getById);
router.post('/', authenticate, requireRole(['TEACHER', 'ADMIN']), AssignmentsController.create);
router.put('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), AssignmentsController.update);
router.delete('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), AssignmentsController.delete);
router.post('/:id/submit', authenticate, AssignmentsController.submitSolution);
router.get('/:id/submissions', authenticate, requireRole(['TEACHER', 'ADMIN']), AssignmentsController.getSubmissions);

export default router;