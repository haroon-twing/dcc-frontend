import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCommunication } from "../contexts/CommunicationContext";
import api from "../lib/api";
import { Button } from "./UI/Button";
import Input from "./UI/Input";
import Select from "./UI/Select";

interface ResponseItem {
  _id: string;
  message: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    roleId?: {
      name: string;
    };
  };
  targetUserId?: {
    _id: string;
    name: string;
    email: string;
  };
  isInternal: boolean;
  isReadByCreator: boolean;
  isReadByTarget: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface LeadCommunicationProps {
  leadId: string;
  leadTitle?: string;
  leadCreatedBy?: {
    _id: string;
    name: string;
  };
  onClose?: () => void;
  isRead?: boolean;
  onMarkAsRead?: () => void;
  assignedUsers?: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
}

const LeadCommunication: React.FC<LeadCommunicationProps> = ({
  leadId,
  leadTitle,
  leadCreatedBy,
  onClose,
  isRead = true,
  onMarkAsRead,
  assignedUsers = [],
}) => {
  const { user } = useAuth();
  const { addNewResponse, markResponseAsRead: markResponseAsReadContext, isLeadRead } = useCommunication();
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastResponseCount, setLastResponseCount] = useState(0);
  const [readResponses, setReadResponses] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsRead = useRef(false);
  const prevAssignedUsers = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchResponses = async () => {
    try {
      const res = await api.get(`/leads/${leadId}/responses`);
      const newResponses = res.data?.data || [];
      setResponses(newResponses);

      // Check if there are new responses and scroll to bottom
      if (newResponses.length > lastResponseCount) {
        setLastResponseCount(newResponses.length);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error: any) {
      console.error("Error fetching responses:", error);
      // Don't spam the console with network errors
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_INSUFFICIENT_RESOURCES') {
        console.error("Error fetching responses:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      if (assignedUsers.length > 0) {
        // Show only assigned users
        const leadAssignedUserIds = assignedUsers.map(au => au.userId._id);
        const res = await api.get("/users");
        const allUsers = res.data?.data || [];
        const filteredUsers = allUsers.filter((u: User) => 
          leadAssignedUserIds.includes(u._id) && u._id !== user?.id
        );
        setAvailableUsers(filteredUsers);
      } else {
        // Show all users except current user
        const res = await api.get("/users");
        const allUsers = res.data?.data || [];
        setAvailableUsers(allUsers.filter((u: User) => u._id !== user?.id));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch responses when leadId changes
  useEffect(() => {
    fetchResponses();
  }, [leadId]);

  // Fetch available users when leadId or assignedUsers change
  useEffect(() => {
    const assignedUsersString = JSON.stringify(assignedUsers.map(au => au.userId._id));
    
    // Only fetch if assignedUsers actually changed
    if (assignedUsersString !== prevAssignedUsers.current) {
      prevAssignedUsers.current = assignedUsersString;
      fetchAvailableUsers();
    }
  }, [leadId, assignedUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  // Mark lead as read when component mounts
  useEffect(() => {
    if (!isRead && onMarkAsRead && !isLeadRead(leadId)) {
      onMarkAsRead();
    }
  }, [isRead, onMarkAsRead, leadId, isLeadRead]);

  // Mark all responses as read when component mounts (only once)
  useEffect(() => {
    if (responses.length > 0 && !hasMarkedAsRead.current) {
      markAllResponsesAsRead();
      hasMarkedAsRead.current = true;
    }
  }, [leadId]); // Only run when leadId changes (component mounts)

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setSending(true);
    try {
      const response = await api.post(`/leads/${leadId}/responses`, {
        message: message.trim(),
        targetUserId: targetUserId || null,
        isInternal: false,
      });

      // Add new response to context for real-time updates
      if (response.data?.data) {
        addNewResponse(response.data.data);
      }

      setMessage("");
      setTargetUserId("");
      await fetchResponses();
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isLeadCreator = user?.id === leadCreatedBy?._id;

  const markResponseAsRead = async (responseId: string) => {
    try {
      await api.put(`/leads/${leadId}/responses/${responseId}/read`);
      setReadResponses(prev => new Set(Array.from(prev).concat(responseId)));
      markResponseAsReadContext(responseId);
    } catch (error) {
      console.error("Error marking response as read:", error);
    }
  };

  const markAllResponsesAsRead = async () => {
    const unreadResponses = responses.filter(response => {
      const isCurrentUser = response.userId._id === user?.id;
      const isTargetedToCurrentUser = response.targetUserId?._id === user?.id;
      const shouldMarkAsRead = !isCurrentUser && (isTargetedToCurrentUser || !response.targetUserId);
      return shouldMarkAsRead && !readResponses.has(response._id);
    });

    // Only mark as read if there are actually unread responses
    if (unreadResponses.length > 0) {
      // Mark all unread responses as read in a single batch
      const responseIds = unreadResponses.map(r => r._id);
      try {
        await api.put(`/leads/${leadId}/responses/read-all`, {
          responseIds: responseIds
        });
        
        // Update local state
        setReadResponses(prev => new Set([...Array.from(prev), ...responseIds]));
        
        // Update context
        responseIds.forEach(id => markResponseAsReadContext(id));
      } catch (error) {
        console.error("Error marking all responses as read:", error);
        // Fallback to individual calls if batch fails
        for (const response of unreadResponses) {
          await markResponseAsRead(response._id);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {leadTitle || "Lead Communication"}
            </h3>
            {responses.some(response => {
              const isCurrentUser = response.userId._id === user?.id;
              const isTargetedToCurrentUser = response.targetUserId?._id === user?.id;
              return !isCurrentUser && 
                (isTargetedToCurrentUser || !response.targetUserId) && 
                !readResponses.has(response._id);
            }) && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {responses.filter(response => {
                  const isCurrentUser = response.userId._id === user?.id;
                  const isTargetedToCurrentUser = response.targetUserId?._id === user?.id;
                  return !isCurrentUser && 
                    (isTargetedToCurrentUser || !response.targetUserId) && 
                    !readResponses.has(response._id);
                }).length} unread
              </span>
            )}
          </div>
          {leadCreatedBy && (
            <p className="text-sm text-gray-600">
              Created by {leadCreatedBy.name}
            </p>
          )}
        </div>
        {onClose && (
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {responses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          responses.map((response) => {
            const isCurrentUser = response.userId._id === user?.id;
            const isTargetedToCurrentUser = response.targetUserId?._id === user?.id;
            const isUnread = !isCurrentUser && 
              (isTargetedToCurrentUser || !response.targetUserId) && 
              !readResponses.has(response._id);

            return (
              <div
                key={response._id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                    isCurrentUser
                      ? "bg-blue-600 text-white"
                      : isUnread
                      ? "bg-blue-50 border-l-4 border-l-blue-500 text-gray-900"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {/* Unread indicator */}
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">
                      {response.userId.name}
                      {response.userId.roleId && (
                        <span className="ml-1 opacity-75">
                          ({response.userId.roleId.name})
                        </span>
                      )}
                    </span>
                    <div className="flex items-center space-x-2">
                      {isUnread && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                      <span className="text-xs opacity-75">
                        {formatDate(response.createdAt)}
                      </span>
                    </div>
                  </div>

                  {response.targetUserId && (
                    <div className="text-xs opacity-75 mb-1">
                      → {response.targetUserId.name}
                    </div>
                  )}

                  <div className="text-sm whitespace-pre-wrap">
                    {response.message}
                  </div>

                  {response.isInternal && (
                    <div className="text-xs opacity-75 mt-1 italic">
                      Internal note
                    </div>
                  )}

                  {/* Read status indicators */}
                  <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                    <div className="flex items-center space-x-2">
                      {response.isReadByCreator && (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Read by creator
                        </span>
                      )}
                      {response.isReadByTarget && response.targetUserId && (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Read by target
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendResponse} className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
              />
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || sending}
              size="sm"
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Select user to mention (optional)"
              className="flex-1"
            >
              <option value="">General message</option>
              {availableUsers
                .filter((u) => u._id !== user?.id)
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </Select>
            {targetUserId && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setTargetUserId("")}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCommunication;
