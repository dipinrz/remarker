import express from 'express';
import {
  getRemarks,
  getRemark,
  createRemark,
  updateRemark,
  deleteRemark,
  getRemarksStats
} from '../controllers/remarkController.js';

const router = express.Router();

// GET /api/remarks/stats - Get remarks statistics
router.get('/stats', getRemarksStats);

// GET /api/remarks - Get all remarks with filtering
router.get('/', getRemarks);

// GET /api/remarks/:id - Get single remark
router.get('/:id', getRemark);

// POST /api/remarks - Create new remark
router.post('/', createRemark);

// PUT /api/remarks/:id - Update remark
router.put('/:id', updateRemark);

// DELETE /api/remarks/:id - Delete remark
router.delete('/:id', deleteRemark);

export default router;