import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

interface CommunicationContextType {
  // Lead counts
  unreadLeadsCount: number;
  totalLeadsCount: number;
  
  // Response counts
  unreadResponsesCount: number;
  totalResponsesCount: number;
  
  // Lead read states
  readLeads: Set<string>;
  
  // Refresh triggers
  refreshLeads: () => void;
  refreshResponses: () => void;
  refreshAll: () => void;
  
  // Real-time updates
  addNewLead: (lead: any) => void;
  addNewResponse: (response: any) => void;
  markLeadAsRead: (leadId: string) => void;
  markResponseAsRead: (responseId: string) => void;
  isLeadRead: (leadId: string) => boolean;
  
  // Loading states
  isLoading: boolean;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};

interface CommunicationProviderProps {
  children: ReactNode;
}

export const CommunicationProvider: React.FC<CommunicationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [unreadResponsesCount, setUnreadResponsesCount] = useState(0);
  const [totalResponsesCount, setTotalResponsesCount] = useState(0);
  const [readLeads, setReadLeads] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch lead counts
  const fetchLeadCounts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Get assigned leads for inbox count
      const assignedRes = await api.get(`/leads?assignedToId=${user.id}`);
      const assignedLeads = assignedRes.data?.data || [];
      
      const unreadCount = assignedLeads.filter((lead: any) => !lead.isRead || lead.unreadResponses > 0).length;
      
      setUnreadLeadsCount(unreadCount);
      setTotalLeadsCount(assignedLeads.length);
    } catch (error) {
      console.error('Error fetching lead counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch response counts
  const fetchResponseCounts = async () => {
    if (!user) return;
    
    try {
      const res = await api.get(`/leads/unread-counts-only?userId=${user.id}`);
      const data = res.data;
      
      if (data.responseCounts) {
        const unreadCount = Object.values(data.responseCounts).reduce((total: number, count: any) => {
          return total + (count.unread || 0);
        }, 0);
        
        const totalCount = Object.values(data.responseCounts).reduce((total: number, count: any) => {
          return total + (count.total || 0);
        }, 0);
        
        setUnreadResponsesCount(unreadCount);
        setTotalResponsesCount(totalCount);
      }
    } catch (error) {
      console.error('Error fetching response counts:', error);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchLeadCounts();
      fetchResponseCounts();
    }
  }, [user]);

  // Refresh functions
  const refreshLeads = () => {
    fetchLeadCounts();
  };

  const refreshResponses = () => {
    fetchResponseCounts();
  };

  const refreshAll = () => {
    fetchLeadCounts();
    fetchResponseCounts();
  };

  // Real-time update functions
  const addNewLead = (lead: any) => {
    setTotalLeadsCount(prev => prev + 1);
    if (!lead.isRead) {
      setUnreadLeadsCount(prev => prev + 1);
    }
  };

  const addNewResponse = (response: any) => {
    setTotalResponsesCount(prev => prev + 1);
    // Check if this response should be marked as unread for current user
    if (response.userId !== user?.id) {
      setUnreadResponsesCount(prev => prev + 1);
    }
  };

  const markLeadAsRead = (leadId: string) => {
    setReadLeads(prev => new Set(Array.from(prev).concat(leadId)));
    setUnreadLeadsCount(prev => Math.max(0, prev - 1));
  };

  const markResponseAsRead = (responseId: string) => {
    setUnreadResponsesCount(prev => Math.max(0, prev - 1));
  };

  const isLeadRead = (leadId: string) => {
    return readLeads.has(leadId);
  };

  const value: CommunicationContextType = {
    unreadLeadsCount,
    totalLeadsCount,
    unreadResponsesCount,
    totalResponsesCount,
    readLeads,
    refreshLeads,
    refreshResponses,
    refreshAll,
    addNewLead,
    addNewResponse,
    markLeadAsRead,
    markResponseAsRead,
    isLeadRead,
    isLoading,
  };

  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
};
