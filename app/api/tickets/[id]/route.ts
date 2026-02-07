import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import Comment from '@/models/Comment';
import ActivityLog from '@/models/ActivityLog';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const ticket = await Ticket.findOne({ _id: params.id, is_deleted: false });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const comments = await Comment.find({ ticket_id: params.id }).sort({
      created_at: 1,
    });

    const activityLogs = await ActivityLog.find({ ticket_id: params.id }).sort({
      created_at: -1,
    });

    return NextResponse.json({
      ticket,
      comments: comments || [],
      activityLogs: activityLogs || [],
    });
  } catch (error) {
    console.error('Fetch ticket details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { status, priority, assigned_to, is_deleted, performed_by } = body;

    const currentTicket = await Ticket.findById(params.id);

    if (!currentTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (status !== undefined && status !== currentTicket.status) {
      await ActivityLog.create({
        ticket_id: params.id,
        action: 'status_changed',
        old_value: currentTicket.status,
        new_value: status,
        performed_by: performed_by || 'Admin',
      });
      currentTicket.status = status;
    }

    if (priority !== undefined && priority !== currentTicket.priority) {
      await ActivityLog.create({
        ticket_id: params.id,
        action: 'priority_changed',
        old_value: currentTicket.priority,
        new_value: priority,
        performed_by: performed_by || 'Admin',
      });
      currentTicket.priority = priority;
    }

    if (assigned_to !== undefined && assigned_to !== currentTicket.assigned_to) {
      await ActivityLog.create({
        ticket_id: params.id,
        action: 'assigned',
        old_value: currentTicket.assigned_to,
        new_value: assigned_to,
        performed_by: performed_by || 'Admin',
      });
      currentTicket.assigned_to = assigned_to;
    }

    if (is_deleted !== undefined && is_deleted !== currentTicket.is_deleted) {
      await ActivityLog.create({
        ticket_id: params.id,
        action: is_deleted ? 'ticket_deleted' : 'ticket_restored',
        performed_by: performed_by || 'Admin',
      });
      currentTicket.is_deleted = is_deleted;
    }

    await currentTicket.save();

    return NextResponse.json(currentTicket);
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
