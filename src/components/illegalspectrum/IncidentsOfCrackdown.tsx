import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import IncidentsOfCrackdownFormModal from '../modals/illegalspectrum/IncidentsOfCrackdownFormModal';
import DeleteModal from '../UI/DeleteModal';

interface IncidentsOfCrackdown {
  _id?: string;
  id?: string;
  date: string;
  location: string;
  no_people_apprehend: number;
  recoveries: string;
  details: string;
  remarks: string;
}

interface IncidentsOfCrackdownProps {
  armsExplosivesUreaId?: string;
}

export interface IncidentsOfCrackdownFormState {
  id?: string;
  date: string;
  location: string;
  no_people_apprehend: number;
  recoveries: string;
  details: string;
  remarks: string;
}

const IncidentsOfCrackdown: React.FC<IncidentsOfCrackdownProps> = ({ armsExplosivesUreaId }) => {
  const [records, setRecords] = useState<IncidentsOfCrackdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<IncidentsOfCrackdown | null>(null);
  const [viewingRecord, setViewingRecord] = useState<IncidentsOfCrackdown | null>(null);
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
  
  const buildInitialForm = (): IncidentsOfCrackdownFormState => ({
    id: undefined,
    date: '',
    location: '',
    no_people_apprehend: 0,
    recoveries: '',
    details: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<IncidentsOfCrackdownFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ispec-armsexpl-incidents-crackdown/get-all-ispec-armsexpl-incidents-crackdown');
      const data = response.data?.data || [];
      
      const records: IncidentsOfCrackdown[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        date: item.date || '',
        location: item.location || '',
        no_people_apprehend: item.no_people_apprehend || 0,
        recoveries: item.recoveries || '',
        details: item.details || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching incidents of crackdown:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [armsExplosivesUreaId]);

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

  const navigate = useNavigate();

  const handleView = (record: IncidentsOfCrackdown) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }
    navigate(`/illegal-spectrum/incidents-crackdown/details?id=${recordId}`);
  };

  const handleEdit = (record: IncidentsOfCrackdown) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      date: formatDateForInput(record.date),
      location: record.location,
      no_people_apprehend: record.no_people_apprehend,
      recoveries: record.recoveries,
      details: record.details,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: IncidentsOfCrackdown) => {
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
        date: formData.date,
        location: formData.location,
        no_people_apprehend: formData.no_people_apprehend,
        recoveries: formData.recoveries,
        details: formData.details,
        remarks: formData.remarks,
        ...(armsExplosivesUreaId && { arms_explosives_urea_id: armsExplosivesUreaId }),
      };

      if (editingRecord && formData.id) {
        await api.put(`/ispec-armsexpl-incidents-crackdown/update-ispec-armsexpl-incidents-crackdown/${formData.id}`, payload);
      } else {
        await api.post('/ispec-armsexpl-incidents-crackdown/add-ispec-armsexpl-incidents-crackdown', payload);
      }

      // Refresh the records after successful submission
      await fetchRecords();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting incident of crackdown:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} incident of crackdown. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    if (!id) return;
    
    try {
      setDeleting(true);
      
      await api.delete(`/ispec-armsexpl-incidents-crackdown/delete-ispec-armsexpl-incidents-crackdown/${id}`);
      
      // Refresh the records after successful deletion
      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete the record. Please try again.');
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
          record.recoveries.toLowerCase().includes(searchLower) ||
          record.details.toLowerCase().includes(searchLower)
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
            <CardTitle>Incidents of Crackdown on Illegal Arms/Explosives Traders</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Incident of Crackdown
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by location, recoveries, details..."
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
                    onClick={() => handleSort('date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Date
                    {getSortIcon('date')}
                  </button>
                </TableHead>
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
                    onClick={() => handleSort('no_people_apprehend')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    People Apprehended
                    {getSortIcon('no_people_apprehend')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('recoveries')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Recoveries
                    {getSortIcon('recoveries')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Loading incidents of crackdown...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No incidents of crackdown found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.no_people_apprehend}</TableCell>
                    <TableCell>{record.recoveries || '-'}</TableCell>
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

      <IncidentsOfCrackdownFormModal
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
        title={isViewMode ? 'View Incident of Crackdown' : editingRecord ? 'Edit Incident of Crackdown' : 'Add Incident of Crackdown'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Incident of Crackdown'}
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
        title="Delete Incident of Crackdown"
      />
    </>
  );
};

export default IncidentsOfCrackdown;

