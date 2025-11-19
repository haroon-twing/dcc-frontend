import React, { useEffect, useState, useMemo } from 'react';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2 } from 'lucide-react';
import PIFTACReportFormModal, { PIFTACReportFormState } from '../components/modals/piftac/PIFTACReportFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import { Badge } from '../components/UI/badge';

interface PIFTACReport {
  _id?: string;
  id?: string;
  report_name: string;
  report_type: string;
  forwarded_to: string;
  ref_no: string;
  is_feedback_recv: boolean;
  remarks?: string;
}

const buildInitialForm = (): PIFTACReportFormState => ({
  report_name: '',
  report_type: '',
  forwarded_to: '',
  ref_no: '',
  is_feedback_recv: false,
  remarks: '',
});

const PIFTACReports: React.FC = () => {
  const [records, setRecords] = useState<PIFTACReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PIFTACReport | null>(null);
  const [viewingRecord, setViewingRecord] = useState<PIFTACReport | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<PIFTACReportFormState>(buildInitialForm());
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
      const response = await publicApi.get('/ops-resp-piftac-reports/get-all-ops-resp-piftac-reports');
      const data = response.data?.data || response.data || [];
      
      // Map the API response to our interface
      const mappedData: PIFTACReport[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item.id || item._id,
        report_name: item.report_name || '',
        report_type: item.report_type || '',
        forwarded_to: item.forwarded_to || '',
        ref_no: item.ref_no || '',
        is_feedback_recv: Boolean(item.is_feedback_recv),
        remarks: item.remarks || '',
      }));
      
      setRecords(mappedData);
    } catch (err: any) {
      console.error('Error fetching PIFTAC reports:', err);
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

  const handleView = async (record: PIFTACReport) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is required to view details');
      return;
    }

    setLoadingView(true);
    setShowModal(true);
    setIsViewMode(true);
    setViewingRecord(record);
    setEditingRecord(null);

    try {
      const response = await publicApi.get(`/ops-resp-piftac-reports/get-single-ops-resp-piftac-report/${recordId}`);
      const data = response.data?.data || response.data;
      
      if (data) {
        setFormData({
          report_name: data.report_name || '',
          report_type: data.report_type || '',
          forwarded_to: data.forwarded_to || '',
          ref_no: data.ref_no || '',
          is_feedback_recv: Boolean(data.is_feedback_recv),
          remarks: data.remarks || '',
        });
        // Update viewing record with fetched data
        setViewingRecord({
          _id: data._id || data.id,
          id: data.id || data._id,
          report_name: data.report_name || '',
          report_type: data.report_type || '',
          forwarded_to: data.forwarded_to || '',
          ref_no: data.ref_no || '',
          is_feedback_recv: Boolean(data.is_feedback_recv),
          remarks: data.remarks || '',
        });
      } else {
        window.alert('No data received from server');
        setShowModal(false);
      }
    } catch (err: any) {
      console.error('Error fetching PIFTAC report details:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load report details. Please try again.'
      );
      setShowModal(false);
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = (record: PIFTACReport) => {
    setFormData({
      report_name: record.report_name || '',
      report_type: record.report_type || '',
      forwarded_to: record.forwarded_to || '',
      ref_no: record.ref_no || '',
      is_feedback_recv: record.is_feedback_recv || false,
      remarks: record.remarks || '',
    });
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: PIFTACReport) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(record.report_name || `Report ID: ${recordId}`);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/ops-resp-piftac-reports/delete-ops-resp-piftac-report/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting PIFTAC report:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete report. Please try again.'
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
        report_name: formData.report_name,
        report_type: formData.report_type,
        forwarded_to: formData.forwarded_to,
        ref_no: formData.ref_no,
        is_feedback_recv: formData.is_feedback_recv,
        remarks: formData.remarks || '',
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        const updateEndpoint = `/ops-resp-piftac-reports/update-ops-resp-piftac-report/${recordId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ops-resp-piftac-reports/add-ops-resp-piftac-report';
        await api.post(addEndpoint, payload);
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
      console.error('Error saving PIFTAC report:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} report. Please try again.`
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
          record.report_name?.toLowerCase().includes(searchLower) ||
          record.report_type?.toLowerCase().includes(searchLower) ||
          record.forwarded_to?.toLowerCase().includes(searchLower) ||
          record.ref_no?.toLowerCase().includes(searchLower) ||
          record.remarks?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof PIFTACReport] || '';
        const bValue = b[sortColumn as keyof PIFTACReport] || '';
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
          <p className="text-muted-foreground">Loading PIFTAC reports...</p>
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
                <CardTitle className="text-3xl font-bold text-foreground">PIFTAC Reports</CardTitle>
                <p className="text-muted-foreground mt-1">Manage PIFTAC reports</p>
              </div>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add PIFTAC Report
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reports..."
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
            <Table className="w-full">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[15%]" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('report_name')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Report Name {getSortIcon('report_name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('report_type')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Report Type {getSortIcon('report_type')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('forwarded_to')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Forwarded To {getSortIcon('forwarded_to')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('ref_no')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Reference No. {getSortIcon('ref_no')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('is_feedback_recv')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Feedback Received {getSortIcon('is_feedback_recv')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('remarks')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Remarks {getSortIcon('remarks')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No reports found matching your search.' : 'No PIFTAC reports found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell className="truncate" title={record.report_name}>
                        {record.report_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.report_type || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="truncate" title={record.forwarded_to}>
                        {record.forwarded_to || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={record.ref_no}>
                        {record.ref_no || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {record.is_feedback_recv ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="truncate" title={record.remarks}>
                        {record.remarks || '-'}
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
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
      <PIFTACReportFormModal
        open={showModal}
        onOpenChange={setShowModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View PIFTAC Report' : editingRecord ? 'Edit PIFTAC Report' : 'Add PIFTAC Report'}
        submitLabel={editingRecord ? 'Update' : 'Save'}
        submitting={submitting}
        viewMode={isViewMode}
        loading={loadingView}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
      />
    </div>
  );
};

export default PIFTACReports;
