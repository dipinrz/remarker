import express from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController.js';

const router = express.Router();

// GET /api/members - Get all members
router.get('/', getMembers);

// GET /api/members/:id - Get single member
router.get('/:id', getMember);

// POST /api/members - Create new member
router.post('/', createMember);

// PUT /api/members/:id - Update member
router.put('/:id', updateMember);

// DELETE /api/members/:id - Delete member
router.delete('/:id', deleteMember);

export default router;