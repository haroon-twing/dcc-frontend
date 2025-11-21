import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import NCPVehicleRecoveryFormModal from '../modals/illegalspectrum/NCPVehicleRecoveryFormModal';
import DeleteModal from '../UI/DeleteModal';
import { useNavigate } from 'react-router-dom';

interface NCPVehicleRecovery {
  _id?: string;
  id?: string;
  date: string;
  location: string;
  activity_type: string;
  veh_make_type: string;
  vehno: string;
  cnic_owner: string;
  cnic_driver: string;
  remarks: string;
}

interface NCPVehicleRecoveryProps {
  ncpVehiclesId?: string;
}

export interface NCPVehicleRecoveryFormState {
  id?: string;
  date: string;
  location: string;
  activity_type: string;
  veh_make_type: string;
  vehno: string;
  cnic_owner: string;
  cnic_driver: string;
  remarks: string;
}

const buildInitialForm = (): NCPVehicleRecoveryFormState => ({
  id: undefined,
  date: '',
  location: '',
  activity_type: '',
  veh_make_type: '',
  vehno: '',
  cnic_owner: '',
  cnic_driver: '',
  remarks: '',
});

const NCPVehicleRecovery: React.FC<NCPVehicleRecoveryProps> = ({ ncpVehiclesId }) => {
  const [records, setRecords] = useState<NCPVehicleRecovery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRecord, setEditingRecord] = useState<NCPVehicleRecovery | null>(null);
  const [formData, setFormData] = useState<NCPVehicleRecoveryFormState>(buildInitialForm());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>();
  const [deleting, setDeleting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ispec-ncp-veh-recovery/get-all-ispec-ncp-veh-recovery');

      // Handle different response structures (array or object with data property)
      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      const records: NCPVehicleRecovery[] = responseData.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        date: item.date || '',
        location: item.location || '',
        activity_type: item.activity_type || '',
        veh_make_type: item.veh_make_type || '',
        vehno: item.vehno || '',
        cnic_owner: item.cnic_owner || '',
        cnic_driver: item.cnic_driver || '',
        remarks: item.remarks || '',
      }));

      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching NCP vehicle recovery:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [ncpVehiclesId]);

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
    setEditingRecord({
      id: '',
      date: '',
      location: '',
      activity_type: '',
      veh_make_type: '',
      vehno: '',
      cnic_owner: '',
      cnic_driver: '',
      remarks: ''
    });
  };

  const handleView = (record: NCPVehicleRecovery) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }
    navigate(`/illegal-spectrum/ncp-vehicles-recovery/view/${recordId}`);
  };

  const handleEdit = (record: NCPVehicleRecovery) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      console.error('Cannot edit record: No ID found');
      return;
    }
    
    // Set the form data first
    const formData = {
      id: recordId,
      date: formatDateForInput(record.date) || '',
      location: record.location || '',
      activity_type: record.activity_type || '',
      veh_make_type: record.veh_make_type || '',
      vehno: record.vehno || '',
      cnic_owner: record.cnic_owner || '',
      cnic_driver: record.cnic_driver || '',
      remarks: record.remarks || ''
    };
    
    // Update both form data and editing record
    setFormData(formData);
    setEditingRecord({ ...record });
    
    // Don't navigate, we'll handle it with the modal
  };

  const handleDelete = (record: NCPVehicleRecovery) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        date: formData.date,
        location: formData.location,
        activity_type: formData.activity_type,
        veh_make_type: formData.veh_make_type,
        vehno: formData.vehno,
        cnic_owner: formData.cnic_owner,
        cnic_driver: formData.cnic_driver,
        remarks: formData.remarks,
        ...(ncpVehiclesId && { ncp_vehicles_id: ncpVehiclesId }),
      };

      // Check if we're in edit mode and have a valid ID
      const isEditMode = formData.id || (editingRecord && (editingRecord.id || editingRecord._id));
      const recordId = formData.id || (editingRecord && (editingRecord.id || editingRecord._id));

      if (isEditMode && !recordId) {
        throw new Error('Record ID is required for updating');
      }

      if (isEditMode && recordId) {
        await api.put(`/ispec-ncp-veh-recovery/update-ispec-ncp-veh-recovery/${recordId}`, payload);
        window.alert('NCP vehicle recovery updated successfully!');
      } else {
        await api.post('/ispec-ncp-veh-recovery/add-ispec-ncp-veh-recovery', payload);
        window.alert('NCP vehicle recovery added successfully!');
      }

      await fetchRecords();
      setFormData(buildInitialForm());
      setEditingRecord(null);
    } catch (error: any) {
      console.error('Error submitting NCP vehicle recovery:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} NCP vehicle recovery. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      await api.delete(`/ispec-ncp-veh-recovery/delete-ispec-ncp-veh-recovery/${id}`);
      window.alert('NCP vehicle recovery deleted successfully!');

      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
    } catch (error: any) {
      console.error('Error deleting NCP vehicle recovery:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete NCP vehicle recovery. Please try again.'
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
          record.vehno.toLowerCase().includes(searchLower) ||
          record.location.toLowerCase().includes(searchLower) ||
          record.activity_type.toLowerCase().includes(searchLower) ||
          record.veh_make_type.toLowerCase().includes(searchLower)
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

  const modalTitle = editingRecord ? 'Edit NCP Vehicle Recovery' : 'Add NCP Vehicle Recovery';
  const submitLabel = editingRecord ? 'Update' : 'Add';

  return (
    <>
      <NCPVehicleRecoveryFormModal
        open={!!editingRecord}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRecord(null);
            setFormData(buildInitialForm());
          }
        }}
        onSubmit={handleSubmit}
        title={modalTitle}
        submitLabel={submitLabel}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NCP Vehicle Recovery</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add NCP Vehicle Recovery
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vehicle number, location, activity type..."
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
                    onClick={() => handleSort('activity_type')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Activity Type
                    {getSortIcon('activity_type')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('vehno')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Vehicle Number
                    {getSortIcon('vehno')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('veh_make_type')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Vehicle Make/Type
                    {getSortIcon('veh_make_type')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading NCP vehicle recovery...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No NCP vehicle recovery found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                    <TableCell>{record.activity_type || '-'}</TableCell>
                    <TableCell>{record.vehno || '-'}</TableCell>
                    <TableCell>{record.veh_make_type || '-'}</TableCell>
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

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message="Are you sure you want to delete this record? This action cannot be undone."
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete NCP Vehicle Recovery"
      />
    </>
  );
};

export default NCPVehicleRecovery;

