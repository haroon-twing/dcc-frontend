import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import IncidentsOfCrackdownHawalaHundiFormModal from '../modals/illegalspectrum/IncidentsOfCrackdownHawalaHundiFormModal';
import DeleteModal from '../UI/DeleteModal';

interface IncidentsOfCrackdownHawalaHundi {
  _id?: string;
  id?: string;
  date: string;
  location: string;
  no_people_apprehend: number;
  recoveries_pkr: number;
  details: string;
  remarks: string;
  is_active: boolean;
}

interface IncidentsOfCrackdownHawalaHundiProps {
  hawalaHundiId?: string;
}

export interface IncidentsOfCrackdownHawalaHundiFormState {
  id?: string;
  date: string;
  location: string;
  no_people_apprehend: number;
  recoveries_pkr: number;
  details: string;
  remarks: string;
  is_active: boolean;
}

const IncidentsOfCrackdownHawalaHundi: React.FC<IncidentsOfCrackdownHawalaHundiProps> = ({ hawalaHundiId }) => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<IncidentsOfCrackdownHawalaHundi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<IncidentsOfCrackdownHawalaHundi | null>(null);
  const [viewingRecord, setViewingRecord] = useState<IncidentsOfCrackdownHawalaHundi | null>(null);
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
  
  const buildInitialForm = (): IncidentsOfCrackdownHawalaHundiFormState => ({
    id: undefined,
    date: '',
    location: '',
    no_people_apprehend: 0,
    recoveries_pkr: 0,
    details: '',
    remarks: '',
    is_active: true,
  });

  const [formData, setFormData] = useState<IncidentsOfCrackdownHawalaHundiFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ispec-hawala-hundi-incidents-crackdown-dealers/get-all-ispec-hawala-hundi-incidents-crackdown-dealers');
      const data = response.data?.data || response.data || [];
      
      const records: IncidentsOfCrackdownHawalaHundi[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        date: item.date || '',
        location: item.location || '',
        no_people_apprehend: item.no_people_apprehend || 0,
        recoveries_pkr: item.recoveries_pkr || 0,
        details: item.details || '',
        remarks: item.remarks || '',
        is_active: item.is_active !== undefined ? item.is_active : true,
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching incidents of crackdown on hawala/hundi dealers:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [hawalaHundiId]);

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = (record: IncidentsOfCrackdownHawalaHundi) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }
    
    // Navigate to the details page with the record ID
    navigate(`/illegal-spectrum/hawala-hundi/incidents/details?id=${recordId}`);
  };

  const handleEdit = (record: IncidentsOfCrackdownHawalaHundi) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      date: formatDateForInput(record.date),
      location: record.location,
      no_people_apprehend: record.no_people_apprehend,
      recoveries_pkr: record.recoveries_pkr,
      details: record.details,
      remarks: record.remarks,
      is_active: record.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = (record: IncidentsOfCrackdownHawalaHundi) => {
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
        recoveries_pkr: formData.recoveries_pkr,
        details: formData.details,
        remarks: formData.remarks,
        is_active: formData.is_active,
        ...(hawalaHundiId && { hawala_hundi_id: hawalaHundiId }),
      };

      if (editingRecord && formData.id) {
        // Update existing record
        await api.put(`/ispec-hawala-hundi-incidents-crackdown-dealers/update-ispec-hawala-hundi-incidents-crackdown-dealer/${formData.id}`, payload);
      } else {
        // Add new record
        await api.post('/ispec-hawala-hundi-incidents-crackdown-dealers/add-ispec-hawala-hundi-incidents-crackdown-dealer', payload);
      }

      await fetchRecords();
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting incident of crackdown on hawala/hundi dealers:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} incident of crackdown on hawala/hundi dealers. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      await api.delete(`/ispec-hawala-hundi-incidents-crackdown-dealers/delete-ispec-hawala-hundi-incidents-crackdown-dealer/${id}`);
      
      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (error: any) {
      console.error('Error deleting incident of crackdown on hawala/hundi dealers:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete incident of crackdown on hawala/hundi dealers. Please try again.'
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
          record.details.toLowerCase().includes(searchLower) ||
          record.remarks.toLowerCase().includes(searchLower)
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
        } else if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
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

  const getDisplayValue = (value: boolean): string => {
    return value ? 'Yes' : 'No';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Incidents of Crackdown on Hawala/ Hundi Dealers</CardTitle>
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
                placeholder="Search by location, details, remarks..."
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
                    onClick={() => handleSort('recoveries_pkr')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Recoveries (PKR)
                    {getSortIcon('recoveries_pkr')}
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
                    <TableCell>{formatCurrency(record.recoveries_pkr)}</TableCell>
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

      <IncidentsOfCrackdownHawalaHundiFormModal
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

export default IncidentsOfCrackdownHawalaHundi;

