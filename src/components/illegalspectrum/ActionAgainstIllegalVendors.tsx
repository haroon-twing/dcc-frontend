import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Pencil, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import ActionAgainstIllegalVendorFormModal from '../modals/illegalspectrum/ActionAgainstIllegalVendorFormModal';
import DeleteModal from '../UI/DeleteModal';

interface ActionAgainstIllegalVendor {
  _id?: string;
  id?: string;
  lea: string;
  ill_vend_apprehended: number;
  ill_vend_fined: number;
  remarks: string;
}

interface ActionAgainstIllegalVendorsProps {
  blackMarketDronesId?: string;
}

export interface ActionAgainstIllegalVendorFormState {
  id?: string;
  lea: string;
  ill_vend_apprehended: number;
  ill_vend_fined: number;
  remarks: string;
}

const ActionAgainstIllegalVendors: React.FC<ActionAgainstIllegalVendorsProps> = ({ blackMarketDronesId }) => {
  const [records, setRecords] = useState<ActionAgainstIllegalVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ActionAgainstIllegalVendor | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ActionAgainstIllegalVendor | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const buildInitialForm = (): ActionAgainstIllegalVendorFormState => ({
    id: undefined,
    lea: '',
    ill_vend_apprehended: 0,
    ill_vend_fined: 0,
    remarks: '',
  });

  const [formData, setFormData] = useState<ActionAgainstIllegalVendorFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ispec-blackmarket-action-illegal-vendors/get-all-ispec-blackmarket-action-illegal-vendors');
      const data = response.data?.data || response.data || [];
      
      const records: ActionAgainstIllegalVendor[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        lea: item.lea || '',
        ill_vend_apprehended: item.ill_vend_apprehended || 0,
        ill_vend_fined: item.ill_vend_fined || 0,
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching actions against illegal vendors:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [blackMarketDronesId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = (record: ActionAgainstIllegalVendor) => {
    const recordId = record._id || record.id;
    if (recordId) {
      navigate(`/illegal-spectrum/action-against-illegal-vendors/details?id=${recordId}`);
    } else {
      console.error('No record ID found for viewing');
      // Fallback to modal if no ID is available
      setViewingRecord(record);
      setEditingRecord(null);
      setIsViewMode(true);
      setFormData({
        id: recordId,
        lea: record.lea,
        ill_vend_apprehended: record.ill_vend_apprehended,
        ill_vend_fined: record.ill_vend_fined,
        remarks: record.remarks,
      });
      setShowModal(true);
    }
  };

  const handleEdit = (record: ActionAgainstIllegalVendor) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      lea: record.lea,
      ill_vend_apprehended: record.ill_vend_apprehended,
      ill_vend_fined: record.ill_vend_fined,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: ActionAgainstIllegalVendor) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(`${record.lea} - ${record.ill_vend_apprehended} apprehended`);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      
      const payload = {
        lea: formData.lea,
        ill_vend_apprehended: formData.ill_vend_apprehended,
        ill_vend_fined: formData.ill_vend_fined,
        remarks: formData.remarks,
      };
      
      console.log('Submitting form with data:', { editingRecord, payload });
      
      if (editingRecord && editingRecord.id) {
        // Update existing record
        console.log('Updating record with ID:', editingRecord.id);
        try {
          const response = await api.put(
            `/ispec-blackmarket-action-illegal-vendors/update-ispec-blackmarket-action-illegal-vendors/${editingRecord.id}`, 
            payload
          );
          console.log('Update API response:', response.data);
        } catch (updateError) {
          console.error('Update API error:', updateError);
          throw updateError;
        }
      } else {
        // Create new record
        console.log('Creating new record');
        try {
          const response = await api.post(
            '/ispec-blackmarket-action-illegal-vendors/add-ispec-blackmarket-action-illegal-vendors', 
            payload
          );
          console.log('Create API response:', response.data);
        } catch (createError) {
          console.error('Create API error:', createError);
          throw createError;
        }
      }
      
      // Refresh the data after successful operation
      await fetchRecords();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Error in handleSubmit:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data,
        },
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to save record. Please check the console for more details.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!recordToDeleteId || deleting) return;
    
    try {
      setDeleting(true);
      
      await api.delete(`/ispec-blackmarket-action-illegal-vendors/delete-ispec-blackmarket-action-illegal-vendors/${recordToDeleteId}`);
      
      // Refresh the data after successful deletion
      await fetchRecords();
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (err: any) {
      console.error('Error deleting action against illegal vendor:', err);
      alert(err?.response?.data?.message || 'Failed to delete record. Please try again.');
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
          record.lea.toLowerCase().includes(searchLower) ||
          record.ill_vend_apprehended.toString().includes(searchLower) ||
          record.ill_vend_fined.toString().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (typeof aValue === 'number') {
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
            <CardTitle>Action Against Illegal Vendors</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Action Against Illegal Vendor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by LEA, apprehended, fined..."
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
                    onClick={() => handleSort('lea')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    LEA
                    {getSortIcon('lea')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('ill_vend_apprehended')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Illegal Vendors Apprehended
                    {getSortIcon('ill_vend_apprehended')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('ill_vend_fined')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Illegal Vendors Fined
                    {getSortIcon('ill_vend_fined')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                    Loading actions against illegal vendors...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No actions against illegal vendors found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.lea}</TableCell>
                    <TableCell>{record.ill_vend_apprehended}</TableCell>
                    <TableCell>{record.ill_vend_fined}</TableCell>
                    <TableCell>
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

      <ActionAgainstIllegalVendorFormModal
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
        title={isViewMode ? 'View Action Against Illegal Vendor' : editingRecord ? 'Edit Action Against Illegal Vendor' : 'Add Action Against Illegal Vendor'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Action Against Illegal Vendor'}
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
        title="Delete Action Against Illegal Vendor"
      />
    </>
  );
};

export default ActionAgainstIllegalVendors;

