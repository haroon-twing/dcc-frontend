import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2 } from 'lucide-react';
import IntelligenceCycleFormModal, { IntelligenceCycleFormState } from '../components/modals/intelligencecycle/IntelligenceCycleFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface IntelligenceCycle {
  _id?: string;
  id?: string;
  is_publication_province_intl_estimate: boolean;
  is_prep_action_plan: boolean;
  is_prep_m_e_framework: boolean;
  percent_completion_action_plan: number;
  is_connectivity_concerned_dept: boolean;
  is_prep_local_resp_mech: boolean;
  no_alerts_recvd: number;
  no_alerts_deduct_false: number;
  no_alerts_disposedof: number;
  is_prep_eval_report_local_affect: boolean;
}

const buildInitialForm = (): IntelligenceCycleFormState => ({
  is_publication_province_intl_estimate: false,
  is_prep_action_plan: false,
  is_prep_m_e_framework: false,
  percent_completion_action_plan: 0,
  is_connectivity_concerned_dept: false,
  is_prep_local_resp_mech: false,
  no_alerts_recvd: 0,
  no_alerts_deduct_false: 0,
  no_alerts_disposedof: 0,
  is_prep_eval_report_local_affect: false,
});

const IntelligenceCycleList: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<IntelligenceCycle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IntelligenceCycle | null>(null);
  const [viewingRecord, setViewingRecord] = useState<IntelligenceCycle | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<IntelligenceCycleFormState>(buildInitialForm());
  const [loadingView, setLoadingView] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when available
      // const response = await publicApi.get('/intelligence-cycle/get-all-intelligence-cycles');
      // const data = response.data?.data || response.data || [];
      
      // Fetch records from backend
      const response = await publicApi.get('/intl-cycle/get-all');
      const raw = (response?.data?.data ?? response?.data ?? []) as any;
      const data: any[] = Array.isArray(raw) ? raw : (raw?.items ?? []);
      
      // Map the API response to our interface
      const mappedData: IntelligenceCycle[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item.id || item._id,
        is_publication_province_intl_estimate: item.is_publication_province_intl_estimate || false,
        is_prep_action_plan: item.is_prep_action_plan || false,
        is_prep_m_e_framework: item.is_prep_m_e_framework || false,
        percent_completion_action_plan: item.percent_completion_action_plan || 0,
        is_connectivity_concerned_dept: item.is_connectivity_concerned_dept || false,
        is_prep_local_resp_mech: item.is_prep_local_resp_mech || false,
        no_alerts_recvd: item.no_alerts_recvd || 0,
        no_alerts_deduct_false: item.no_alerts_deduct_false || 0,
        no_alerts_disposedof: item.no_alerts_disposedof || 0,
        is_prep_eval_report_local_affect: item.is_prep_eval_report_local_affect || false,
      }));
      
      setRecords(mappedData);
    } catch (err: any) {
      console.error('Error fetching intelligence cycle records:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (record: IntelligenceCycle) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is required to view details');
      return;
    }

    try {
      setLoadingView(true);
      // Optional: pre-fetch to ensure record exists
      await publicApi.get(`/intl-cycle/get-single/${recordId}`);
      navigate(`/intelligence-cycle/list/details?id=${recordId}`);
    } catch (err: any) {
      console.error('Error fetching intelligence cycle details:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to load intelligence cycle details.');
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = (record: IntelligenceCycle) => {
    setFormData({
      is_publication_province_intl_estimate: record.is_publication_province_intl_estimate || false,
      is_prep_action_plan: record.is_prep_action_plan || false,
      is_prep_m_e_framework: record.is_prep_m_e_framework || false,
      percent_completion_action_plan: record.percent_completion_action_plan || 0,
      is_connectivity_concerned_dept: record.is_connectivity_concerned_dept || false,
      is_prep_local_resp_mech: record.is_prep_local_resp_mech || false,
      no_alerts_recvd: record.no_alerts_recvd || 0,
      no_alerts_deduct_false: record.no_alerts_deduct_false || 0,
      no_alerts_disposedof: record.no_alerts_disposedof || 0,
      is_prep_eval_report_local_affect: record.is_prep_eval_report_local_affect || false,
    });
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: IntelligenceCycle) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      // Prefer a human-friendly name if present; otherwise fall back to ID
      const displayName = (record as any).name || (record as any).title || (record as any).category || `ID: ${recordId}`;
      setRecordToDeleteName(String(displayName));
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      // TODO: Replace with actual API endpoint when available
      // const deleteEndpoint = `/intelligence-cycle/delete-intelligence-cycle/${id}`;
      // await api.delete(deleteEndpoint);
      await api.delete(`/intl-cycle/delete/${id}`);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting intelligence cycle:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete intelligence cycle. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        is_publication_province_intl_estimate: formData.is_publication_province_intl_estimate,
        is_prep_action_plan: formData.is_prep_action_plan,
        is_prep_m_e_framework: formData.is_prep_m_e_framework,
        percent_completion_action_plan: formData.percent_completion_action_plan,
        is_connectivity_concerned_dept: formData.is_connectivity_concerned_dept,
        is_prep_local_resp_mech: formData.is_prep_local_resp_mech,
        no_alerts_recvd: formData.no_alerts_recvd,
        no_alerts_deduct_false: formData.no_alerts_deduct_false,
        no_alerts_disposedof: formData.no_alerts_disposedof,
        is_prep_eval_report_local_affect: formData.is_prep_eval_report_local_affect,
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        // TODO: Replace with actual API endpoint when available
        // const updateEndpoint = `/intelligence-cycle/update-intelligence-cycle/${recordId}`;
        // await api.put(updateEndpoint, payload);
        await api.put(`/intl-cycle/update/${recordId}`, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // const addEndpoint = '/intelligence-cycle/add-intelligence-cycle';
        // await api.post(addEndpoint, payload);
        await api.post('/intl-cycle/add', payload);
      }

      // Refetch data after add/edit
      await fetchRecords();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving intelligence cycle:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} intelligence cycle. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          String(record.percent_completion_action_plan || 0).includes(searchLower) ||
          String(record.no_alerts_recvd || 0).includes(searchLower) ||
          String(record.no_alerts_deduct_false || 0).includes(searchLower) ||
          String(record.no_alerts_disposedof || 0).includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof IntelligenceCycle] || '';
        const bValue = b[sortColumn as keyof IntelligenceCycle] || '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [records, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedRecords.slice(startIndex, endIndex);
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage);

  // Handle sort click
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Get sort icon for column
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
  };

  // Reset search and filters
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading intelligence cycle records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Intelligence Cycle List</CardTitle>
                <p className="text-muted-foreground mt-1">Manage intelligence cycle records</p>
              </div>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Intelligence Cycle
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search intelligence cycle records..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Publication Province Intl Estimate</TableHead>
                  <TableHead>Prep Action Plan</TableHead>
                  <TableHead>Prep M&E Framework</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('percent_completion_action_plan')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      % Completion Action Plan {getSortIcon('percent_completion_action_plan')}
                    </button>
                  </TableHead>
                  <TableHead>Connectivity Concerned Dept</TableHead>
                  <TableHead>Prep Local Resp Mech</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('no_alerts_recvd')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Alerts Received {getSortIcon('no_alerts_recvd')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('no_alerts_deduct_false')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Alerts Deduct False {getSortIcon('no_alerts_deduct_false')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('no_alerts_disposedof')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Alerts Disposed Of {getSortIcon('no_alerts_disposedof')}
                    </button>
                  </TableHead>
                  <TableHead>Prep Eval Report Local Affect</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No intelligence cycle records found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell>
                        {record.is_publication_province_intl_estimate ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.is_prep_action_plan ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.is_prep_m_e_framework ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{record.percent_completion_action_plan || 0}%</TableCell>
                      <TableCell>
                        {record.is_connectivity_concerned_dept ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.is_prep_local_resp_mech ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{record.no_alerts_recvd || 0}</TableCell>
                      <TableCell>{record.no_alerts_deduct_false || 0}</TableCell>
                      <TableCell>{record.no_alerts_disposedof || 0}</TableCell>
                      <TableCell>
                        {record.is_prep_eval_report_local_affect ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(record)}
                            className="h-8 w-8 p-0"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {filteredAndSortedRecords.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <IntelligenceCycleFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting && !loadingView) {
            setShowModal(false);
            setFormData(buildInitialForm());
            setEditingRecord(null);
            setViewingRecord(null);
            setIsViewMode(false);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Intelligence Cycle' : editingRecord ? 'Edit Intelligence Cycle' : 'Add Intelligence Cycle'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Intelligence Cycle'}
        submitting={submitting || loadingView}
        viewMode={isViewMode}
        loading={loadingView}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete this record? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Intelligence Cycle"
      />
    </div>
  );
};

export default IntelligenceCycleList;

