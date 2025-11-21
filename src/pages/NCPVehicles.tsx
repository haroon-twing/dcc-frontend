import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import NCPVehiclesFormModal, { NCPVehiclesFormState } from '../components/modals/illegalspectrum/NCPVehiclesFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import NCPVehiclesDatabase from '../components/illegalspectrum/NCPVehiclesDatabase';
import NCPStatusByDistrict from '../components/illegalspectrum/NCPStatusByDistrict';
import NCPVehicleRecovery from '../components/illegalspectrum/NCPVehicleRecovery';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface NCPVehiclesRecord {
  id: string;
  is_db_formed: boolean;
  no_cps_auth_lookfor_seize_ncp: number;
  no_ncp_veh_regularized: number;
  no_ncp_owners_apprehended: number;
  no_ncp_owners_convicted: number;
  no_ncp_owners_setfreebycourt: number;
  no_ncp_owners_casepending: number;
  remarks: string;
}

const buildInitialForm = (): NCPVehiclesFormState => ({
  id: undefined,
  is_db_formed: false,
  no_cps_auth_lookfor_seize_ncp: 0,
  no_ncp_veh_regularized: 0,
  no_ncp_owners_apprehended: 0,
  no_ncp_owners_convicted: 0,
  no_ncp_owners_setfreebycourt: 0,
  no_ncp_owners_casepending: 0,
  remarks: '',
});

const NCPVehicles: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<NCPVehiclesFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [records, setRecords] = useState<NCPVehiclesRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get('/ispec-ncp-vehicles/get-all-ispec-ncp-vehicles');
        
        // Handle different response structures (array or object with data property)
        const responseData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data || [];
          
        const formattedRecords = responseData.map((item: any) => ({
          id: item._id || item.id,
          is_db_formed: item.is_db_formed || false,
          no_cps_auth_lookfor_seize_ncp: item.no_cps_auth_lookfor_seize_ncp || 0,
          no_ncp_veh_regularized: item.no_ncp_veh_regularized || 0,
          no_ncp_owners_apprehended: item.no_ncp_owners_apprehended || 0,
          no_ncp_owners_convicted: item.no_ncp_owners_convicted || 0,
          no_ncp_owners_setfreebycourt: item.no_ncp_owners_setfreebycourt || 0,
          no_ncp_owners_casepending: item.no_ncp_owners_casepending || 0,
          remarks: item.remarks || '',
        }));
        
        setRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching NCP vehicles records:', error);
        setRecords([]);
        // Optionally show error to user
        window.alert('Failed to load NCP vehicles records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        is_db_formed: formData.is_db_formed,
        no_cps_auth_lookfor_seize_ncp: formData.no_cps_auth_lookfor_seize_ncp,
        no_ncp_veh_regularized: formData.no_ncp_veh_regularized,
        no_ncp_owners_apprehended: formData.no_ncp_owners_apprehended,
        no_ncp_owners_convicted: formData.no_ncp_owners_convicted,
        no_ncp_owners_setfreebycourt: formData.no_ncp_owners_setfreebycourt,
        no_ncp_owners_casepending: formData.no_ncp_owners_casepending,
        remarks: formData.remarks,
      };

      if (editingId) {
        // Update existing record
        const response = await api.put(`/ispec-ncp-vehicles/update-ispec-ncp-vehicle/${editingId}`, payload);
        const updatedRecord = response.data?.data || response.data;
        
        if (updatedRecord) {
          // Update the record in the list
          setRecords(prevRecords => 
            prevRecords.map(record => 
              record.id === editingId 
                ? { 
                    ...record, 
                    ...updatedRecord,
                    id: updatedRecord._id || updatedRecord.id || record.id,
                    is_db_formed: updatedRecord.is_db_formed || false,
                    no_cps_auth_lookfor_seize_ncp: updatedRecord.no_cps_auth_lookfor_seize_ncp || 0,
                    no_ncp_veh_regularized: updatedRecord.no_ncp_veh_regularized || 0,
                    no_ncp_owners_apprehended: updatedRecord.no_ncp_owners_apprehended || 0,
                    no_ncp_owners_convicted: updatedRecord.no_ncp_owners_convicted || 0,
                    no_ncp_owners_setfreebycourt: updatedRecord.no_ncp_owners_setfreebycourt || 0,
                    no_ncp_owners_casepending: updatedRecord.no_ncp_owners_casepending || 0,
                    remarks: updatedRecord.remarks || '',
                  } 
                : record
            )
          );
          window.alert('NCP vehicles record updated successfully!');
        }
      } else {
        // Add new record
        const response = await api.post('/ispec-ncp-vehicles/add-ispec-ncp-vehicle', payload);
        const newRecord = response.data?.data || response.data;
        
        if (newRecord) {
          // Add the new record to the list
          setRecords(prevRecords => [
            {
              id: newRecord._id || newRecord.id,
              is_db_formed: newRecord.is_db_formed || false,
              no_cps_auth_lookfor_seize_ncp: newRecord.no_cps_auth_lookfor_seize_ncp || 0,
              no_ncp_veh_regularized: newRecord.no_ncp_veh_regularized || 0,
              no_ncp_owners_apprehended: newRecord.no_ncp_owners_apprehended || 0,
              no_ncp_owners_convicted: newRecord.no_ncp_owners_convicted || 0,
              no_ncp_owners_setfreebycourt: newRecord.no_ncp_owners_setfreebycourt || 0,
              no_ncp_owners_casepending: newRecord.no_ncp_owners_casepending || 0,
              remarks: newRecord.remarks || '',
            },
            ...prevRecords
          ]);
          
          window.alert('NCP vehicles record created successfully!');
        }
      }

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting NCP vehicles record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} NCP vehicles record. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setViewingId(null);
    setFormData(buildInitialForm());
    setShowAddModal(true);
  };

  const openEditModal = (record: NCPVehiclesRecord) => {
    setEditingId(record.id);
    setViewingId(null);
    setFormData({
      id: record.id,
      is_db_formed: record.is_db_formed,
      no_cps_auth_lookfor_seize_ncp: record.no_cps_auth_lookfor_seize_ncp,
      no_ncp_veh_regularized: record.no_ncp_veh_regularized,
      no_ncp_owners_apprehended: record.no_ncp_owners_apprehended,
      no_ncp_owners_convicted: record.no_ncp_owners_convicted,
      no_ncp_owners_setfreebycourt: record.no_ncp_owners_setfreebycourt,
      no_ncp_owners_casepending: record.no_ncp_owners_casepending,
      remarks: record.remarks,
    });
    setShowAddModal(true);
  };

  const handleView = (record: NCPVehiclesRecord) => {
    navigate(`/illegal-spectrum/ncp-vehicles/view/${record.id}`);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    if (!id) {
      console.error('No record ID provided for deletion');
      window.alert('Error: No record ID provided for deletion');
      return;
    }

    setDeleting(true);

    try {
      // Make the API call to delete the record
      await api.delete(`/ispec-ncp-vehicles/delete-ispec-ncp-vehicle/${id}`);
      
      // Update the UI by removing the deleted record
      setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      
      // Reset the delete target states
      setDeleteTargetId(null);
      setDeleteTargetName(null);
      
      // Show success message
      window.alert('NCP vehicles record deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting NCP vehicles record:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete NCP vehicles record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = viewingId
    ? 'View NCP Vehicles Record'
    : editingId
    ? 'Edit NCP Vehicles Record'
    : 'Add NCP Vehicles Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add NCP Vehicles Record';

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.id.toLowerCase().includes(searchLower) ||
          record.remarks.toLowerCase().includes(searchLower) ||
          record.no_cps_auth_lookfor_seize_ncp.toString().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
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

  const getDisplayValue = (value: boolean): string => {
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">NCP Vehicles</h2>
          <p className="text-muted-foreground">Manage NCP (Non-Custom Paid) vehicles records and statistics.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
          <Button onClick={openCreateModal} className="self-start sm:self-auto">
            Add NCP Vehicles Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NCP Vehicles Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_db_formed')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    DB Formed
                    {getSortIcon('is_db_formed')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_cps_auth_lookfor_seize_ncp')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    CPS Authorized to Look/Seize
                    {getSortIcon('no_cps_auth_lookfor_seize_ncp')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ncp_veh_regularized')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Vehicles Regularized
                    {getSortIcon('no_ncp_veh_regularized')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ncp_owners_apprehended')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Owners Apprehended
                    {getSortIcon('no_ncp_owners_apprehended')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ncp_owners_convicted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Owners Convicted
                    {getSortIcon('no_ncp_owners_convicted')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading NCP vehicles records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No NCP vehicles records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_db_formed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_db_formed)}
                      </span>
                    </TableCell>
                    <TableCell>{record.no_cps_auth_lookfor_seize_ncp}</TableCell>
                    <TableCell>{record.no_ncp_veh_regularized}</TableCell>
                    <TableCell>{record.no_ncp_owners_apprehended}</TableCell>
                    <TableCell>{record.no_ncp_owners_convicted}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/illegal-spectrum/ncp-vehicles/view/${record.id}`)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteTargetId(record.id);
                            setDeleteTargetName(`NCP Vehicles Record ${record.id}`);
                          }}
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

      {/* Tabs Section */}
      <Tabs defaultValue="vehicles-database" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicles-database">NCP Vehicles Database</TabsTrigger>
          <TabsTrigger value="status-by-district">NCP Status by District</TabsTrigger>
          <TabsTrigger value="vehicle-recovery">NCP Vehicle Recovery</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles-database" className="mt-4">
          <NCPVehiclesDatabase ncpVehiclesId={undefined} />
        </TabsContent>
        <TabsContent value="status-by-district" className="mt-4">
          <NCPStatusByDistrict ncpVehiclesId={undefined} />
        </TabsContent>
        <TabsContent value="vehicle-recovery" className="mt-4">
          <NCPVehicleRecovery ncpVehiclesId={undefined} />
        </TabsContent>
      </Tabs>

      <NCPVehiclesFormModal
        open={showAddModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            setShowAddModal(false);
            setFormData(buildInitialForm());
            setEditingId(null);
            setViewingId(null);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={modalTitle}
        submitLabel={submitLabel}
        submitting={submitting}
        viewMode={!!viewingId}
      />

      <DeleteModal
        open={!!deleteTargetId}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTargetId(null);
            setDeleteTargetName(null);
          }
        }}
        id={deleteTargetId}
        message="Are you sure you want to delete this NCP Vehicles record? This action cannot be undone."
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete NCP Vehicles Record"
      />
    </div>
  );
};

export default NCPVehicles;

