'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function NewTicketPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const ticket = await response.json();
        router.push(`/tickets/${ticket.id}`);
      } else {
        alert('Failed to create ticket. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-semibold text-slate-900">
            Create New Ticket
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Submit a new support request
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
            <CardDescription>
              Provide details about your request or issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700 block mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Brief summary of your issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-700 block mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your request..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-slate-700 block mb-2"
                  >
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Feature Request">
                        Feature Request
                      </SelectItem>
                      <SelectItem value="Bug Report">Bug Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium text-slate-700 block mb-2"
                  >
                    Priority
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
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
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </Button>
                <Link href="/tickets">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span>Provide a clear and descriptive title</span>
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span>Include all relevant details in the description</span>
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span>Select the appropriate category for faster routing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span>Set priority based on urgency and business impact</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
