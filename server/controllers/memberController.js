import Member from '../models/Member.js';
import Remark from '../models/Remark.js';

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ isActive: true })
      .populate('remarkCount')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
      error: error.message
    });
  }
};

// Get single member
export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('remarkCount');
    
    if (!member || !member.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member',
      error: error.message
    });
  }
};

// Create new member
export const createMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    
    // Check if member with same name already exists
    const existingMember = await Member.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true 
    });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'A member with this name already exists'
      });
    }
    
    const member = new Member({
      name: name.trim(),
      role: role.trim()
    });
    
    await member.save();
    
    res.status(201).json({
      success: true,
      data: member,
      message: 'Member created successfully'
    });
  } catch (error) {
    console.error('Create member error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create member',
      error: error.message
    });
  }
};

// Update member
export const updateMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    
    // Check if another member with same name exists
    const existingMember = await Member.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id },
      isActive: true 
    });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'A member with this name already exists'
      });
    }
    
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { 
        name: name.trim(), 
        role: role.trim() 
      },
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!member || !member.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    // Update member name in all remarks
    await Remark.updateMany(
      { memberId: member._id },
      { memberName: member.name }
    );
    
    res.json({
      success: true,
      data: member,
      message: 'Member updated successfully'
    });
  } catch (error) {
    console.error('Update member error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update member',
      error: error.message
    });
  }
};

// Delete member (soft delete)
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete member',
      error: error.message
    });
  }
};