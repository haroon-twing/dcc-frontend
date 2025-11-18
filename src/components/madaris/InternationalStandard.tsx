import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Globe, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import InternationalStandardFormModal from '../modals/madaris/InternationalStandardFormModal';

interface InternationalStandard {
  _id?: string;
  id?: string;
  authority_qualifies: string;
  date_of_acceptance: string;
  remarks?: string;
  madaris_id: string;
}

interface InternationalStandardFormState {
  authority_qualifies: string;
  date_of_acceptance: string;
  remarks: string;
}

interface InternationalStandardProps {
  madarisId: string;
}

const InternationalStandard: React.FC<InternationalStandardProps> = ({ madarisId }) => {
  const [standards, setStandards] = useState<InternationalStandard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<InternationalStandard | null>(null);
  const [viewingStandard, setViewingStandard] = useState<InternationalStandard | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingStandard, setLoadingStandard] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [standardToDeleteId, setStandardToDeleteId] = useState<string | number | undefined>(undefined);
  const [standardToDeleteName, setStandardToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<InternationalStandardFormState>({
    authority_qualifies: '',
    date_of_acceptance: '',
    remarks: '',
  });

  const buildInitialForm = (): InternationalStandardFormState => ({
    authority_qualifies: '',
    date_of_acceptance: '',
    remarks: '',
  });

  const fetchStandards = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setStandards([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-international-standards/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const standardsData: InternationalStandard[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        madaris_id: item.madaris_id || madarisId,
        authority_qualifies: item.authority_qualifies || '',
        date_of_acceptance: item.date_of_acceptance || '',
        remarks: item.remarks || '',
      }));

      setStandards(standardsData);
    } catch (err: any) {
      console.error('Error fetching international standards:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load international standards. Please try again.'
      );
      setStandards([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId]);

  useEffect(() => {
    if (madarisId) {
      fetchStandards();
    }
  }, [madarisId, fetchStandards]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingStandard(null);
    setViewingStandard(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (standard: InternationalStandard) => {
    const standardId = standard._id || standard.id;
    if (!standardId) {
      alert('Standard ID is missing. Cannot load standard details.');
      return;
    }

    setLoadingStandard(true);
    setViewingStandard(standard);
    setEditingStandard(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/madaris/get-single-international-standard/${standardId}`;
      const response = await publicApi.get(viewEndpoint);
      const standardData = response.data?.data || response.data;

      setFormData({
        authority_qualifies: standardData.authority_qualifies || '',
        date_of_acceptance: standardData.date_of_acceptance || '',
        remarks: standardData.remarks || '',
      });

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching international standard details:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load international standard details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        authority_qualifies: standard.authority_qualifies || '',
        date_of_acceptance: standard.date_of_acceptance || '',
        remarks: standard.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingStandard(false);
    }
  };

  const handleEdit = (standard: InternationalStandard) => {
    setFormData({
      authority_qualifies: standard.authority_qualifies || '',
      date_of_acceptance: standard.date_of_acceptance || '',
      remarks: standard.remarks || '',
    });
    setEditingStandard(standard);
    setViewingStandard(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (standard: InternationalStandard) => {
    const standardId = standard._id || standard.id;
    if (standardId) {
      setStandardToDeleteId(standardId);
      const displayName = standard.authority_qualifies || 'this international standard';
      setStandardToDeleteName(displayName);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-international-standard/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setStandardToDeleteId(undefined);
      setStandardToDeleteName('');
      await fetchStandards();
    } catch (error: any) {
      console.error('Error deleting international standard:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete international standard. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        authority_qualifies: formData.authority_qualifies,
        date_of_acceptance: formData.date_of_acceptance,
        remarks: formData.remarks || '',
        madaris_id: madarisId,
      };

      if (editingStandard) {
        const standardId = editingStandard._id || editingStandard.id;
        if (!standardId) {
          throw new Error('Standard ID is required for update');
        }
        const updateEndpoint = `/madaris/update-international-standard/${standardId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-international-standard';
        await api.post(addEndpoint, payload);
      }

      await fetchStandards();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingStandard(null);
      setViewingStandard(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving international standard:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingStandard ? 'update' : 'add'} international standard. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedStandards = useMemo(() => {
    let filtered = standards;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = standards.filter((standard) => {
        return (
          (standard.authority_qualifies || '').toLowerCase().includes(searchLower) ||
          formatDate(standard.date_of_acceptance).toLowerCase().includes(searchLower) ||
          (standard.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'authority_qualifies':
            aValue = (a.authority_qualifies || '').toLowerCase();
            bValue = (b.authority_qualifies || '').toLowerCase();
            break;
          case 'date_of_acceptance':
            aValue = new Date(a.date_of_acceptance || 0).getTime();
            bValue = new Date(b.date_of_acceptance || 0).getTime();
            break;
          case 'remarks':
            aValue = (a.remarks || '').toLowerCase();
            bValue = (b.remarks || '').toLowerCase();
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
  }, [standards, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedStandards = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedStandards.slice(startIndex, endIndex);
  }, [filteredAndSortedStandards, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedStandards.length / itemsPerPage);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                International Standard
              </CardTitle>
              <CardDescription>International standards and certifications</CardDescription>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add International Standard
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search international standards..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading international standards...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStandards()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedStandards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No international standards found matching your search.' : 'No international standards found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('authority_qualifies')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Authority Qualifies {getSortIcon('authority_qualifies')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('date_of_acceptance')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Date of Acceptance {getSortIcon('date_of_acceptance')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('remarks')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Remarks {getSortIcon('remarks')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStandards.map((standard) => (
                  <TableRow key={standard._id || standard.id}>
                    <TableCell className="font-medium">{standard.authority_qualifies || 'N/A'}</TableCell>
                    <TableCell>{formatDate(standard.date_of_acceptance)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={standard.remarks}>
                      {standard.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(standard)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(standard)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(standard)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredAndSortedStandards.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedStandards.length)} of {filteredAndSortedStandards.length} entries
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

      {/* International Standard Form Modal */}
      <InternationalStandardFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!submitting) {
            setShowModal(open);
            if (!open) {
              setFormData(buildInitialForm());
              setEditingStandard(null);
              setViewingStandard(null);
              setIsViewMode(false);
            }
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View International Standard' : editingStandard ? 'Edit International Standard' : 'Add International Standard'}
        submitLabel={editingStandard ? 'Save Changes' : 'Add International Standard'}
        submitting={submitting || loadingStandard}
        madarisId={madarisId}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={standardToDeleteId}
        message={`Are you sure you want to delete international standard "${standardToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete International Standard"
      />
    </Card>
  );
};

export default InternationalStandard;
