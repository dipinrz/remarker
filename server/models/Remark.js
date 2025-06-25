import mongoose from 'mongoose';

const remarkSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  memberName: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  remark: {
    type: String,
    required: [true, 'Remark is required'],
    trim: true,
    minlength: [5, 'Remark must be at least 5 characters long'],
    maxlength: [1000, 'Remark cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
remarkSchema.index({ memberId: 1, date: -1 });
remarkSchema.index({ date: -1 });
remarkSchema.index({ createdAt: -1 });

// Compound index for filtering by member and date
remarkSchema.index({ memberId: 1, date: 1 });

export default mongoose.model('Remark', remarkSchema);