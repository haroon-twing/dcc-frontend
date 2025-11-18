import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { CheckCircle, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import VerifiedCaseFormModal from '../modals/ngo/VerifiedCaseFormModal';

interface VerifiedCase {
  _id?: string;
  id?: string;
  ngo_id: string;
  recomm_by?: string;
  recomm_date?: string;
  action_taken?: string;
  remarks?: string;
  case_reference?: string;
  status?: string;
}

interface VerifiedCaseFormState {
  recomm_by: string;
  recomm_date: string;
  action_taken: string;
  remarks: string;
  case_reference: string;
  status: string;
}

interface VerifiedCasesProps {
  ngoId: string;
}

const VerifiedCases: React.FC<VerifiedCasesProps> = ({ ngoId }) => {
  const [cases, setCases] = useState<VerifiedCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<VerifiedCase | null>(null);
  const [viewingCase, setViewingCase] = useState<VerifiedCase | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCase, setLoadingCase] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [caseToDeleteId, setCaseToDeleteId] = useState<string | number | undefined>(undefined);
  const [caseToDeleteName, setCaseToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<VerifiedCaseFormState>({
    recomm_by: '',
    recomm_date: '',
    action_taken: '',
    remarks: '',
    case_reference: '',
    status: '',
  });

  const buildInitialForm = (): VerifiedCaseFormState => ({
    recomm_by: '',
    recomm_date: '',
    action_taken: '',
    remarks: '',
    case_reference: '',
    status: '',
  });

  const fetchCases = useCallback(async () => {
    if (!ngoId) {
      setLoading(false);
      setCases([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/ngo/get-ngo-verif-cases-recomm-moi/${ngoId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const casesData: VerifiedCase[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        ngo_id: item.ngo_id || ngoId,
        recomm_by: item.recomm_by || '',
        recomm_date: item.recomm_date || '',
        action_taken: item.action_taken || '',
        remarks: item.remarks || '',
        case_reference: item.case_reference || '',
        status: item.status || '',
      }));
      
      setCases(casesData);
    } catch (err: any) {
      console.error('Error fetching verified cases:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load verified cases. Please try again.'
      );
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [ngoId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingCase(null);
    setViewingCase(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (caseItem: VerifiedCase) => {
    const caseId = caseItem._id || caseItem.id;
    if (!caseId) {
      window.alert('Case ID is missing. Cannot load case details.');
      return;
    }

    setLoadingCase(true);
    setViewingCase(caseItem);
    setEditingCase(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/ngo/get-single-ngo-verif-cases-recomm-moi/${caseId}`;
      const response = await publicApi.get(viewEndpoint);
      const caseData: VerifiedCase = response.data?.data || response.data;

      if (caseData) {
        setFormData({
          recomm_by: caseData.recomm_by || '',
          recomm_date: caseData.recomm_date || '',
          action_taken: caseData.action_taken || '',
          remarks: caseData.remarks || '',
          case_reference: caseData.case_reference || '',
          status: caseData.status || '',
        });
      } else {
        // Fallback to case data from table if API doesn't return data
        setFormData({
          recomm_by: caseItem.recomm_by || '',
          recomm_date: caseItem.recomm_date || '',
          action_taken: caseItem.action_taken || '',
          remarks: caseItem.remarks || '',
          case_reference: caseItem.case_reference || '',
          status: caseItem.status || '',
        });
      }

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching case details:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load case details. Please try again.'
      );
      setFormData({
        recomm_by: caseItem.recomm_by || '',
        recomm_date: caseItem.recomm_date || '',
        action_taken: caseItem.action_taken || '',
        remarks: caseItem.remarks || '',
        case_reference: caseItem.case_reference || '',
        status: caseItem.status || '',
      });
      setShowModal(true);
    } finally {
      setLoadingCase(false);
    }
  };

  const handleEdit = (caseItem: VerifiedCase) => {
    setFormData({
      recomm_by: caseItem.recomm_by || '',
      recomm_date: caseItem.recomm_date || '',
      action_taken: caseItem.action_taken || '',
      remarks: caseItem.remarks || '',
      case_reference: caseItem.case_reference || '',
      status: caseItem.status || '',
    });
    setEditingCase(caseItem);
    setViewingCase(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (caseItem: VerifiedCase) => {
    const caseId = caseItem._id || caseItem.id;
    if (caseId) {
      setCaseToDeleteId(caseId);
      setCaseToDeleteName(caseItem.case_reference || 'this verified case');
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/api/ngo/delete-ngo-verif-cases-recomm-moi/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setCaseToDeleteId(undefined);
      setCaseToDeleteName('');
      await fetchCases();
    } catch (error: any) {
      console.error('Error deleting verified case:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete verified case. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Format recomm_date to YYYY-MM-DD format (remove time component)
      const formattedDate = formData.recomm_date 
        ? formData.recomm_date.split('T')[0] 
        : '';

      const payload = {
        recomm_by: formData.recomm_by,
        recomm_date: formattedDate,
        action_taken: formData.action_taken,
        remarks: formData.remarks || '',
        case_reference: formData.case_reference,
        status: formData.status,
        ngo_id: ngoId,
      };

      if (editingCase) {
        const caseId = editingCase._id || editingCase.id;
        if (!caseId) {
          throw new Error('Case ID is required for update');
        }
        const updateEndpoint = `/ngo/update-ngo-verif-cases-recomm-moi/${caseId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ngo/add-ngo-verif-cases-recomm-moi';
        await api.post(addEndpoint, payload);
      }

      // Refetch data after add/edit
      await fetchCases();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingCase(null);
      setViewingCase(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving verified case:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingCase ? 'update' : 'add'} verified case. Please try again.`
      );
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Filter and sort data
  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = cases.filter((caseItem) => {
        return (
          (caseItem.case_reference || '').toLowerCase().includes(searchLower) ||
          (caseItem.recomm_by || '').toLowerCase().includes(searchLower) ||
          (caseItem.action_taken || '').toLowerCase().includes(searchLower) ||
          (caseItem.status || '').toLowerCase().includes(searchLower) ||
          (caseItem.remarks || '').toLowerCase().includes(searchLower) ||
          formatDate(caseItem.recomm_date || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'recomm_date':
            aValue = new Date(a.recomm_date || 0).getTime();
            bValue = new Date(b.recomm_date || 0).getTime();
            break;
          case 'case_reference':
            aValue = (a.case_reference || '').toLowerCase();
            bValue = (b.case_reference || '').toLowerCase();
            break;
          case 'recomm_by':
            aValue = (a.recomm_by || '').toLowerCase();
            bValue = (b.recomm_by || '').toLowerCase();
            break;
          case 'status':
            aValue = (a.status || '').toLowerCase();
            bValue = (b.status || '').toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [cases, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedCases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCases.slice(startIndex, endIndex);
  }, [filteredAndSortedCases, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCases.length / itemsPerPage);

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

  // Reset search and filters
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Verified Cases
          </CardTitle>
          <CardDescription>Verified case records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading verified cases...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Verified Cases
          </CardTitle>
          <CardDescription>Verified case records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Verified Cases
              </CardTitle>
              <CardDescription>Verified case records for this NGO</CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Add Verified Case
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search verified cases..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('case_reference')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Case Reference {getSortIcon('case_reference')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('recomm_by')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Recommended By {getSortIcon('recomm_by')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('recomm_date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Recommendation Date {getSortIcon('recomm_date')}
                  </button>
                </TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Status {getSortIcon('status')}
                  </button>
                </TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No verified cases found matching your search.' : 'No verified cases found for this NGO.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCases.map((caseItem) => (
                  <TableRow key={caseItem._id || caseItem.id}>
                    <TableCell className="font-medium">{caseItem.case_reference || 'N/A'}</TableCell>
                    <TableCell>{caseItem.recomm_by || 'N/A'}</TableCell>
                    <TableCell>{formatDate(caseItem.recomm_date || '')}</TableCell>
                    <TableCell className="max-w-xs truncate" title={caseItem.action_taken}>
                      {caseItem.action_taken || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        caseItem.status === 'Completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : caseItem.status === 'Pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : caseItem.status === 'In Progress'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                      }`}>
                        {caseItem.status || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={caseItem.remarks}>
                      {caseItem.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(caseItem)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(caseItem)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(caseItem)}
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
        </div>
        
        {/* Pagination */}
        {filteredAndSortedCases.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCases.length)} of {filteredAndSortedCases.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                        variant={currentPage === page ? "default" : "outline"}
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
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Form Modal */}
      <VerifiedCaseFormModal
        open={showModal}
        onOpenChange={setShowModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Verified Case' : editingCase ? 'Edit Verified Case' : 'Add Verified Case'}
        submitLabel={editingCase ? 'Update' : 'Save'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={caseToDeleteId}
        message={`Are you sure you want to delete "${caseToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
      />
    </Card>
  );
};

export default VerifiedCases;


