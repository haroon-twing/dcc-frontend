import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { DollarSign, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import FundingSourceFormModal from '../modals/madaris/FundingSourceFormModal';

interface FundingSource {
  _id?: string;
  id?: string;
  source_name: string;
  source_type: string;
  funding_purpose: string;
  madaris_id: string;
  remarks: string;
}

interface FundingSourceFormState {
  source_name: string;
  source_type: string;
  funding_purpose: string;
  remarks: string;
}

interface FundingSourceProps {
  madarisId: string;
}

const FundingSource: React.FC<FundingSourceProps> = ({ madarisId }) => {
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFundingSource, setEditingFundingSource] = useState<FundingSource | null>(null);
  const [viewingFundingSource, setViewingFundingSource] = useState<FundingSource | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingFundingSource, setLoadingFundingSource] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [fundingSourceToDeleteId, setFundingSourceToDeleteId] = useState<string | number | undefined>(undefined);
  const [fundingSourceToDeleteName, setFundingSourceToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<FundingSourceFormState>({
    source_name: '',
    source_type: '',
    funding_purpose: '',
    remarks: '',
  });

  const buildInitialForm = (): FundingSourceFormState => ({
    source_name: '',
    source_type: '',
    funding_purpose: '',
    remarks: '',
  });

  const fetchFundingSources = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setFundingSources([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-funding-sources-against-madrasa/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const fundingSourcesData: FundingSource[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        source_name: item.source_name || 'N/A',
        source_type: item.source_type || 'N/A',
        funding_purpose: item.funding_purpose || 'N/A',
        madaris_id: item.madaris_id || madarisId,
        remarks: item.remarks || '',
      }));
      
      setFundingSources(fundingSourcesData);
    } catch (err: any) {
      console.error('Error fetching funding sources:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load funding sources');
      setFundingSources([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId]);

  useEffect(() => {
    fetchFundingSources();
  }, [fetchFundingSources]);

  const handleView = async (fundingSource: FundingSource) => {
    const fundingSourceId = fundingSource._id || fundingSource.id;
    if (!fundingSourceId) {
      alert('Funding Source ID is missing. Cannot load funding source details.');
      return;
    }

    setLoadingFundingSource(true);
    setViewingFundingSource(fundingSource);
    setEditingFundingSource(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-funding-source/${fundingSourceId}`;
      const response = await publicApi.get(viewEndpoint);
      const fundingSourceData = response.data?.data || response.data || fundingSource;

      setFormData({
        source_name: fundingSourceData.source_name || '',
        source_type: fundingSourceData.source_type || '',
        funding_purpose: fundingSourceData.funding_purpose || '',
        remarks: fundingSourceData.remarks || '',
      });
      
      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching funding source details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load funding source details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        source_name: fundingSource.source_name || '',
        source_type: fundingSource.source_type || '',
        funding_purpose: fundingSource.funding_purpose || '',
        remarks: fundingSource.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingFundingSource(false);
    }
  };

  const handleEdit = (fundingSource: FundingSource) => {
    setEditingFundingSource(fundingSource);
    setViewingFundingSource(null);
    setIsViewMode(false);
    setFormData({
      source_name: fundingSource.source_name || '',
      source_type: fundingSource.source_type || '',
      funding_purpose: fundingSource.funding_purpose || '',
      remarks: fundingSource.remarks || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingFundingSource(null);
    setViewingFundingSource(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowModal(true);
  };

  const handleDelete = (fundingSource: FundingSource) => {
    const fundingSourceId = fundingSource._id || fundingSource.id;
    const fundingSourceName = fundingSource.source_name || 'this funding source';
    if (fundingSourceId) {
      setFundingSourceToDeleteId(fundingSourceId);
      setFundingSourceToDeleteName(fundingSourceName);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-funding-source/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setFundingSourceToDeleteId(undefined);
      setFundingSourceToDeleteName('');
      await fetchFundingSources();
    } catch (error: any) {
      console.error('Error deleting funding source:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete funding source. Please try again.'
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
        source_name: formData.source_name,
        source_type: formData.source_type,
        funding_purpose: formData.funding_purpose,
        madaris_id: madarisId,
        remarks: formData.remarks,
      };

      if (editingFundingSource) {
        const fundingSourceId = editingFundingSource._id || editingFundingSource.id;
        if (!fundingSourceId) {
          throw new Error('Funding Source ID is required for update');
        }
        const updateEndpoint = `/madaris/update-funding-source/${fundingSourceId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-funding-source';
        await api.post(addEndpoint, payload);
      }

      await fetchFundingSources();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingFundingSource(null);
      setViewingFundingSource(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving funding source:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingFundingSource ? 'update' : 'add'} funding source. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedFundingSources = useMemo(() => {
    let filtered = fundingSources;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = fundingSources.filter((fundingSource) => {
        return (
          (fundingSource.source_name || '').toLowerCase().includes(searchLower) ||
          (fundingSource.source_type || '').toLowerCase().includes(searchLower) ||
          (fundingSource.funding_purpose || '').toLowerCase().includes(searchLower) ||
          (fundingSource.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'source_name':
            aValue = (a.source_name || '').toLowerCase();
            bValue = (b.source_name || '').toLowerCase();
            break;
          case 'source_type':
            aValue = (a.source_type || '').toLowerCase();
            bValue = (b.source_type || '').toLowerCase();
            break;
          case 'funding_purpose':
            aValue = (a.funding_purpose || '').toLowerCase();
            bValue = (b.funding_purpose || '').toLowerCase();
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
  }, [fundingSources, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedFundingSources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedFundingSources.slice(startIndex, endIndex);
  }, [filteredAndSortedFundingSources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedFundingSources.length / itemsPerPage);

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
            <DollarSign className="h-5 w-5" />
            Funding Source
          </CardTitle>
          <CardDescription>List of funding sources for this institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading funding sources...</p>
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
            <DollarSign className="h-5 w-5" />
            Funding Source
          </CardTitle>
          <CardDescription>List of funding sources for this institution</CardDescription>
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
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Funding Source
                </CardTitle>
                <CardDescription>List of funding sources for this institution</CardDescription>
              </div>
              <Button
                onClick={handleAdd}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Funding Source
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search funding sources..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        {filteredAndSortedFundingSources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No funding sources found matching your search.' : 'No funding sources found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('source_name')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Source Name {getSortIcon('source_name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('source_type')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Source Type {getSortIcon('source_type')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('funding_purpose')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Funding Purpose {getSortIcon('funding_purpose')}
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
                {paginatedFundingSources.map((fundingSource) => (
                  <TableRow key={fundingSource._id || fundingSource.id}>
                    <TableCell className="font-medium">{fundingSource.source_name || 'N/A'}</TableCell>
                    <TableCell>{fundingSource.source_type || 'N/A'}</TableCell>
                    <TableCell>{fundingSource.funding_purpose || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={fundingSource.remarks}>
                      {fundingSource.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(fundingSource)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(fundingSource)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(fundingSource)}
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
        {filteredAndSortedFundingSources.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedFundingSources.length)} of {filteredAndSortedFundingSources.length} entries
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
    </Card>

    <FundingSourceFormModal
      open={showModal}
      onOpenChange={(open) => {
        if (!open && !submitting && !loadingFundingSource) {
          setShowModal(false);
          setFormData(buildInitialForm());
          setEditingFundingSource(null);
          setViewingFundingSource(null);
          setIsViewMode(false);
        }
      }}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      title={isViewMode ? 'View Funding Source Details' : editingFundingSource ? 'Edit Funding Source' : 'Add Funding Source'}
      submitLabel={editingFundingSource ? 'Save Changes' : 'Add Funding Source'}
      submitting={submitting || loadingFundingSource}
      viewMode={isViewMode}
    />

    <DeleteModal
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      id={fundingSourceToDeleteId}
      message={`Are you sure you want to delete funding source "${fundingSourceToDeleteName}"? This action cannot be undone.`}
      onSubmit={handleDeleteSubmit}
      deleting={deleting}
      title="Delete Funding Source"
    />
    </>
  );
};

export default FundingSource;

