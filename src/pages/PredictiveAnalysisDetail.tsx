import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2 } from 'lucide-react';
import PredictiveAnalysisDetailFormModal, { PredictiveAnalysisDetailFormState } from '../components/modals/intelligencecycle/PredictiveAnalysisDetailFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface PredictiveAnalysis {
  _id?: string;
  id?: string;
  name: string;
  forwarded_to: string;
  assess_accuracy: string;
  timely_response: string;
  is_incident_averted: boolean;
  is_generated: boolean;
  remarks?: string;
  [key: string]: any;
}

const buildInitialForm = (): PredictiveAnalysisDetailFormState => ({
  name: '',
  forwarded_to: '',
  assess_accuracy: '',
  timely_response: '',
  is_incident_averted: false,
  is_generated: false,
  remarks: '',
});

const PredictiveAnalysisDetail: React.FC = () => {
  const [records, setRecords] = useState<PredictiveAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PredictiveAnalysis | null>(null);
  const [viewingRecord, setViewingRecord] = useState<PredictiveAnalysis | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<PredictiveAnalysisDetailFormState>(buildInitialForm());
  const [loadingView, setLoadingView] = useState<boolean>(false);
  const navigate = useNavigate();
  
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
      const response = await publicApi.get('/intl-cycle-predictive-analysis-details/get-all-intl-cycle-predictive-analysis-details');
      const raw = (response?.data?.data ?? response?.data ?? []) as any;
      const data: any[] = Array.isArray(raw) ? raw : (raw?.items ?? []);

      const mapped: PredictiveAnalysis[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item.id || item._id,
        name: item.name || '',
        forwarded_to: item.forwarded_to || '',
        assess_accuracy: item.assess_accuracy || '',
        timely_response: item.timely_response || '',
        is_incident_averted: Boolean(item.is_incident_averted),
        is_generated: Boolean(item.is_generated),
        remarks: item.remarks || '',
      }));

      setRecords(mapped);
    } catch (err: any) {
      console.error('Error fetching predictive analysis records:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load predictive analysis records. Please try again.'
      );
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

  const handleView = async (record: PredictiveAnalysis) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is required to view details');
      return;
    }
    navigate(`/intelligence-cycle/predictive-analysis/details?id=${recordId}`);
  };

  const handleEdit = (record: PredictiveAnalysis) => {
    setFormData({
      name: record.name || '',
      forwarded_to: record.forwarded_to || '',
      assess_accuracy: record.assess_accuracy || '',
      timely_response: record.timely_response || '',
      is_incident_averted: record.is_incident_averted || false,
      is_generated: record.is_generated || false,
      remarks: record.remarks || '',
    });
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: PredictiveAnalysis) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(record.name || `Record ID: ${recordId}`);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      // TODO: Replace with actual API endpoint when available
      // await publicApi.delete(`/intelligence-cycle/predictive-analysis/delete-predictive-analysis/${id}`);
      await api.delete(`/intl-cycle-predictive-analysis-details/delete-intl-cycle-predictive-analysis-detail/${id}`);
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting record:', error);
      window.alert(error?.response?.data?.message || error?.message || 'Failed to delete record. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          window.alert('Record ID is required for update');
          return;
        }
        // TODO: Replace with actual API endpoint when available
        // await publicApi.put(`/intelligence-cycle/predictive-analysis/update-predictive-analysis/${recordId}`, formData);
        await api.put(`/intl-cycle-predictive-analysis-details/update-intl-cycle-predictive-analysis-detail/${recordId}`, formData);
      } else {
        // TODO: Replace with actual API endpoint when available
        // await publicApi.post('/intelligence-cycle/predictive-analysis/add-predictive-analysis', formData);
        await api.post('/intl-cycle-predictive-analysis-details/add-intl-cycle-predictive-analysis-detail', formData);
      }
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
      await fetchRecords();
    } catch (error: any) {
      console.error('Error saving predictive analysis:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save predictive analysis record. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
  };

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => Object.values(record).some((value) => String(value || '').toLowerCase().includes(searchLower)));
    }
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn] || '';
        const bValue = b[sortColumn] || '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [records, searchTerm, sortColumn, sortDirection]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading predictive analysis records...</p>
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
                <CardTitle className="text-3xl font-bold text-foreground">Predictive Analysis Detail</CardTitle>
                <p className="text-muted-foreground mt-1">Manage predictive analysis records</p>
              </div>
              <Button className="flex items-center gap-2" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Predictive Analysis
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('forwarded_to')}
                  >
                    <div className="flex items-center">
                      Forwarded To
                      {getSortIcon('forwarded_to')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('assess_accuracy')}
                  >
                    <div className="flex items-center">
                      Assess Accuracy
                      {getSortIcon('assess_accuracy')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('timely_response')}
                  >
                    <div className="flex items-center">
                      Timely Response
                      {getSortIcon('timely_response')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('is_incident_averted')}
                  >
                    <div className="flex items-center">
                      Incident Averted
                      {getSortIcon('is_incident_averted')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('is_generated')}
                  >
                    <div className="flex items-center">
                      Generated
                      {getSortIcon('is_generated')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('remarks')}
                  >
                    <div className="flex items-center">
                      Remarks
                      {getSortIcon('remarks')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No records found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell>{record.name || 'N/A'}</TableCell>
                      <TableCell>{record.forwarded_to || 'N/A'}</TableCell>
                      <TableCell>{record.assess_accuracy || 'N/A'}</TableCell>
                      <TableCell>{record.timely_response || 'N/A'}</TableCell>
                      <TableCell>
                        {record.is_incident_averted ? (
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
                        {record.is_generated ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={record.remarks || ''}>
                        {record.remarks || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="View"
                            onClick={() => handleView(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="Edit"
                            onClick={() => handleEdit(record)}
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
          
          {filteredAndSortedRecords.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} entries</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /> Previous</Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="min-w-[40px]">{page}</Button>;
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next <ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <PredictiveAnalysisDetailFormModal
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
        title={isViewMode ? 'View Predictive Analysis Detail' : editingRecord ? 'Edit Predictive Analysis Detail' : 'Add Predictive Analysis Detail'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Predictive Analysis Detail'}
        submitting={submitting || loadingView}
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
        deleting={deleting} 
        title="Delete Predictive Analysis" 
      />
    </div>
  );
};

export default PredictiveAnalysisDetail;

