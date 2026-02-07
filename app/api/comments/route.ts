import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import ActivityLog from '@/models/ActivityLog';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { ticket_id, author, content } = body;

    if (!ticket_id || !author || !content) {
      return NextResponse.json(
        { error: 'Ticket ID, author, and content are required' },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      ticket_id,
      author,
      content,
    });

    await ActivityLog.create({
      ticket_id,
      action: 'comment_added',
      new_value: `Comment by ${author}`,
      performed_by: author,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
