import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remark count
memberSchema.virtual('remarkCount', {
  ref: 'Remark',
  localField: '_id',
  foreignField: 'memberId',
  count: true
});

// Index for better query performance
memberSchema.index({ name: 1 });
memberSchema.index({ isActive: 1 });

export default mongoose.model('Member', memberSchema);