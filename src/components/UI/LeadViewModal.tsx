import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";

import { Button } from "./Button";
import Input from "./Input";
import Select from "./Select";
import LeadCommunication from "../LeadCommunication";
import api from "../../lib/api";
import { safeApiCall } from "../../lib/apiUtils";
import { useCommunication } from "../../contexts/CommunicationContext";

interface Lead {
  _id: string;
  title: string;
  description: string;
  docs?: string;
  response?: string;
  suggestedResponse?: string;
  responseInitiated?: boolean;
  status: string;
  priority: string;
  source?: string;
  isRead?: boolean;
  documentFiles?: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  }>;
  documentFile?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
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
      email: string;
    };
    assignedBy: {
      _id: string;
      name: string;
    };
    assignedAt: string;
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
  sectionId?: {
    _id: string;
    name: string;
  };
  programId?: {
    _id: string;
    name: string;
  };
  estimatedValue?: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  notes?: string;
  tags: string[];
  isActive: boolean;
  readBy: Array<{
    userId: {
      _id: string;
      name: string;
    };
    readAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface LeadViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  onUpdate?: () => void;
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({
  isOpen,
  onClose,
  leadId,
  onUpdate,
}) => {
  const { markLeadAsRead: markLeadAsReadContext } = useCommunication();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "communication">(
    "details"
  );

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    docs: "",
    response: "",
    suggestedResponse: "",
    responseInitiated: false,
    status: "new",
    priority: "medium",
    source: "",
    contactInfo: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
    assignedToId: "",
    assignedUserIds: [] as string[],
    departmentId: "",
    sectionId: "",
    programId: "",
    estimatedValue: "",
    expectedCloseDate: "",
    notes: "",
    tags: [] as string[],
  });

  const fetchLead = async () => {
    if (!leadId) return;

    setLoading(true);
    try {
      const response = await api.get(`/leads/${leadId}`);
      const leadData = response.data.data;
      setLead(leadData);

      // Populate form data
      setFormData({
        title: leadData.title || "",
        description: leadData.description || "",
        docs: leadData.docs || "",
        response: leadData.response || "",
        suggestedResponse: leadData.suggestedResponse || "",
        responseInitiated: leadData.responseInitiated || false,
        status: leadData.status || "new",
        priority: leadData.priority || "medium",
        source: leadData.source || "",
        contactInfo: {
          name: leadData.contactInfo?.name || "",
          email: leadData.contactInfo?.email || "",
          phone: leadData.contactInfo?.phone || "",
          company: leadData.contactInfo?.company || "",
        },
        assignedToId: leadData.assignedToId?._id || "",
        assignedUserIds:
          leadData.assignedUsers?.map((au: any) => au.userId._id) || [],
        departmentId: leadData.departmentId?._id || "",
        sectionId: leadData.sectionId?._id || "",
        programId: leadData.programId?._id || "",
        estimatedValue: leadData.estimatedValue?.toString() || "",
        expectedCloseDate: leadData.expectedCloseDate
          ? new Date(leadData.expectedCloseDate).toISOString().split("T")[0]
          : "",
        notes: leadData.notes || "",
        tags: leadData.tags || [],
      });
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setAvailableUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLead();
      fetchUsers();
    }
  }, [isOpen, leadId]);

  const handleSave = async () => {
    if (!lead) return;

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        estimatedValue: formData.estimatedValue
          ? parseFloat(formData.estimatedValue)
          : null,
        expectedCloseDate: formData.expectedCloseDate || null,
        assignedUserIds: formData.assignedUserIds,
      };

      await api.put(`/leads/${leadId}`, updateData);
      await fetchLead();
      setEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = useCallback(() => {
    // Use context to mark lead as read instantly without API call
    if (leadId) {
      markLeadAsReadContext(leadId);
    }
    // Update local state
    if (lead) {
      setLead({ ...lead, isRead: true });
    }
  }, [leadId, lead, markLeadAsReadContext]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {lead?.title || "Lead Details"}
            </h2>
            <div className="flex items-center space-x-4 mt-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  lead?.status === "new"
                    ? "bg-blue-100 text-blue-800"
                    : lead?.status === "contacted"
                    ? "bg-yellow-100 text-yellow-800"
                    : lead?.status === "qualified"
                    ? "bg-green-100 text-green-800"
                    : lead?.status === "closed-won"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {lead?.status?.replace("-", " ").toUpperCase()}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  lead?.priority === "urgent"
                    ? "bg-red-100 text-red-800"
                    : lead?.priority === "high"
                    ? "bg-orange-100 text-orange-800"
                    : lead?.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {lead?.priority?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {editing && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    fetchLead(); // Reset form
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "details"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "communication"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("communication")}
          >
            Communication
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "details" ? (
            <div className="p-6 overflow-y-auto h-full">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      {editing ? (
                        <Input
                          value={formData.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      {editing ? (
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        {editing ? (
                          <Select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                            className="mt-1"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="closed-won">Closed Won</option>
                            <option value="closed-lost">Closed Lost</option>
                          </Select>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {lead?.status}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        {editing ? (
                          <Select
                            value={formData.priority}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                priority: e.target.value,
                              })
                            }
                            className="mt-1"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </Select>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {lead?.priority}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Source
                      </label>
                      {editing ? (
                        <Input
                          value={formData.source}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, source: e.target.value })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.source || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Lead Management Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lead Management
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Response Initiated
                      </label>
                      {editing ? (
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={formData.responseInitiated || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                responseInitiated: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Mark as response initiated
                          </label>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.responseInitiated ? "Yes" : "No"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Suggested Response
                      </label>
                      {editing ? (
                        <textarea
                          value={formData.suggestedResponse || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              suggestedResponse: e.target.value,
                            })
                          }
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Suggested response for this lead"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.suggestedResponse || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assignment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assignment
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Primary Assignee
                      </label>
                      {editing ? (
                        <Select
                          value={formData.assignedToId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assignedToId: e.target.value,
                            })
                          }
                          className="mt-1"
                        >
                          <option value="">Select user</option>
                          {availableUsers.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.assignedToId?.name || "Unassigned"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Assignees
                      </label>
                      {editing ? (
                        <div className="mt-1 space-y-2">
                          {availableUsers.map((user) => (
                            <label key={user._id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.assignedUserIds.includes(
                                  user._id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      assignedUserIds: [
                                        ...formData.assignedUserIds,
                                        user._id,
                                      ],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      assignedUserIds:
                                        formData.assignedUserIds.filter(
                                          (id) => id !== user._id
                                        ),
                                    });
                                  }
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-900">
                                {user.name} ({user.email})
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-1">
                          {lead?.assignedUsers && lead.assignedUsers.length > 0 ? (
                            <div className="space-y-1">
                              {lead.assignedUsers.map((assignment, index) => (
                                <p
                                  key={index}
                                  className="text-sm text-gray-900"
                                >
                                  {assignment.userId.name} (assigned by{" "}
                                  {assignment.assignedBy.name})
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No additional assignees
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Additional Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead?.departmentId?.name}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Section
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead?.sectionId?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Program
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead?.programId?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estimated Value
                      </label>
                      {editing ? (
                        <Input
                          type="number"
                          value={formData.estimatedValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              estimatedValue: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.estimatedValue
                            ? formatCurrency(lead.estimatedValue)
                            : "N/A"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Documents
                      </label>
                      {(() => {
                        // Combine documentFiles and documentFile into a single array for display
                        const allDocuments = [];
                        
                        // Add multiple documents from documentFiles array
                        if (lead?.documentFiles && lead.documentFiles.length > 0) {
                          allDocuments.push(...lead.documentFiles);
                        }
                        
                        // Add single document from documentFile (for backward compatibility)
                        if (lead?.documentFile && !allDocuments.some(doc => doc.filename === lead.documentFile?.filename)) {
                          allDocuments.push(lead.documentFile);
                        }
                        
                        if (allDocuments.length > 0) {
                          return (
                            <div className="mt-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {allDocuments.length} document{allDocuments.length > 1 ? 's' : ''} attached
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {allDocuments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                                      <div className="flex items-center flex-1">
                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-900 truncate flex-1">
                                          {file.originalName}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                        <a
                                          href={`/api/leads/documents/${file.filename}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                          View
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return <p className="mt-1 text-sm text-gray-500">No documents attached</p>;
                        }
                      })()}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expected Close Date
                      </label>
                      {editing ? (
                        <Input
                          type="date"
                          value={formData.expectedCloseDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              expectedCloseDate: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.expectedCloseDate
                            ? formatDate(lead.expectedCloseDate)
                            : "N/A"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Submission Date
                      </label>
                      {editing ? (
                        <Input
                          type="date"
                          value={formData.expectedCloseDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              expectedCloseDate: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {lead?.expectedCloseDate
                            ? formatDate(lead.expectedCloseDate)
                            : "N/A"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Created
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead?.createdAt ? formatDate(lead.createdAt) : "N/A"}{" "}
                        by {lead?.createdById?.name}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Updated
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead?.updatedAt ? formatDate(lead.updatedAt) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full">
              <LeadCommunication
                leadId={leadId}
                leadTitle={lead?.title}
                leadCreatedBy={lead?.createdById}
                isRead={lead?.readBy?.some(
                  (r) => r.userId._id === lead?.createdById?._id
                )}
                onMarkAsRead={handleMarkAsRead}
                assignedUsers={lead?.assignedUsers}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LeadViewModal;
