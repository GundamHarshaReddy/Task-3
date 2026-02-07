import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import ActivityLog from '@/models/ActivityLog';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    const query: any = { is_deleted: false };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const tickets = await Ticket.find(query).sort({ created_at: -1 });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, category, priority } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const lastTicket = await Ticket.findOne({}).sort({ created_at: -1 });

    let nextNumber = 1001;
    if (lastTicket?.ticket_number) {
      const lastNumber = parseInt(lastTicket.ticket_number.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    const ticketNumber = `INF-${nextNumber}`;

    const newTicket = await Ticket.create({
      ticket_number: ticketNumber,
      title,
      description,
      category: category || 'General',
      priority: priority || 'medium',
      status: 'open',
    });

    await ActivityLog.create({
      ticket_id: newTicket.id,
      action: 'ticket_created',
      new_value: 'open',
      performed_by: 'System',
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
