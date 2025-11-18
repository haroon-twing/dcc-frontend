import React, { useEffect, useState, useMemo } from 'react';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2 } from 'lucide-react';
import ProscribedTerroristFormModal, { ProscribedTerroristFormState } from '../components/modals/proscribedterrorist/ProscribedTerroristFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface ProscribedTerroristOrg {
  _id?: string;
  id?: string;
  to_name: string;
  location: string;
  estimate_strength: number;
  date_proscription: string;
  proscribing_authority: string;
  remarks?: string;
}

const buildInitialForm = (): ProscribedTerroristFormState => ({
  to_name: '',
  location: '',
  estimate_strength: 0,
  date_proscription: '',
  proscribing_authority: '',
  remarks: '',
});

const ProscribedTerroristOrganization: React.FC = () => {
  const [records, setRecords] = useState<ProscribedTerroristOrg[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProscribedTerroristOrg | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ProscribedTerroristOrg | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProscribedTerroristFormState>(buildInitialForm());
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
      const response = await publicApi.get('/ops-resp-proscribed-tos/get-all-ops-resp-proscribed-tos');
      const data = response.data?.data || response.data || [];
      
      // Map the API response to our interface
      const mappedData: ProscribedTerroristOrg[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item.id || item._id,
        to_name: item.to_name || '',
        location: item.location || '',
        estimate_strength: item.estimate_strength || 0,
        date_proscription: item.date_proscription || '',
        proscribing_authority: item.proscribing_authority || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(mappedData);
    } catch (err: any) {
      console.error('Error fetching proscribed terrorist organizations:', err);
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

  const handleView = async (record: ProscribedTerroristOrg) => {
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
      const response = await publicApi.get(`/ops-resp-proscribed-tos/get-single-ops-resp-proscribed-to/${recordId}`);
      const data = response.data?.data || response.data;
      
      if (data) {
        setFormData({
          to_name: data.to_name || '',
          location: data.location || '',
          estimate_strength: data.estimate_strength || 0,
          date_proscription: data.date_proscription || '',
          proscribing_authority: data.proscribing_authority || '',
          remarks: data.remarks || '',
        });
        setViewingRecord({
          _id: data._id || data.id,
          id: data.id || data._id,
          to_name: data.to_name || '',
          location: data.location || '',
          estimate_strength: data.estimate_strength || 0,
          date_proscription: data.date_proscription || '',
          proscribing_authority: data.proscribing_authority || '',
          remarks: data.remarks || '',
        });
      } else {
        window.alert('No data received from server');
        setShowModal(false);
      }
    } catch (err: any) {
      console.error('Error fetching proscribed terrorist organization details:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load organization details. Please try again.'
      );
      setShowModal(false);
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = (record: ProscribedTerroristOrg) => {
    setFormData({
      to_name: record.to_name || '',
      location: record.location || '',
      estimate_strength: record.estimate_strength || 0,
      date_proscription: record.date_proscription || '',
      proscribing_authority: record.proscribing_authority || '',
      remarks: record.remarks || '',
    });
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: ProscribedTerroristOrg) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(record.to_name || `Organization ID: ${recordId}`);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/ops-resp-proscribed-tos/delete-ops-resp-proscribed-to/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting proscribed terrorist organization:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete organization. Please try again.'
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
        to_name: formData.to_name,
        location: formData.location,
        estimate_strength: formData.estimate_strength,
        date_proscription: formData.date_proscription,
        proscribing_authority: formData.proscribing_authority,
        remarks: formData.remarks || '',
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        const updateEndpoint = `/ops-resp-proscribed-tos/update-ops-resp-proscribed-to/${recordId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ops-resp-proscribed-tos/add-ops-resp-proscribed-to';
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
      console.error('Error saving proscribed terrorist organization:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} organization. Please try again.`
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
          record.to_name?.toLowerCase().includes(searchLower) ||
          record.location?.toLowerCase().includes(searchLower) ||
          record.proscribing_authority?.toLowerCase().includes(searchLower) ||
          record.remarks?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof ProscribedTerroristOrg] || '';
        const bValue = b[sortColumn as keyof ProscribedTerroristOrg] || '';
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading proscribed terrorist organizations...</p>
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
                <CardTitle className="text-2xl font-bold">Proscribed Terrorist Organization</CardTitle>
                <p className="text-muted-foreground mt-1">Manage proscribed terrorist organizations</p>
              </div>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Proscribed Terrorist Organization
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search organizations..."
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
                <col className="w-[18%]" />
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[15%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('to_name')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Organization Name {getSortIcon('to_name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('location')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Location {getSortIcon('location')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('estimate_strength')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Estimate Strength {getSortIcon('estimate_strength')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('date_proscription')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Date of Proscription {getSortIcon('date_proscription')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('proscribing_authority')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Proscribing Authority {getSortIcon('proscribing_authority')}
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
                      {searchTerm ? 'No organizations found matching your search.' : 'No proscribed terrorist organizations found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell className="truncate" title={record.to_name}>
                        {record.to_name || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={record.location}>
                        {record.location || 'N/A'}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        {record.estimate_strength || 0}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(record.date_proscription)}
                      </TableCell>
                      <TableCell className="truncate" title={record.proscribing_authority}>
                        {record.proscribing_authority || 'N/A'}
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
      <ProscribedTerroristFormModal
        open={showModal}
        onOpenChange={setShowModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Proscribed Terrorist Organization' : editingRecord ? 'Edit Proscribed Terrorist Organization' : 'Add Proscribed Terrorist Organization'}
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

export default ProscribedTerroristOrganization;
