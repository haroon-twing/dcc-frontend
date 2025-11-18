import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useCommunication } from "../contexts/CommunicationContext";
import LeadViewModal from "../components/UI/LeadViewModal";
import { Button } from "../components/UI/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../components/UI/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/UI/card";
import * as XLSX from "xlsx";
import LeadFormModal from "../components/modals/leads/LeadFormModal";
import DeleteModal from "../components/UI/DeleteModal";

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
  isRead: boolean;
  unreadResponses: number;
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

const Leads: React.FC = () => {
  const { addNewLead, refreshLeads } = useCommunication();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDeleteId, setLeadToDeleteId] = useState<string | null>(null);
  const [leadToDeleteTitle, setLeadToDeleteTitle] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    docs: "",
    response: "",
    suggestedResponse: "",
    priority: "medium",
    documents: [] as File[],
    contactInfo: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
    cascadeSelection: {
      departmentId: "",
      sectionId: "",
      assignedUserIds: [] as string[],
    },
  });
  const [permissionFilter, setPermissionFilter] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data?.data || []);
    } catch (error: any) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openView = (lead: Lead) => {
    setSelected(lead);
    setOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      description: "",
      docs: "",
      response: "",
      suggestedResponse: "",
      priority: "medium",
      documents: [],
      contactInfo: {
        name: "",
        email: "",
        phone: "",
        company: "",
      },
      cascadeSelection: {
        departmentId: "",
        sectionId: "",
        assignedUserIds: [],
      },
    });
    setShowCreateModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setFormData({
      title: lead.title,
      description: lead.description,
      docs: lead.docs || "",
      response: lead.response || "",
      suggestedResponse: lead.suggestedResponse || "",
      priority: lead.priority || "medium",
      documents: [], // Reset documents for edit mode
      contactInfo: {
        name: lead.contactInfo?.name || "",
        email: lead.contactInfo?.email || "",
        phone: lead.contactInfo?.phone || "",
        company: lead.contactInfo?.company || "",
      },
      cascadeSelection: {
        departmentId: lead.departmentId?._id || "",
        sectionId: lead.sectionId?._id || "",
        assignedUserIds: lead.assignedUsers?.map((au) => au.userId._id) || [],
      },
    });
    setSelected(lead);
    setShowEditModal(true);
  };

  const handleDelete = (lead: Lead) => {
    setLeadToDeleteId(lead._id);
    setLeadToDeleteTitle(lead.title);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      alert("Please enter a lead title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a lead description");
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("docs", formData.docs);
      formDataToSend.append("response", formData.response);
      formDataToSend.append("suggestedResponse", formData.suggestedResponse);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append(
        "departmentId",
        formData.cascadeSelection.departmentId || ""
      );
      formDataToSend.append(
        "sectionId",
        formData.cascadeSelection.sectionId || ""
      );
      formDataToSend.append(
        "assignedUserIds",
        JSON.stringify(formData.cascadeSelection.assignedUserIds)
      );

      // Add document files if selected
      console.log(
        "Frontend: Adding documents to FormData:",
        formData.documents
      );
      console.log(
        "Frontend: Documents array length:",
        formData.documents.length
      );
      formData.documents.forEach((document, index) => {
        console.log(
          `Frontend: Adding document ${index}:`,
          document.name,
          document.size
        );
        formDataToSend.append(`documents`, document);
      });

      if (showCreateModal) {
        const response = await api.post("/leads", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setShowCreateModal(false);

        // Add new lead to context for real-time updates
        if (response.data?.data) {
          addNewLead(response.data.data);
        }

        // Reset form
        setFormData({
          title: "",
          description: "",
          docs: "",
          response: "",
          suggestedResponse: "",
          priority: "medium",
          documents: [],
          contactInfo: {
            name: "",
            email: "",
            phone: "",
            company: "",
          },
          cascadeSelection: {
            departmentId: "",
            sectionId: "",
            assignedUserIds: [],
          },
        });
      } else {
        // For edit mode, handle file uploads if new documents are selected
        if (formData.documents.length > 0) {
          // Create FormData for file upload
          const editFormData = new FormData();
          editFormData.append("title", formData.title);
          editFormData.append("description", formData.description);
          editFormData.append("docs", formData.docs);
          editFormData.append("response", formData.response);
          editFormData.append("suggestedResponse", formData.suggestedResponse);
          editFormData.append("priority", formData.priority);
          editFormData.append(
            "departmentId",
            formData.cascadeSelection.departmentId || ""
          );
          editFormData.append(
            "sectionId",
            formData.cascadeSelection.sectionId || ""
          );
          editFormData.append(
            "assignedUserIds",
            JSON.stringify(formData.cascadeSelection.assignedUserIds)
          );
          editFormData.append("status", selected?.status || "new");
          editFormData.append(
            "responseInitiated",
            selected?.responseInitiated?.toString() || "false"
          );

          // Add new document files
          formData.documents.forEach((document) => {
            editFormData.append("documents", document);
          });

          await api.put(`/leads/${selected?._id}`, editFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          // No new files, send regular JSON payload
          const editPayload = {
            title: formData.title,
            description: formData.description,
            docs: formData.docs,
            response: formData.response,
            suggestedResponse: formData.suggestedResponse,
            priority: formData.priority,
            departmentId: formData.cascadeSelection.departmentId || null,
            sectionId: formData.cascadeSelection.sectionId || null,
            assignedUserIds: formData.cascadeSelection.assignedUserIds,
            status: selected?.status,
            responseInitiated: selected?.responseInitiated,
            contactInfo: {
              name: "Hidden Contact",
              email: "hidden@contact.com",
              phone: "",
              company: "",
            },
          };
          await api.put(`/leads/${selected?._id}`, editPayload);
        }
        setShowEditModal(false);
      }
      fetchLeads();
      refreshLeads(); // Refresh context counts
    } catch (error: any) {
      console.error("Error saving lead:", error);
      console.error("Error response:", error.response?.data);
      // You can replace this with a toast notification or better error handling
      alert("Error saving lead. Please try again.");
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/leads/${id}`);
      setShowDeleteModal(false);
      setLeadToDeleteId(null);
      setLeadToDeleteTitle(null);
      fetchLeads();
      refreshLeads();
    } catch (error: any) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "contacted":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "qualified":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "proposal":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      case "negotiation":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "closed-won":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "closed-lost":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "low":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const exportToExcel = () => {
    // Prepare data for Excel export
    const excelData = leads.map((lead) => ({
      "Lead ID": lead._id,
      "Title": lead.title,
      "Description": lead.description,
      "Status": lead.status.replace("-", " ").toUpperCase(),
      "Priority": lead.priority.toUpperCase(),
      "Department": lead.departmentId?.name || "No Department",
      "Section": lead.sectionId?.name || "—",
      "Assigned Users": lead.assignedUsers?.map((assignment) => 
        assignment.userId.name || assignment.userId.email
      ).join(", ") || "No assignments",
      "Created By": lead.createdById?.name || "Unknown",
      "Contact Name": lead.contactInfo?.name || "—",
      "Contact Email": lead.contactInfo?.email || "—",
      "Contact Phone": lead.contactInfo?.phone || "—",
      "Company": lead.contactInfo?.company || "—",
      "Documentation": lead.docs || "—",
      "Response": lead.response || "—",
      "Suggested Response": lead.suggestedResponse || "—",
      "Response Initiated": lead.responseInitiated ? "Yes" : "No",
      "Estimated Value": lead.estimatedValue || "—",
      "Expected Close Date": lead.expectedCloseDate ? 
        new Date(lead.expectedCloseDate).toLocaleDateString() : "—",
      "Actual Close Date": lead.actualCloseDate ? 
        new Date(lead.actualCloseDate).toLocaleDateString() : "—",
      "Tags": lead.tags?.join(", ") || "—",
      "Is Active": lead.isActive ? "Yes" : "No",
      "Is Read": lead.isRead ? "Yes" : "No",
      "Unread Responses": lead.unreadResponses || 0,
      "Created At": new Date(lead.createdAt).toLocaleDateString(),
      "Updated At": new Date(lead.updatedAt).toLocaleDateString(),
    }));

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 25 }, // Lead ID
      { wch: 30 }, // Title
      { wch: 40 }, // Description
      { wch: 15 }, // Status
      { wch: 10 }, // Priority
      { wch: 20 }, // Department
      { wch: 20 }, // Section
      { wch: 30 }, // Assigned Users
      { wch: 20 }, // Created By
      { wch: 20 }, // Contact Name
      { wch: 25 }, // Contact Email
      { wch: 15 }, // Contact Phone
      { wch: 20 }, // Company
      { wch: 30 }, // Documentation
      { wch: 30 }, // Response
      { wch: 30 }, // Suggested Response
      { wch: 15 }, // Response Initiated
      { wch: 15 }, // Estimated Value
      { wch: 18 }, // Expected Close Date
      { wch: 18 }, // Actual Close Date
      { wch: 20 }, // Tags
      { wch: 10 }, // Is Active
      { wch: 10 }, // Is Read
      { wch: 15 }, // Unread Responses
      { wch: 12 }, // Created At
      { wch: 12 }, // Updated At
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `leads_export_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between p-7">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">
            Manage your leads and track their progress
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            📊 Export to Excel
          </Button>
          <Button onClick={handleCreate}>Add New Lead</Button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-border overflow-hidden">
        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-100">
            {leads?.map((lead, index) => (
              <div
                key={lead._id}
                className={`p-4 ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-blue-50/50 dark:from-blue-900/20 to-indigo-50/50 dark:to-indigo-900/20"
                    : "bg-gradient-to-r from-purple-50/50 dark:from-purple-900/20 to-pink-50/50 dark:to-pink-900/20"
                } hover:from-blue-100/50 dark:hover:from-blue-800/30 hover:to-indigo-100/50 dark:hover:to-indigo-800/30 transition-all duration-200`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {lead.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        📁 {lead.departmentId?.name || "No Dept"}
                      </span>
                      {lead.sectionId?.name && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          📂 {lead.sectionId.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <Button
                      onClick={() => openView(lead)}
                      variant="default"
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      👁️
                    </Button>
                    <Button
                      onClick={() => handleDelete(lead)}
                      variant="destructive"
                      size="sm"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Assigned to:
                  </span>
                  {lead.assignedUsers && lead.assignedUsers.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {lead.assignedUsers.slice(0, 2).map((assignment: any) => (
                        <span
                          key={assignment._id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        >
                          👤 {assignment.userId.name || assignment.userId.email}
                        </span>
                      ))}
                      {lead.assignedUsers.length > 2 && (
                        <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          +{lead.assignedUsers.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      No assignments
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Lead Overview</CardTitle>
            <CardDescription>
              Detailed table view of all captured leads and their current progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">
                    <div className="flex items-center space-x-2">
                      <span>📋</span>
                      <span>Title</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>📁</span>
                      <span>Department</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <div className="flex items-center space-x-2">
                      <span>📂</span>
                      <span>Section</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>👥</span>
                      <span>Assigned To</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>📊</span>
                      <span>Status</span>
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[140px]">
                    <div className="flex items-center space-x-2">
                      <span>⚡</span>
                      <span>Actions</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads?.map((lead) => (
                  <TableRow key={lead._id} className="align-top">
                    <TableCell>
                      <div className="text-sm font-semibold text-foreground flex items-center space-x-2">
                        <span>{lead.title}</span>
                        {!lead.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        {lead.unreadResponses > 0 && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {lead.unreadResponses} new
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate max-w-[280px]">
                        {lead.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {lead.departmentId?.name || "No Department"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {lead.sectionId?.name ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          {lead.sectionId.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.assignedUsers && lead.assignedUsers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {lead.assignedUsers.slice(0, 2).map((assignment: any) => (
                            <span
                              key={assignment._id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
                            >
                              👤 {assignment.userId.name || assignment.userId.email}
                            </span>
                          ))}
                          {lead.assignedUsers.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted/30 text-muted-foreground border border-border">
                              +{lead.assignedUsers.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted/30 text-muted-foreground border border-border">
                          No assignments
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status.replace("-", " ").toUpperCase()}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            lead.priority
                          )}`}
                        >
                          {lead.priority.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button onClick={() => openView(lead)} variant="secondary" size="sm">
                          View
                        </Button>
                        <Button onClick={() => handleDelete(lead)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <LeadFormModal
        open={showCreateModal || showEditModal}
        mode={showCreateModal ? 'create' : 'edit'}
        formData={formData}
        setFormData={setFormData}
        selectedLead={selected}
        setSelectedLead={setSelected}
        onSubmit={handleSubmit}
        onClose={() => {
          if (showCreateModal) setShowCreateModal(false);
          if (showEditModal) setShowEditModal(false);
        }}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={leadToDeleteId}
        message={`Are you sure you want to delete lead "${leadToDeleteTitle}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Lead"
      />
    </div>
  );
};

export default Leads;
