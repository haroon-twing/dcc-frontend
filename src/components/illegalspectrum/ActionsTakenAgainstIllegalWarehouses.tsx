import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import ActionsTakenAgainstIllegalWarehousesFormModal from '../modals/illegalspectrum/ActionsTakenAgainstIllegalWarehousesFormModal';
import DeleteModal from '../UI/DeleteModal';

interface ActionsTakenAgainstIllegalWarehouses {
  _id?: string;
  id?: string;
  action_taken_by: string;
  date_of_action: string;
  type: string;
  location: string;
  main_products: string;
  affiliated_terr_grp: string;
  remarks: string;
}

interface ActionsTakenAgainstIllegalWarehousesProps {
  illegalWarehousesId?: string;
}

export interface ActionsTakenAgainstIllegalWarehousesFormState {
  id?: string;
  action_taken_by: string;
  date_of_action: string;
  type: string;
  location: string;
  main_products: string;
  affiliated_terr_grp: string;
  remarks: string;
}

const ActionsTakenAgainstIllegalWarehouses: React.FC<ActionsTakenAgainstIllegalWarehousesProps> = ({ illegalWarehousesId }) => {
  const [records, setRecords] = useState<ActionsTakenAgainstIllegalWarehouses[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ActionsTakenAgainstIllegalWarehouses | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ActionsTakenAgainstIllegalWarehouses | null>(null);
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
  
  const buildInitialForm = (): ActionsTakenAgainstIllegalWarehousesFormState => ({
    id: undefined,
    action_taken_by: '',
    date_of_action: '',
    type: '',
    location: '',
    main_products: '',
    affiliated_terr_grp: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<ActionsTakenAgainstIllegalWarehousesFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when available
      // const endpoint = illegalWarehousesId
      //   ? `/illegal-warehouses/get-all-actions-taken/${illegalWarehousesId}`
      //   : '/illegal-warehouses/get-all-actions-taken';
      // const response = await publicApi.get(endpoint);
      // const data = response.data?.data || response.data || [];
      
      // For now, using empty array
      const data: any[] = [];
      
      const records: ActionsTakenAgainstIllegalWarehouses[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        action_taken_by: item.action_taken_by || '',
        date_of_action: item.date_of_action || '',
        type: item.type || '',
        location: item.location || '',
        main_products: item.main_products || '',
        affiliated_terr_grp: item.affiliated_terr_grp || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching actions taken against illegal warehouses:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [illegalWarehousesId]);

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

  const handleView = async (record: ActionsTakenAgainstIllegalWarehouses) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }

    setViewingRecord(record);
    setEditingRecord(null);
    setIsViewMode(true);
    setFormData({
      id: recordId,
      action_taken_by: record.action_taken_by,
      date_of_action: formatDateForInput(record.date_of_action),
      type: record.type,
      location: record.location,
      main_products: record.main_products,
      affiliated_terr_grp: record.affiliated_terr_grp,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleEdit = (record: ActionsTakenAgainstIllegalWarehouses) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      action_taken_by: record.action_taken_by,
      date_of_action: formatDateForInput(record.date_of_action),
      type: record.type,
      location: record.location,
      main_products: record.main_products,
      affiliated_terr_grp: record.affiliated_terr_grp,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: ActionsTakenAgainstIllegalWarehouses) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(`${record.location} - ${formatDate(record.date_of_action)}`);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        action_taken_by: formData.action_taken_by,
        date_of_action: formData.date_of_action,
        type: formData.type,
        location: formData.location,
        main_products: formData.main_products,
        affiliated_terr_grp: formData.affiliated_terr_grp,
        remarks: formData.remarks,
        ...(illegalWarehousesId && { illegal_warehouses_id: illegalWarehousesId }),
      };

      if (editingRecord) {
        // TODO: Replace with actual API endpoint when available
        // await api.put(`/illegal-warehouses/update-action-taken/${formData.id}`, payload);
        console.log('Update action taken against illegal warehouse:', formData.id, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // await api.post('/illegal-warehouses/add-action-taken', payload);
        console.log('Add action taken against illegal warehouse:', payload);
      }

      await fetchRecords();
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting action taken against illegal warehouse:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} action taken against illegal warehouse. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/illegal-warehouses/delete-action-taken/${id}`);
      console.log('Delete action taken against illegal warehouse:', id);

      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (error: any) {
      console.error('Error deleting action taken against illegal warehouse:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete action taken against illegal warehouse. Please try again.'
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
          record.action_taken_by.toLowerCase().includes(searchLower) ||
          record.location.toLowerCase().includes(searchLower) ||
          record.type.toLowerCase().includes(searchLower) ||
          record.main_products.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (sortColumn === 'date_of_action') {
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
            <CardTitle>Actions Taken Against Illegal Warehouses</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Action Taken
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by action taken by, location, type..."
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
                    onClick={() => handleSort('action_taken_by')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Action Taken By
                    {getSortIcon('action_taken_by')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('date_of_action')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Date of Action
                    {getSortIcon('date_of_action')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Type
                    {getSortIcon('type')}
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
                    onClick={() => handleSort('main_products')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Main Products
                    {getSortIcon('main_products')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading actions taken against illegal warehouses...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No actions taken against illegal warehouses found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.action_taken_by || '-'}</TableCell>
                    <TableCell>{formatDate(record.date_of_action)}</TableCell>
                    <TableCell>{record.type || '-'}</TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                    <TableCell>{record.main_products || '-'}</TableCell>
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

      <ActionsTakenAgainstIllegalWarehousesFormModal
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
        title={isViewMode ? 'View Action Taken Against Illegal Warehouse' : editingRecord ? 'Edit Action Taken Against Illegal Warehouse' : 'Add Action Taken Against Illegal Warehouse'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Action Taken'}
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
        title="Delete Action Taken Against Illegal Warehouse"
      />
    </>
  );
};

export default ActionsTakenAgainstIllegalWarehouses;

