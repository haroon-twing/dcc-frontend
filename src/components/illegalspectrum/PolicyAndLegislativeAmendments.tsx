import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import PolicyAndLegislativeAmendmentFormModal from '../modals/illegalspectrum/PolicyAndLegislativeAmendmentFormModal';
import DeleteModal from '../UI/DeleteModal';

interface PolicyAndLegislativeAmendment {
  _id?: string;
  id?: string;
  name_executive_order: string;
  area_focus: string;
  location_affected: string;
  passed_by: string;
  passed_on: string;
  expires_on: string;
  remarks: string;
}

interface PolicyAndLegislativeAmendmentsProps {
  armsExplosivesUreaId?: string;
}

export interface PolicyAndLegislativeAmendmentFormState {
  id?: string;
  name_executive_order: string;
  area_focus: string;
  location_affected: string;
  passed_by: string;
  passed_on: string;
  expires_on: string;
  remarks: string;
}

const PolicyAndLegislativeAmendments: React.FC<PolicyAndLegislativeAmendmentsProps> = ({ armsExplosivesUreaId }) => {
  const [records, setRecords] = useState<PolicyAndLegislativeAmendment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<PolicyAndLegislativeAmendment | null>(null);
  const [viewingRecord, setViewingRecord] = useState<PolicyAndLegislativeAmendment | null>(null);
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
  
  const buildInitialForm = (): PolicyAndLegislativeAmendmentFormState => ({
    id: undefined,
    name_executive_order: '',
    area_focus: '',
    location_affected: '',
    passed_by: '',
    passed_on: '',
    expires_on: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<PolicyAndLegislativeAmendmentFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ispec-armsexpl-policy-legislative-ammend/get-all-ispec-armsexpl-policy-legislative-ammend');
      const data = response.data?.data || [];
      
      const records: PolicyAndLegislativeAmendment[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        name_executive_order: item.name_executive_order || '',
        area_focus: item.area_focus || '',
        location_affected: item.location_affected || '',
        passed_by: item.passed_by || '',
        passed_on: item.passed_on || '',
        expires_on: item.expires_on || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching policy and legislative amendments:', err);
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

  const handleView = (record: PolicyAndLegislativeAmendment) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }
    
    // Navigate to the full-page view
    navigate(`/illegal-spectrum/arms-explosives-urea/policy-legislative-amendments/view/${recordId}`);
  };

  const handleEdit = (record: PolicyAndLegislativeAmendment) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      name_executive_order: record.name_executive_order,
      area_focus: record.area_focus,
      location_affected: record.location_affected,
      passed_by: record.passed_by,
      passed_on: formatDateForInput(record.passed_on),
      expires_on: formatDateForInput(record.expires_on),
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: PolicyAndLegislativeAmendment) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(record.name_executive_order);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const payload = {
        name_executive_order: formData.name_executive_order,
        area_focus: formData.area_focus,
        location_affected: formData.location_affected,
        passed_by: formData.passed_by,
        passed_on: formData.passed_on,
        expires_on: formData.expires_on,
        remarks: formData.remarks,
      };
      
      if (formData.id) {
        // Update existing record
        await api.put(`/ispec-armsexpl-policy-legislative-ammend/update-ispec-armsexpl-policy-legislative-ammend/${formData.id}`, payload);
      } else {
        // Add new record
        await api.post('/ispec-armsexpl-policy-legislative-ammend/add-ispec-armsexpl-policy-legislative-ammend', payload);
      }
      
      // Refresh the records after successful submission
      await fetchRecords();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting policy and legislative amendment:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${formData.id ? 'update' : 'add'} policy and legislative amendment. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    if (!id) return;
    
    try {
      setDeleting(true);
      
      await api.delete(`/ispec-armsexpl-policy-legislative-ammend/delete-ispec-armsexpl-policy-legislative-ammend/${id}`);
      
      // Show success message
      // You might want to use a toast notification here
      console.log('Record deleted successfully');
      
      // Refresh the records after successful deletion
      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (err) {
      console.error('Error deleting record:', err);
      // You might want to show an error message to the user
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
          record.name_executive_order.toLowerCase().includes(searchLower) ||
          record.area_focus.toLowerCase().includes(searchLower) ||
          record.location_affected.toLowerCase().includes(searchLower) ||
          record.passed_by.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (sortColumn === 'passed_on' || sortColumn === 'expires_on') {
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
            <CardTitle>Policy and Legislative Amendments</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Policy and Legislative Amendment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, area focus, location..."
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
                    onClick={() => handleSort('name_executive_order')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Executive Order Name
                    {getSortIcon('name_executive_order')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('area_focus')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Area Focus
                    {getSortIcon('area_focus')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('location_affected')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Location Affected
                    {getSortIcon('location_affected')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('passed_by')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Passed By
                    {getSortIcon('passed_by')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('passed_on')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Passed On
                    {getSortIcon('passed_on')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading policy and legislative amendments...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No policy and legislative amendments found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.name_executive_order}</TableCell>
                    <TableCell>{record.area_focus || '-'}</TableCell>
                    <TableCell>{record.location_affected || '-'}</TableCell>
                    <TableCell>{record.passed_by || '-'}</TableCell>
                    <TableCell>{formatDate(record.passed_on)}</TableCell>
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

      <PolicyAndLegislativeAmendmentFormModal
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
        title={isViewMode ? 'View Policy and Legislative Amendment' : editingRecord ? 'Edit Policy and Legislative Amendment' : 'Add Policy and Legislative Amendment'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Policy and Legislative Amendment'}
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
        title="Delete Policy and Legislative Amendment"
      />
    </>
  );
};

export default PolicyAndLegislativeAmendments;

