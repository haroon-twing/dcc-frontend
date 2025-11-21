import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import NCPVehiclesDatabaseFormModal from '../modals/illegalspectrum/NCPVehiclesDatabaseFormModal';
import DeleteModal from '../UI/DeleteModal';

interface NCPVehiclesDatabase {
  _id?: string;
  id?: string;
  register_date: string;
  address: string;
  cnic_owner: string;
  veh_make_type: string;
  vehno: string;
  acquisition_method: string;
  present_use: string;
  remarks: string;
}

interface NCPVehiclesDatabaseProps {
  ncpVehiclesId?: string;
}

export interface NCPVehiclesDatabaseFormState {
  id?: string;
  register_date: string;
  address: string;
  cnic_owner: string;
  veh_make_type: string;
  vehno: string;
  acquisition_method: string;
  present_use: string;
  remarks: string;
}

const NCPVehiclesDatabase: React.FC<NCPVehiclesDatabaseProps> = ({ ncpVehiclesId }) => {
  const [records, setRecords] = useState<NCPVehiclesDatabase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<NCPVehiclesDatabase | null>(null);
  const [viewingRecord, setViewingRecord] = useState<NCPVehiclesDatabase | null>(null);
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
  
  // Utility function to build initial form state
  const buildInitialForm = (): NCPVehiclesDatabaseFormState => ({
    id: undefined,
    register_date: '',
    address: '',
    cnic_owner: '',
    veh_make_type: '',
    vehno: '',
    acquisition_method: '',
    present_use: '',
    remarks: '',
  });

  // Map API response to form data
  const mapRecordToFormData = (record: any): NCPVehiclesDatabaseFormState => ({
    id: record._id || record.id,
    register_date: formatDateForInput(record.register_date || ''),
    address: record.address || '',
    cnic_owner: record.cnic_owner || '',
    veh_make_type: record.veh_make_type || '',
    vehno: record.vehno || '',
    acquisition_method: record.acquisition_method || '',
    present_use: record.present_use || '',
    remarks: record.remarks || '',
  });

  // Reset form and modal state
  const resetFormAndModal = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(false);
  };

  const [formData, setFormData] = useState<NCPVehiclesDatabaseFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ispec-ncp-veh-database/get-all-ispec-ncp-veh-database');
      
      // Handle different response structures (array or object with data property)
      const responseData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      const records: NCPVehiclesDatabase[] = responseData.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        register_date: item.register_date || '',
        address: item.address || '',
        cnic_owner: item.cnic_owner || '',
        veh_make_type: item.veh_make_type || '',
        vehno: item.vehno || '',
        acquisition_method: item.acquisition_method || '',
        present_use: item.present_use || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching NCP vehicles database:', err);
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
    resetFormAndModal();
    setShowModal(true);
  };

  const navigate = useNavigate();

  const handleView = (record: NCPVehiclesDatabase) => {
    const recordId = record._id || record.id;
    if (recordId) {
      navigate(`/illegal-spectrum/ncp-vehicles-database/view/${recordId}`);
    }
  };

  const handleEdit = (record: NCPVehiclesDatabase) => {
    setEditingRecord(record);
    setFormData(mapRecordToFormData(record));
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (record: NCPVehiclesDatabase) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(`${record.vehno} - ${record.veh_make_type}`);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        register_date: formData.register_date,
        address: formData.address,
        cnic_owner: formData.cnic_owner,
        veh_make_type: formData.veh_make_type,
        vehno: formData.vehno,
        acquisition_method: formData.acquisition_method,
        present_use: formData.present_use,
        remarks: formData.remarks,
        ...(ncpVehiclesId && { ncp_vehicles_id: ncpVehiclesId }),
      };

      if (editingRecord) {
        // Update existing record
        await api.put(`/ispec-ncp-veh-database/update-ispec-ncp-veh-database/${formData.id}`, payload);
        window.alert('NCP vehicle record updated successfully!');
      } else {
        // Add new record
        const response = await api.post('/ispec-ncp-veh-database/add-ispec-ncp-veh-database', payload);
        
        // Show success message
        window.alert('NCP vehicle added to database successfully!');
      }

      await fetchRecords();
      resetFormAndModal();
    } catch (error: any) {
      console.error('Error submitting NCP vehicle database:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} NCP vehicle database. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      await api.delete(`/ispec-ncp-veh-database/delete-ispec-ncp-veh-database/${id}`);
      
      // Show success message
      window.alert('NCP vehicle record deleted successfully!');
      
      // Refresh the records list
      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (error: any) {
      console.error('Error deleting NCP vehicle database:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete NCP vehicle database. Please try again.'
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
          record.veh_make_type.toLowerCase().includes(searchLower) ||
          record.cnic_owner.toLowerCase().includes(searchLower) ||
          record.address.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (sortColumn === 'register_date') {
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NCP Vehicles Database</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add NCP Vehicle to Database
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vehicle number, make, CNIC, address..."
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
                    onClick={() => handleSort('register_date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Register Date
                    {getSortIcon('register_date')}
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
                <TableHead>
                  <button
                    onClick={() => handleSort('cnic_owner')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Owner CNIC
                    {getSortIcon('cnic_owner')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('acquisition_method')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Acquisition Method
                    {getSortIcon('acquisition_method')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading NCP vehicles database...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No NCP vehicles in database found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{formatDate(record.register_date)}</TableCell>
                    <TableCell>{record.vehno || '-'}</TableCell>
                    <TableCell>{record.veh_make_type || '-'}</TableCell>
                    <TableCell>{record.cnic_owner || '-'}</TableCell>
                    <TableCell>{record.acquisition_method || '-'}</TableCell>
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

      <NCPVehiclesDatabaseFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            resetFormAndModal();
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View NCP Vehicle Database' : editingRecord ? 'Edit NCP Vehicle Database' : 'Add NCP Vehicle to Database'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add NCP Vehicle to Database'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message="Are you sure you want to delete this record? This action cannot be undone."
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete NCP Vehicle from Database"
      />
    </>
  );
};

export default NCPVehiclesDatabase;

