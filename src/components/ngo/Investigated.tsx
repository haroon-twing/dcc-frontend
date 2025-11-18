import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Search, Loader2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import InvestigatedFormModal from '../modals/ngo/InvestigatedFormModal';

interface Investigated {
  _id?: string;
  id?: string;
  ngo_id: string;
  investigating_agency_dept?: string;
  nature_of_allegation?: string;
  action_taken?: string;
  remarks?: string;
  investigation_date?: string;
  status?: string;
}

interface InvestigatedFormState {
  investigating_agency_dept: string;
  nature_of_allegation: string;
  action_taken: string;
  remarks: string;
  investigation_date: string;
  status: string;
}

interface InvestigatedProps {
  ngoId: string;
}

const Investigated: React.FC<InvestigatedProps> = ({ ngoId }) => {
  const [records, setRecords] = useState<Investigated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Investigated | null>(null);
  const [viewingRecord, setViewingRecord] = useState<Investigated | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<InvestigatedFormState>({
    investigating_agency_dept: '',
    nature_of_allegation: '',
    action_taken: '',
    remarks: '',
    investigation_date: '',
    status: '',
  });

  const buildInitialForm = (): InvestigatedFormState => ({
    investigating_agency_dept: '',
    nature_of_allegation: '',
    action_taken: '',
    remarks: '',
    investigation_date: '',
    status: '',
  });

  const fetchRecords = useCallback(async () => {
    if (!ngoId) {
      setLoading(false);
      setRecords([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/ngo/get-ngo-investigateds/${ngoId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const recordsData: Investigated[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        ngo_id: item.ngo_id || ngoId,
        investigating_agency_dept: item.investigating_agency_dept || '',
        nature_of_allegation: item.nature_of_allegation || '',
        action_taken: item.action_taken || '',
        remarks: item.remarks || '',
        investigation_date: item.investigation_date || '',
        status: item.status || '',
      }));
      
      setRecords(recordsData);
    } catch (err: any) {
      console.error('Error fetching investigated records:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load investigated records. Please try again.'
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [ngoId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (record: Investigated) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is missing. Cannot load record details.');
      return;
    }

    setLoadingRecord(true);
    setViewingRecord(record);
    setEditingRecord(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/ngo/get-single-ngo-investigated/${recordId}`;
      const response = await publicApi.get(viewEndpoint);
      const recordData: Investigated = response.data?.data || response.data;

      if (recordData) {
        setFormData({
          investigating_agency_dept: recordData.investigating_agency_dept || '',
          nature_of_allegation: recordData.nature_of_allegation || '',
          action_taken: recordData.action_taken || '',
          remarks: recordData.remarks || '',
          investigation_date: recordData.investigation_date || '',
          status: recordData.status || '',
        });
      } else {
        // Fallback to record data from table if API doesn't return data
        setFormData({
          investigating_agency_dept: record.investigating_agency_dept || '',
          nature_of_allegation: record.nature_of_allegation || '',
          action_taken: record.action_taken || '',
          remarks: record.remarks || '',
          investigation_date: record.investigation_date || '',
          status: record.status || '',
        });
      }

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching record details:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load record details. Please try again.'
      );
      setFormData({
        investigating_agency_dept: record.investigating_agency_dept || '',
        nature_of_allegation: record.nature_of_allegation || '',
        action_taken: record.action_taken || '',
        remarks: record.remarks || '',
        investigation_date: record.investigation_date || '',
        status: record.status || '',
      });
      setShowModal(true);
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleEdit = (record: Investigated) => {
    setFormData({
      investigating_agency_dept: record.investigating_agency_dept || '',
      nature_of_allegation: record.nature_of_allegation || '',
      action_taken: record.action_taken || '',
      remarks: record.remarks || '',
      investigation_date: record.investigation_date || '',
      status: record.status || '',
    });
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: Investigated) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(record.nature_of_allegation || 'this investigated record');
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/ngo/delete-ngo-investigated/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting investigated record:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete investigated record. Please try again.'
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
        investigating_agency_dept: formData.investigating_agency_dept,
        nature_of_allegation: formData.nature_of_allegation,
        action_taken: formData.action_taken,
        remarks: formData.remarks || '',
        investigation_date: formData.investigation_date,
        status: formData.status,
        ngo_id: ngoId,
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        const updateEndpoint = `/ngo/update-ngo-investigated/${recordId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ngo/add-ngo-investigated';
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
      console.error('Error saving investigated record:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} investigated record. Please try again.`
      );
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
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
          (record.investigating_agency_dept || '').toLowerCase().includes(searchLower) ||
          (record.nature_of_allegation || '').toLowerCase().includes(searchLower) ||
          (record.action_taken || '').toLowerCase().includes(searchLower) ||
          (record.status || '').toLowerCase().includes(searchLower) ||
          (record.remarks || '').toLowerCase().includes(searchLower) ||
          formatDate(record.investigation_date || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'investigation_date':
            aValue = new Date(a.investigation_date || 0).getTime();
            bValue = new Date(b.investigation_date || 0).getTime();
            break;
          case 'investigating_agency_dept':
            aValue = (a.investigating_agency_dept || '').toLowerCase();
            bValue = (b.investigating_agency_dept || '').toLowerCase();
            break;
          case 'nature_of_allegation':
            aValue = (a.nature_of_allegation || '').toLowerCase();
            bValue = (b.nature_of_allegation || '').toLowerCase();
            break;
          case 'status':
            aValue = (a.status || '').toLowerCase();
            bValue = (b.status || '').toLowerCase();
            break;
          default:
            return 0;
        }

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
      <Card>
        <CardHeader>
          <CardTitle>Investigated</CardTitle>
          <CardDescription>Investigation records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading investigated records...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investigated</CardTitle>
          <CardDescription>Investigation records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investigated</CardTitle>
              <CardDescription>Investigation records for this NGO</CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Add Investigated
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search investigated records..."
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
                <TableHead>
                  <button
                    onClick={() => handleSort('investigation_date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Investigation Date {getSortIcon('investigation_date')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('investigating_agency_dept')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Investigating Agency/Dept {getSortIcon('investigating_agency_dept')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('nature_of_allegation')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Nature of Allegation {getSortIcon('nature_of_allegation')}
                  </button>
                </TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Status {getSortIcon('status')}
                  </button>
                </TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No investigated records found matching your search.' : 'No investigated records found for this NGO.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{formatDate(record.investigation_date || '')}</TableCell>
                    <TableCell className="font-medium">{record.investigating_agency_dept || 'N/A'}</TableCell>
                    <TableCell>{record.nature_of_allegation || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={record.action_taken}>
                      {record.action_taken || 'N/A'}
                    </TableCell>
                    <TableCell>{record.status || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={record.remarks}>
                      {record.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View"
                          onClick={() => handleView(record)}
                          disabled={loadingRecord}
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                          onClick={() => handleDelete(record)}
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

      {/* Form Modal */}
      <InvestigatedFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setFormData(buildInitialForm());
            setEditingRecord(null);
            setViewingRecord(null);
            setIsViewMode(false);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={
          isViewMode
            ? 'View Investigated'
            : editingRecord
            ? 'Edit Investigated'
            : 'Add Investigated'
        }
        submitLabel={editingRecord ? 'Update' : 'Save'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteSubmit}
        id={recordToDeleteId}
        message={`Are you sure you want to delete the investigated record "${recordToDeleteName}"? This action cannot be undone.`}
        deleting={deleting}
      />
    </Card>
  );
};

export default Investigated;

