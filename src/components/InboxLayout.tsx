import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LeadViewModal from './UI/LeadViewModal';

interface Lead {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  documentFile?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  };
  contactInfo?: {
    name: string;
    email: string;
    company: string;
  };
  assignedToId?: {
    _id: string;
    name: string;
    email: string;
  };
  assignedUsers: Array<{
    userId: {
      _id: string;
      name: string;
    };
  }>;
  createdById: {
    _id: string;
    name: string;
    email: string;
  };
  departmentId: {
    _id: string;
    name: string;
  };
  estimatedValue?: number;
  isRead: boolean;
  unreadResponses: number;
  createdAt: string;
  updatedAt: string;
}

interface InboxLayoutProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  selectedLead: Lead | null;
  onCloseLead: () => void;
  onMarkAsRead: (leadId: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function InboxLayout({
  leads,
  onLeadClick,
  selectedLead,
  onCloseLead,
  onMarkAsRead,
  onRefresh,
  refreshing = false,
}: InboxLayoutProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const { user } = useAuth();

  const filteredLeads = leads.filter(lead => {
    if (filter === 'unread') return !lead.isRead;
    if (filter === 'read') return lead.isRead;
    return true;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'status':
        return a.status.localeCompare(b.status);
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30';
      case 'contacted': return 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30';
      case 'qualified': return 'text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30';
      case 'proposal': return 'text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/30';
      case 'negotiation': return 'text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30';
      case 'closed-won': return 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/30';
      case 'closed-lost': return 'text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Filters</h2>
          <div className="space-y-2">
            <button
              onClick={() => setFilter('all')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-100 dark:bg-purple-900/40 text-blue-700 dark:text-purple-200' 
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              All Leads ({leads.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-blue-100 dark:bg-purple-900/40 text-blue-700 dark:text-purple-200' 
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Unread ({leads.filter(l => !l.isRead).length})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-blue-100 dark:bg-purple-900/40 text-blue-700 dark:text-purple-200' 
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Read ({leads.filter(l => l.isRead).length})
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">Sort by</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'status')}
            className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
              <p className="text-muted-foreground mt-1">
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} 
                {filter !== 'all' && ` (${filter})`}
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-600 dark:bg-purple-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {refreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    Refresh
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto">
          {sortedLeads.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-muted-foreground text-6xl mb-4">📧</div>
                <h3 className="text-lg font-medium text-foreground mb-2">No leads found</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' ? 'No unread leads' : 
                   filter === 'read' ? 'No read leads' : 'No leads available'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => {
                    onLeadClick(lead);
                    if (!lead.isRead) {
                      onMarkAsRead(lead._id);
                    }
                  }}
                  className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                    !lead.isRead ? 'bg-blue-50 dark:bg-purple-900/20 border-l-4 border-l-blue-500 dark:border-l-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-sm font-medium truncate ${
                          !lead.isRead ? 'text-foreground font-semibold' : 'text-foreground'
                        }`}>
                          {lead.title}
                        </h3>
                        {!lead.isRead && (
                          <div className="w-2 h-2 bg-blue-500 dark:bg-purple-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                          {lead.contactInfo?.name || 'No Contact'}
                        </span>
                        <span>{lead.contactInfo?.company || 'No Company'}</span>
                        {lead.estimatedValue && (
                          <span className="font-medium text-green-600 dark:text-green-400">
                            ${lead.estimatedValue.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {lead.description}
                      </p>

                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lead.departmentId?.name}
                        </span>
                        {lead.documentFile && (
                          <a
                            href={`/api/leads/documents/${lead.documentFile.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 dark:text-purple-400 hover:text-blue-800 dark:hover:text-purple-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Document
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col items-end">
                      <span className="text-xs text-muted-foreground mb-1">
                        {formatDate(lead.createdAt)}
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {(lead.contactInfo?.name || 'L').charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadViewModal
          isOpen={!!selectedLead}
          onClose={onCloseLead}
          leadId={selectedLead._id}
        />
      )}
    </div>
  );
}