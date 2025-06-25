import Remark from '../models/Remark.js';
import Member from '../models/Member.js';

// Get all remarks with filtering
export const getRemarks = async (req, res) => {
  try {
    const { memberId, date, startDate, endDate, page = 1, limit = 50, sort = '-date' } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (memberId) {
      filter.memberId = memberId;
    }
    
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: targetDate,
        $lt: nextDay
      };
    } else if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get remarks with pagination
    const remarks = await Remark.find(filter)
      .populate('memberId', 'name role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Remark.countDocuments(filter);
    
    res.json({
      success: true,
      data: remarks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get remarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch remarks',
      error: error.message
    });
  }
};

// Get single remark
export const getRemark = async (req, res) => {
  try {
    const remark = await Remark.findById(req.params.id)
      .populate('memberId', 'name role');
    
    if (!remark) {
      return res.status(404).json({
        success: false,
        message: 'Remark not found'
      });
    }
    
    res.json({
      success: true,
      data: remark
    });
  } catch (error) {
    console.error('Get remark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch remark',
      error: error.message
    });
  }
};

// Create new remark
export const createRemark = async (req, res) => {
  try {
    const { memberId, remark, date } = req.body;
    
    // Verify member exists and is active
    const member = await Member.findById(memberId);
    if (!member || !member.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Member not found or inactive'
      });
    }
    
    const newRemark = new Remark({
      memberId,
      memberName: member.name,
      remark: remark.trim(),
      date: date ? new Date(date) : new Date()
    });
    
    await newRemark.save();
    
    // Populate member details for response
    await newRemark.populate('memberId', 'name role');
    
    res.status(201).json({
      success: true,
      data: newRemark,
      message: 'Remark created successfully'
    });
  } catch (error) {
    console.error('Create remark error:', error);
    
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
      message: 'Failed to create remark',
      error: error.message
    });
  }
};

// Update remark
export const updateRemark = async (req, res) => {
  try {
    const { remark, date } = req.body;
    
    const updatedRemark = await Remark.findByIdAndUpdate(
      req.params.id,
      { 
        remark: remark.trim(),
        date: date ? new Date(date) : undefined
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('memberId', 'name role');
    
    if (!updatedRemark) {
      return res.status(404).json({
        success: false,
        message: 'Remark not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedRemark,
      message: 'Remark updated successfully'
    });
  } catch (error) {
    console.error('Update remark error:', error);
    
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
      message: 'Failed to update remark',
      error: error.message
    });
  }
};

// Delete remark
export const deleteRemark = async (req, res) => {
  try {
    const remark = await Remark.findByIdAndDelete(req.params.id);
    
    if (!remark) {
      return res.status(404).json({
        success: false,
        message: 'Remark not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Remark deleted successfully'
    });
  } catch (error) {
    console.error('Delete remark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete remark',
      error: error.message
    });
  }
};

// Get remarks statistics
export const getRemarksStats = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [
      totalRemarks,
      todayRemarks,
      yesterdayRemarks,
      weekRemarks,
      monthRemarks,
      memberStats
    ] = await Promise.all([
      Remark.countDocuments(),
      Remark.countDocuments({
        date: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lt: new Date(today.setHours(23, 59, 59, 999))
        }
      }),
      Remark.countDocuments({
        date: {
          $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
          $lt: new Date(yesterday.setHours(23, 59, 59, 999))
        }
      }),
      Remark.countDocuments({
        date: { $gte: startOfWeek }
      }),
      Remark.countDocuments({
        date: { $gte: startOfMonth }
      }),
      Remark.aggregate([
        {
          $group: {
            _id: '$memberId',
            memberName: { $first: '$memberName' },
            count: { $sum: 1 },
            lastRemark: { $max: '$date' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalRemarks,
        today: todayRemarks,
        yesterday: yesterdayRemarks,
        thisWeek: weekRemarks,
        thisMonth: monthRemarks,
        memberStats
      }
    });
  } catch (error) {
    console.error('Get remarks stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};