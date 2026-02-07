'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Ticket, Comment, ActivityLog } from '@/lib/types';

const statusColors = {
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-800 border-amber-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-slate-100 text-slate-800 border-slate-200',
};

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
};

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    fetchTicketDetails();
  }, [params.id]);

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      const data = await response.json();
      setTicket(data.ticket);
      setComments(data.comments);
      setActivityLogs(data.activityLogs);
      setAssignedTo(data.ticket.assigned_to || '');
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: params.id,
          author: commentAuthor,
          content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchTicketDetails();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTicket = async (
    field: string,
    value: string,
    performedBy = 'Admin'
  ) => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: value,
          performed_by: performedBy,
        }),
      });

      if (response.ok) {
        fetchTicketDetails();
      }
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const handleSoftDelete = async () => {
    if (!confirm('Are you sure you want to close this ticket?')) return;

    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_deleted: true,
          performed_by: 'Admin',
        }),
      });

      if (response.ok) {
        router.push('/tickets');
      }
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Ticket not found</p>
          <Link href="/tickets">
            <Button>Back to Tickets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/tickets"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to All Tickets
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-lg font-semibold text-slate-900">
                  {ticket.ticket_number}
                </span>
                <Badge
                  className={
                    statusColors[ticket.status as keyof typeof statusColors]
                  }
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge
                  className={
                    priorityColors[ticket.priority as keyof typeof priorityColors]
                  }
                >
                  {ticket.priority}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {ticket.title}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Category: {ticket.category}
              </p>
            </div>
            <Button variant="destructive" onClick={handleSoftDelete}>
              Close Ticket
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Description
                    </label>
                    <p className="text-slate-900 whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <span className="text-sm text-slate-600">Created</span>
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(ticket.created_at)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">
                        Last Updated
                      </span>
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(ticket.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comments ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Your name"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Adding...' : 'Add Comment'}
                    </Button>
                  </div>
                </form>

                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                      No comments yet
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-l-4 border-blue-500 bg-slate-50 p-4 rounded-r"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-slate-900">
                            {comment.author}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Controls</CardTitle>
                <CardDescription>Manage ticket status and assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Status
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) =>
                      handleUpdateTicket('status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Priority
                  </label>
                  <Select
                    value={ticket.priority}
                    onValueChange={(value) =>
                      handleUpdateTicket('priority', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Assign To
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter name"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleUpdateTicket('assigned_to', assignedTo)
                      }
                      size="sm"
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No activity yet
                    </p>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="border-l-2 border-slate-300 pl-4 pb-3">
                        <div className="text-xs text-slate-500 mb-1">
                          {formatDate(log.created_at)}
                        </div>
                        <div className="text-sm text-slate-900">
                          <span className="font-medium">{log.performed_by}</span>{' '}
                          {log.action.replace('_', ' ')}
                          {log.old_value && log.new_value && (
                            <span className="text-slate-600">
                              {' '}
                              from <span className="font-medium">{log.old_value}</span> to{' '}
                              <span className="font-medium">{log.new_value}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
