import React, { useEffect, useState, useMemo } from 'react';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2 } from 'lucide-react';
import ConnectivityStatusFormModal, { ConnectivityStatusFormState } from '../components/modals/intelligencecycle/ConnectivityStatusFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface ConnectivityStatus {
  _id?: string;
  id?: string;
  office: string;
  is_nip_access: boolean;
  is_eoffice_access: boolean;
  is_oas_access: boolean;
  is_internet_access: boolean;
  remarks?: string;
  [key: string]: any;
}

const buildInitialForm = (): ConnectivityStatusFormState => ({
  office: '',
  is_nip_access: false,
  is_eoffice_access: false,
  is_oas_access: false,
  is_internet_access: false,
  remarks: '',
});

const ConnectivityStatus: React.FC = () => {
  const [records, setRecords] = useState<ConnectivityStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ConnectivityStatus | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ConnectivityStatus | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<ConnectivityStatusFormState>(buildInitialForm());
  const [loadingView, setLoadingView] = useState<boolean>(false);
  
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
      const data: ConnectivityStatus[] = [];
      setRecords(data);
    } catch (err: any) {
      console.error('Error fetching connectivity status records:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load connectivity status records. Please try again.'
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

  const handleView = async (record: ConnectivityStatus) => {
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
      // TODO: Replace with actual API endpoint when available
      // const response = await publicApi.get(`/intelligence-cycle/connectivity-status/get-single-connectivity-status/${recordId}`);
      // const data = response.data?.data || response.data;
      
      // For now, use the record data directly
      const data = record;
      
      if (data) {
        setFormData({
          office: data.office || '',
          is_nip_access: data.is_nip_access || false,
          is_eoffice_access: data.is_eoffice_access || false,
          is_oas_access: data.is_oas_access || false,
          is_internet_access: data.is_internet_access || false,
          remarks: data.remarks || '',
        });
        setViewingRecord({
          _id: data._id || data.id,
          id: data.id || data._id,
          office: data.office || '',
          is_nip_access: data.is_nip_access || false,
          is_eoffice_access: data.is_eoffice_access || false,
          is_oas_access: data.is_oas_access || false,
          is_internet_access: data.is_internet_access || false,
          remarks: data.remarks || '',
        });
      } else {
        window.alert('No data received from server');
        setShowModal(false);
      }
    } catch (err: any) {
      console.error('Error fetching connectivity status details:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load connectivity status details. Please try again.'
      );
      setShowModal(false);
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = (record: ConnectivityStatus) => {
    setFormData({
      office: record.office || '',
      is_nip_access: record.is_nip_access || false,
      is_eoffice_access: record.is_eoffice_access || false,
      is_oas_access: record.is_oas_access || false,
      is_internet_access: record.is_internet_access || false,
      remarks: record.remarks || '',
    });
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: ConnectivityStatus) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(record.office || `Record ID: ${recordId}`);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      // TODO: Replace with actual API endpoint when available
      // await publicApi.delete(`/intelligence-cycle/connectivity-status/delete-connectivity-status/${id}`);
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
        // await publicApi.put(`/intelligence-cycle/connectivity-status/update-connectivity-status/${recordId}`, formData);
        window.alert('Update functionality will be available once API is integrated');
      } else {
        // TODO: Replace with actual API endpoint when available
        // await publicApi.post('/intelligence-cycle/connectivity-status/add-connectivity-status', formData);
        window.alert('Add functionality will be available once API is integrated');
      }
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
      await fetchRecords();
    } catch (error: any) {
      console.error('Error saving connectivity status:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save connectivity status record. Please try again.'
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
          <p className="text-muted-foreground">Loading connectivity status records...</p>
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
                <CardTitle className="text-2xl font-bold">Connectivity Status at PIFTAC and DCCs</CardTitle>
                <p className="text-muted-foreground mt-1">Manage connectivity status records</p>
              </div>
              <Button className="flex items-center gap-2" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Connectivity Status
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
                    onClick={() => handleSort('office')}
                  >
                    <div className="flex items-center">
                      Office
                      {getSortIcon('office')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('is_nip_access')}
                  >
                    <div className="flex items-center">
                      NIP Access
                      {getSortIcon('is_nip_access')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('is_eoffice_access')}
                  >
                    <div className="flex items-center">
                      E-Office Access
                      {getSortIcon('is_eoffice_access')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('is_oas_access')}
                  >
                    <div className="flex items-center">
                      OAS Access
                      {getSortIcon('is_oas_access')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('is_internet_access')}
                  >
                    <div className="flex items-center">
                      Internet Access
                      {getSortIcon('is_internet_access')}
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
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No records found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell>{record.office || 'N/A'}</TableCell>
                      <TableCell>
                        {record.is_nip_access ? (
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
                        {record.is_eoffice_access ? (
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
                        {record.is_oas_access ? (
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
                        {record.is_internet_access ? (
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
      <ConnectivityStatusFormModal
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
        title={isViewMode ? 'View Connectivity Status' : editingRecord ? 'Edit Connectivity Status' : 'Add Connectivity Status'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Connectivity Status'}
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
        title="Delete Connectivity Status" 
      />
    </div>
  );
};

export default ConnectivityStatus;

