import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    ticket_number: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    assigned_to: {
      type: String,
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Add virtual 'id' field
TicketSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtuals are serialized
TicketSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
