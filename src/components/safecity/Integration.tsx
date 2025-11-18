import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Link, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import IntegrationFormModal from '../modals/safecity/IntegrationFormModal';
import DeleteModal from '../UI/DeleteModal';

interface Integration {
  _id?: string;
  id?: string;
  integ_with_dcc: boolean;
  integ_with_piftac: boolean;
  integ_with_niftac: boolean;
  sc_id: string;
  remarks?: string;
}

interface IntegrationFormState {
  integ_with_dcc: boolean;
  integ_with_piftac: boolean;
  integ_with_niftac: boolean;
  remarks: string;
}

interface IntegrationProps {
  safeCityId: string;
}

const Integration: React.FC<IntegrationProps> = ({ safeCityId }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [viewingIntegration, setViewingIntegration] = useState<Integration | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingIntegration, setLoadingIntegration] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [integrationToDeleteId, setIntegrationToDeleteId] = useState<string | number | undefined>(undefined);
  const [integrationToDeleteName, setIntegrationToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const buildInitialForm = (): IntegrationFormState => ({
    integ_with_dcc: false,
    integ_with_piftac: false,
    integ_with_niftac: false,
    remarks: '',
  });

  const [formData, setFormData] = useState<IntegrationFormState>(buildInitialForm());

  const fetchIntegrations = async () => {
    if (!safeCityId) {
      setLoading(false);
      setIntegrations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/safecity/get-safecityintegrations/${safeCityId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const integrationsData: Integration[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        integ_with_dcc: item.integ_with_dcc || false,
        integ_with_piftac: item.integ_with_piftac || false,
        integ_with_niftac: item.integ_with_niftac || false,
        sc_id: item.sc_id || safeCityId,
        remarks: item.remarks || '',
      }));
      
      setIntegrations(integrationsData);
    } catch (err: any) {
      console.error('Error fetching integrations:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load integrations. Please try again.'
      );
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [safeCityId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingIntegration(null);
    setViewingIntegration(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEdit = async (integration: Integration) => {
    const integrationId = integration._id || integration.id;
    if (!integrationId) {
      alert('Integration ID is missing. Cannot load integration details.');
      return;
    }

    setLoadingIntegration(true);
    setViewingIntegration(null);
    setEditingIntegration(integration);
    setIsViewMode(false);
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const editEndpoint = `/safecity/get-single-integration/${integrationId}`;
      // const response = await publicApi.get(editEndpoint);
      // const integrationData = response.data?.data || response.data;
      
      // For now, use the integration data directly
      const integrationData = integration;
      
      setFormData({
        integ_with_dcc: integrationData.integ_with_dcc || false,
        integ_with_piftac: integrationData.integ_with_piftac || false,
        integ_with_niftac: integrationData.integ_with_niftac || false,
        remarks: integrationData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading integration for edit:', err);
      alert('Failed to load integration data. Please try again.');
    } finally {
      setLoadingIntegration(false);
    }
  };

  const handleView = async (integration: Integration) => {
    const integrationId = integration._id || integration.id;
    if (!integrationId) {
      alert('Integration ID is missing. Cannot load integration details.');
      return;
    }

    setLoadingIntegration(true);
    setEditingIntegration(null);
    setViewingIntegration(integration);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/safecity/get-single-safecityintegration/${integrationId}`;
      const response = await publicApi.get(viewEndpoint);
      const integrationData = response.data?.data || response.data;
      
      setFormData({
        integ_with_dcc: integrationData.integ_with_dcc || false,
        integ_with_piftac: integrationData.integ_with_piftac || false,
        integ_with_niftac: integrationData.integ_with_niftac || false,
        remarks: integrationData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading integration for view:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to load integration data. Please try again.');
    } finally {
      setLoadingIntegration(false);
    }
  };

  const handleDelete = (integration: Integration) => {
    const integrationId = integration._id || integration.id;
    if (!integrationId) {
      alert('Integration ID is missing. Cannot delete integration.');
      return;
    }
    
    setIntegrationToDeleteId(integrationId);
    setIntegrationToDeleteName(`Integration (DCC: ${integration.integ_with_dcc ? 'Yes' : 'No'}, PIFTAC: ${integration.integ_with_piftac ? 'Yes' : 'No'}, NIFTAC: ${integration.integ_with_niftac ? 'Yes' : 'No'})`);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (id: string | number) => {
    if (!id) return;

    try {
      setDeleting(true);
      const deleteEndpoint = `/safecity/delete-safecityintegration/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setIntegrationToDeleteId(undefined);
      setIntegrationToDeleteName('');
      
      // Refresh the list
      await fetchIntegrations();
    } catch (err: any) {
      console.error('Error deleting integration:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to delete integration. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: IntegrationFormState) => {
    try {
      setSubmitting(true);
      
      const payload = {
        integ_with_dcc: data.integ_with_dcc,
        integ_with_piftac: data.integ_with_piftac,
        integ_with_niftac: data.integ_with_niftac,
        sc_id: safeCityId,
        remarks: data.remarks || '',
      };

      if (editingIntegration) {
        const integrationId = editingIntegration._id || editingIntegration.id;
        if (!integrationId) {
          alert('Integration ID is missing. Cannot update integration.');
          return;
        }
        
        const updateEndpoint = `/safecity/update-safecityintegration/${integrationId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = `/safecity/add-safecityintegration`;
        await api.post(addEndpoint, payload);
      }
      
      setShowModal(false);
      setEditingIntegration(null);
      setViewingIntegration(null);
      setIsViewMode(false);
      setFormData(buildInitialForm());
      
      // Refresh the list
      await fetchIntegrations();
    } catch (err: any) {
      console.error('Error submitting integration:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to save integration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedIntegrations = useMemo(() => {
    let filtered = integrations;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = integrations.filter((integration) => {
        return (
          (integration.integ_with_dcc ? 'yes' : 'no').includes(searchLower) ||
          (integration.integ_with_piftac ? 'yes' : 'no').includes(searchLower) ||
          (integration.integ_with_niftac ? 'yes' : 'no').includes(searchLower) ||
          (integration.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'integ_with_dcc':
            aValue = a.integ_with_dcc ? 1 : 0;
            bValue = b.integ_with_dcc ? 1 : 0;
            break;
          case 'integ_with_piftac':
            aValue = a.integ_with_piftac ? 1 : 0;
            bValue = b.integ_with_piftac ? 1 : 0;
            break;
          case 'integ_with_niftac':
            aValue = a.integ_with_niftac ? 1 : 0;
            bValue = b.integ_with_niftac ? 1 : 0;
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
  }, [integrations, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedIntegrations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedIntegrations.slice(startIndex, endIndex);
  }, [filteredAndSortedIntegrations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedIntegrations.length / itemsPerPage);

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
            <Link className="h-5 w-5" />
            Integration
          </CardTitle>
          <CardDescription>System integrations for this Safe City project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading integrations...</p>
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
            <Link className="h-5 w-5" />
            Integration
          </CardTitle>
          <CardDescription>System integrations for this Safe City project</CardDescription>
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
                <Link className="h-5 w-5" />
                Integration
              </CardTitle>
              <CardDescription>System integrations for this Safe City project</CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Integration
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search integrations..."
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
                    onClick={() => handleSort('integ_with_dcc')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Integration with DCC {getSortIcon('integ_with_dcc')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('integ_with_piftac')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Integration with PIFTAC {getSortIcon('integ_with_piftac')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('integ_with_niftac')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Integration with NIFTAC {getSortIcon('integ_with_niftac')}
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
              {paginatedIntegrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No integrations found matching your search.' : 'No integrations found for this Safe City project.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedIntegrations.map((integration) => (
                    <TableRow key={integration._id || integration.id}>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          integration.integ_with_dcc
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}>
                          {integration.integ_with_dcc ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          integration.integ_with_piftac
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}>
                          {integration.integ_with_piftac ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          integration.integ_with_niftac
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}>
                          {integration.integ_with_niftac ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={integration.remarks}>
                        {integration.remarks || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(integration)}
                            className="h-8 w-8 p-0"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(integration)}
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(integration)}
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
        {filteredAndSortedIntegrations.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedIntegrations.length)} of {filteredAndSortedIntegrations.length} entries
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
      <IntegrationFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingIntegration(null);
            setViewingIntegration(null);
            setIsViewMode(false);
            setFormData(buildInitialForm());
          }
        }}
        onSubmit={handleSubmit}
        initialData={isViewMode ? formData : editingIntegration ? formData : null}
        isEditMode={!!editingIntegration && !isViewMode}
        isViewMode={isViewMode}
        loading={loadingIntegration}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteConfirm}
        id={integrationToDeleteId}
        message={`Are you sure you want to delete this integration: ${integrationToDeleteName}? This action cannot be undone.`}
        deleting={deleting}
        title="Delete Integration"
      />
    </Card>
  );
};

export default Integration;

