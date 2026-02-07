export type Ticket = {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  ticket_id: string;
  author: string;
  content: string;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  ticket_id: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  performed_by: string;
  created_at: string;
};
