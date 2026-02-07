import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    old_value: {
      type: String,
      default: null,
    },
    new_value: {
      type: String,
      default: null,
    },
    performed_by: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

ActivityLogSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

ActivityLogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
