import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String, 
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

CommentSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

CommentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
