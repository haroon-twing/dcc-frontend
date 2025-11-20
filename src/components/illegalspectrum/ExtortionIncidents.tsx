import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import ExtortionIncidentFormModal from '../modals/illegalspectrum/ExtortionIncidentFormModal';
import DeleteModal from '../UI/DeleteModal';

interface ExtortionIncident {
  _id?: string;
  id?: string;
  location: string;
  date: string;
  extorted_from: string;
  extorted_by: string;
  affiliation_terr_grp: string;
  amount_extorted: number;
  action_taken: string;
  remarks: string;
}

interface ExtortionIncidentsProps {
  extortionId?: string;
}

export interface ExtortionIncidentFormState {
  id?: string;
  location: string;
  date: string;
  extorted_from: string;
  extorted_by: string;
  affiliation_terr_grp: string;
  amount_extorted: number;
  action_taken: string;
  remarks: string;
}

const ExtortionIncidents: React.FC<ExtortionIncidentsProps> = ({ extortionId }) => {
  const [records, setRecords] = useState<ExtortionIncident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ExtortionIncident | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ExtortionIncident | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
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
  
  const buildInitialForm = (): ExtortionIncidentFormState => ({
    id: undefined,
    location: '',
    date: '',
    extorted_from: '',
    extorted_by: '',
    affiliation_terr_grp: '',
    amount_extorted: 0,
    action_taken: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<ExtortionIncidentFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when available
      // const endpoint = extortionId
      //   ? `/extortion/get-all-extortion-incidents/${extortionId}`
      //   : '/extortion/get-all-extortion-incidents';
      // const response = await publicApi.get(endpoint);
      // const data = response.data?.data || response.data || [];
      
      // For now, using empty array
      const data: any[] = [];
      
      const records: ExtortionIncident[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        location: item.location || '',
        date: item.date || '',
        extorted_from: item.extorted_from || '',
        extorted_by: item.extorted_by || '',
        affiliation_terr_grp: item.affiliation_terr_grp || '',
        amount_extorted: item.amount_extorted || 0,
        action_taken: item.action_taken || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching extortion incidents:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [extortionId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (record: ExtortionIncident) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }

    setViewingRecord(record);
    setEditingRecord(null);
    setIsViewMode(true);
    setFormData({
      id: recordId,
      location: record.location,
      date: formatDateForInput(record.date),
      extorted_from: record.extorted_from,
      extorted_by: record.extorted_by,
      affiliation_terr_grp: record.affiliation_terr_grp,
      amount_extorted: record.amount_extorted,
      action_taken: record.action_taken,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleEdit = (record: ExtortionIncident) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      location: record.location,
      date: formatDateForInput(record.date),
      extorted_from: record.extorted_from,
      extorted_by: record.extorted_by,
      affiliation_terr_grp: record.affiliation_terr_grp,
      amount_extorted: record.amount_extorted,
      action_taken: record.action_taken,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: ExtortionIncident) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(`${record.location} - ${formatDate(record.date)}`);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        location: formData.location,
        date: formData.date,
        extorted_from: formData.extorted_from,
        extorted_by: formData.extorted_by,
        affiliation_terr_grp: formData.affiliation_terr_grp,
        amount_extorted: formData.amount_extorted,
        action_taken: formData.action_taken,
        remarks: formData.remarks,
        ...(extortionId && { extortion_id: extortionId }),
      };

      if (editingRecord) {
        // TODO: Replace with actual API endpoint when available
        // await api.put(`/extortion/update-extortion-incident/${formData.id}`, payload);
        console.log('Update extortion incident:', formData.id, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // await api.post('/extortion/add-extortion-incident', payload);
        console.log('Add extortion incident:', payload);
      }

      await fetchRecords();
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting extortion incident:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} extortion incident. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/extortion/delete-extortion-incident/${id}`);
      console.log('Delete extortion incident:', id);

      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (error: any) {
      console.error('Error deleting extortion incident:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete extortion incident. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.location.toLowerCase().includes(searchLower) ||
          record.extorted_from.toLowerCase().includes(searchLower) ||
          record.extorted_by.toLowerCase().includes(searchLower) ||
          record.affiliation_terr_grp.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (sortColumn === 'date') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'number') {
          // Keep as number
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Incidents of Extortion</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Extortion Incident
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by location, extorted from, extorted by..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('location')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Location
                    {getSortIcon('location')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Date
                    {getSortIcon('date')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('extorted_from')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Extorted From
                    {getSortIcon('extorted_from')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('extorted_by')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Extorted By
                    {getSortIcon('extorted_by')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('amount_extorted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Amount
                    {getSortIcon('amount_extorted')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading extortion incidents...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No extortion incidents found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.extorted_from}</TableCell>
                    <TableCell>{record.extorted_by}</TableCell>
                    <TableCell>{record.amount_extorted.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(record)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
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
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                          variant={currentPage === page ? 'default' : 'outline'}
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
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

      <ExtortionIncidentFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
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
        title={isViewMode ? 'View Extortion Incident' : editingRecord ? 'Edit Extortion Incident' : 'Add Extortion Incident'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Extortion Incident'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Extortion Incident"
      />
    </>
  );
};

export default ExtortionIncidents;

