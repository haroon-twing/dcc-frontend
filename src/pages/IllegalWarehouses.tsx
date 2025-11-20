import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import IllegalWarehousesFormModal, { IllegalWarehousesFormState } from '../components/modals/illegalspectrum/IllegalWarehousesFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import ActionsTakenAgainstIllegalWarehouses from '../components/illegalspectrum/ActionsTakenAgainstIllegalWarehouses';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface IllegalWarehousesRecord {
  id: string;
  is_db_formed: boolean;
  no_ill_wh_owner_apprehended: number;
  no_ill_wh_owner_convicted: number;
  no_ill_wh_owner_setfreebycourt: number;
  no_appr_ill_wh_owner_case_pending: number;
  remarks: string;
}

const buildInitialForm = (): IllegalWarehousesFormState => ({
  id: undefined,
  is_db_formed: false,
  no_ill_wh_owner_apprehended: 0,
  no_ill_wh_owner_convicted: 0,
  no_ill_wh_owner_setfreebycourt: 0,
  no_appr_ill_wh_owner_case_pending: 0,
  remarks: '',
});

const IllegalWarehouses: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<IllegalWarehousesFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [records, setRecords] = useState<IllegalWarehousesRecord[]>([]);
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
        // TODO: Replace with actual API endpoint when available
        // const response = await publicApi.get('/get-all-illegal-warehouses');
        // For now, using empty array
        setRecords([]);
      } catch (error) {
        console.error('Error fetching illegal warehouses records:', error);
        setRecords([]);
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
        no_ill_wh_owner_apprehended: formData.no_ill_wh_owner_apprehended,
        no_ill_wh_owner_convicted: formData.no_ill_wh_owner_convicted,
        no_ill_wh_owner_setfreebycourt: formData.no_ill_wh_owner_setfreebycourt,
        no_appr_ill_wh_owner_case_pending: formData.no_appr_ill_wh_owner_case_pending,
        remarks: formData.remarks,
      };

      let response;
      if (editingId) {
        // TODO: Replace with actual API endpoint when available
        // response = await api.put(`/update-illegal-warehouses/${editingId}`, payload);
        console.log('Update illegal warehouses:', editingId, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // response = await api.post('/add-illegal-warehouses', payload);
        console.log('Add illegal warehouses:', payload);
      }

      // TODO: Refresh the list after successful submission
      // const recordsResponse = await publicApi.get('/get-all-illegal-warehouses');
      // Process and set records

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting illegal warehouses record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} illegal warehouses record. Please try again.`
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

  const openEditModal = (record: IllegalWarehousesRecord) => {
    setEditingId(record.id);
    setViewingId(null);
    setFormData({
      id: record.id,
      is_db_formed: record.is_db_formed,
      no_ill_wh_owner_apprehended: record.no_ill_wh_owner_apprehended,
      no_ill_wh_owner_convicted: record.no_ill_wh_owner_convicted,
      no_ill_wh_owner_setfreebycourt: record.no_ill_wh_owner_setfreebycourt,
      no_appr_ill_wh_owner_case_pending: record.no_appr_ill_wh_owner_case_pending,
      remarks: record.remarks,
    });
    setShowAddModal(true);
  };

  const openViewModal = (record: IllegalWarehousesRecord) => {
    setViewingId(record.id);
    setEditingId(null);
    setFormData({
      id: record.id,
      is_db_formed: record.is_db_formed,
      no_ill_wh_owner_apprehended: record.no_ill_wh_owner_apprehended,
      no_ill_wh_owner_convicted: record.no_ill_wh_owner_convicted,
      no_ill_wh_owner_setfreebycourt: record.no_ill_wh_owner_setfreebycourt,
      no_appr_ill_wh_owner_case_pending: record.no_appr_ill_wh_owner_case_pending,
      remarks: record.remarks,
    });
    setShowAddModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/delete-illegal-warehouses/${id}`);
      console.log('Delete illegal warehouses:', id);

      // TODO: Refresh the list after successful deletion
      // const recordsResponse = await publicApi.get('/get-all-illegal-warehouses');
      // Process and set records

      // Close modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting illegal warehouses record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete illegal warehouses record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = viewingId
    ? 'View Illegal Warehouses Record'
    : editingId
    ? 'Edit Illegal Warehouses Record'
    : 'Add Illegal Warehouses Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add Illegal Warehouses Record';

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
          record.no_ill_wh_owner_apprehended.toString().includes(searchLower)
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
          <h2 className="text-2xl font-bold text-foreground">Illegal Warehouses</h2>
          <p className="text-muted-foreground">Manage illegal warehouses records and owner statistics.</p>
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
            Add Illegal Warehouses Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Illegal Warehouses Overview</CardTitle>
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
                    onClick={() => handleSort('no_ill_wh_owner_apprehended')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Owners Apprehended
                    {getSortIcon('no_ill_wh_owner_apprehended')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ill_wh_owner_convicted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Owners Convicted
                    {getSortIcon('no_ill_wh_owner_convicted')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_appr_ill_wh_owner_case_pending')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Cases Pending
                    {getSortIcon('no_appr_ill_wh_owner_case_pending')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Loading illegal warehouses records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No illegal warehouses records found.'}
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
                    <TableCell>{record.no_ill_wh_owner_apprehended}</TableCell>
                    <TableCell>{record.no_ill_wh_owner_convicted}</TableCell>
                    <TableCell>{record.no_appr_ill_wh_owner_case_pending}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(record)}
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
                            setDeleteTargetName(`Illegal Warehouses Record ${record.id}`);
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
      <Tabs defaultValue="actions-taken" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="actions-taken">Actions Taken Against Illegal Warehouses</TabsTrigger>
        </TabsList>
        <TabsContent value="actions-taken" className="mt-4">
          <ActionsTakenAgainstIllegalWarehouses illegalWarehousesId={undefined} />
        </TabsContent>
      </Tabs>

      <IllegalWarehousesFormModal
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
        message={`Are you sure you want to delete "${deleteTargetName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Illegal Warehouses Record"
      />
    </div>
  );
};

export default IllegalWarehouses;

