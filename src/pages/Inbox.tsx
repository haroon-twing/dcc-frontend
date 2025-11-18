import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCommunication } from "../contexts/CommunicationContext";
import InboxLayout from "../components/InboxLayout";
import api from "../lib/api";

interface Lead {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
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

const Inbox: React.FC = () => {
  const { user } = useAuth();
  const { markLeadAsRead, refreshLeads } = useCommunication();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchAssignedLeads = async () => {
    if (!user) return;

    try {
      const response = await api.get(`/leads?assignedToId=${user.id}`);
      const leadsData = response.data.data || [];
      setLeads(leadsData);
      // Refresh context counts after fetching leads
      refreshLeads();
    } catch (error) {
      console.error("Error fetching assigned leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedLeads();
  }, [user]);

  const handleMarkAsRead = async (leadId: string) => {
    if (!user) return;

    try {
      await api.put(`/leads/${leadId}/read`);
      markLeadAsRead(leadId); // Update context
      // Update local state
      setLeads(
        leads.map((lead) =>
          lead._id === leadId ? { ...lead, isRead: true } : lead
        )
      );
      refreshLeads(); // Refresh context counts
    } catch (error) {
      console.error("Error marking lead as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading inbox...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <InboxLayout
        leads={leads}
        onLeadClick={setSelectedLead}
        selectedLead={selectedLead}
        onCloseLead={() => setSelectedLead(null)}
        onMarkAsRead={handleMarkAsRead}
        onRefresh={fetchAssignedLeads}
        refreshing={loading}
      />
    </div>
  );
};

export default Inbox;