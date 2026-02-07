import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET() {
  try {
    await connectDB();
    const allTickets = await Ticket.find({ is_deleted: false });

    const stats = {
      total: allTickets.length,
      open: allTickets.filter((t) => t.status === 'open').length,
      in_progress: allTickets.filter((t) => t.status === 'in_progress').length,
      resolved: allTickets.filter((t) => t.status === 'resolved').length,
      closed: allTickets.filter((t) => t.status === 'closed').length,
      high_priority: allTickets.filter(
        (t) => t.priority === 'high' || t.priority === 'urgent'
      ).length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
