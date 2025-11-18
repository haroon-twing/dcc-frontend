import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Shield, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import MeasuresTakenFormModal from '../modals/safecity/MeasuresTakenFormModal';
import DeleteModal from '../UI/DeleteModal';

interface MeasureTaken {
  _id?: string;
  id?: string;
  measure_taken: string;
  measure_taken_authority: string;
  details: string;
  remarks?: string;
  sc_id: string;
}

interface MeasuresTakenFormState {
  measure_taken: string;
  measure_taken_authority: string;
  details: string;
  remarks: string;
}

interface MeasuresTakenProps {
  safeCityId: string;
}

const MeasuresTaken: React.FC<MeasuresTakenProps> = ({ safeCityId }) => {
  const [measures, setMeasures] = useState<MeasureTaken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingMeasure, setEditingMeasure] = useState<MeasureTaken | null>(null);
  const [viewingMeasure, setViewingMeasure] = useState<MeasureTaken | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingMeasure, setLoadingMeasure] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [measureToDeleteId, setMeasureToDeleteId] = useState<string | number | undefined>(undefined);
  const [measureToDeleteName, setMeasureToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const buildInitialForm = (): MeasuresTakenFormState => ({
    measure_taken: '',
    measure_taken_authority: '',
    details: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<MeasuresTakenFormState>(buildInitialForm());

  const fetchMeasures = async () => {
    if (!safeCityId) {
      setLoading(false);
      setMeasures([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/safecity/get-all-safecity-measures-taken/${safeCityId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const measuresData: MeasureTaken[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        measure_taken: item.measure_taken || '',
        measure_taken_authority: item.measure_taken_authority || '',
        details: item.details || '',
        remarks: item.remarks || '',
        sc_id: item.sc_id || safeCityId,
      }));
      
      setMeasures(measuresData);
    } catch (err: any) {
      console.error('Error fetching measures taken:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load measures taken. Please try again.'
      );
      setMeasures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasures();
  }, [safeCityId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingMeasure(null);
    setViewingMeasure(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEdit = async (measure: MeasureTaken) => {
    const measureId = measure._id || measure.id;
    if (!measureId) {
      alert('Measure ID is missing. Cannot load measure details.');
      return;
    }

    setLoadingMeasure(true);
    setViewingMeasure(null);
    setEditingMeasure(measure);
    setIsViewMode(false);
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const editEndpoint = `/safecity/get-single-measure-taken/${measureId}`;
      // const response = await publicApi.get(editEndpoint);
      // const measureData = response.data?.data || response.data;
      
      // For now, use the measure data directly
      const measureData = measure;
      
      setFormData({
        measure_taken: measureData.measure_taken || '',
        measure_taken_authority: measureData.measure_taken_authority || '',
        details: measureData.details || '',
        remarks: measureData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading measure for edit:', err);
      alert('Failed to load measure data. Please try again.');
    } finally {
      setLoadingMeasure(false);
    }
  };

  const handleView = async (measure: MeasureTaken) => {
    const measureId = measure._id || measure.id;
    if (!measureId) {
      alert('Measure ID is missing. Cannot load measure details.');
      return;
    }

    setLoadingMeasure(true);
    setEditingMeasure(null);
    setViewingMeasure(measure);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/safecity/get-single-safecity-measure-taken/${measureId}`;
      const response = await publicApi.get(viewEndpoint);
      const measureData = response.data?.data || response.data;
      
      setFormData({
        measure_taken: measureData.measure_taken || '',
        measure_taken_authority: measureData.measure_taken_authority || '',
        details: measureData.details || '',
        remarks: measureData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading measure for view:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to load measure data. Please try again.');
    } finally {
      setLoadingMeasure(false);
    }
  };

  const handleDelete = (measure: MeasureTaken) => {
    const measureId = measure._id || measure.id;
    if (!measureId) {
      alert('Measure ID is missing. Cannot delete measure.');
      return;
    }
    
    setMeasureToDeleteId(measureId);
    setMeasureToDeleteName(measure.measure_taken || 'Measure');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (id: string | number) => {
    if (!id) return;

    try {
      setDeleting(true);
      const deleteEndpoint = `/safecity/delete-safecity-measure-taken/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setMeasureToDeleteId(undefined);
      setMeasureToDeleteName('');
      
      // Refresh the list
      await fetchMeasures();
    } catch (err: any) {
      console.error('Error deleting measure:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to delete measure. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: MeasuresTakenFormState) => {
    try {
      setSubmitting(true);
      
      const payload = {
        measure_taken: data.measure_taken,
        measure_taken_authority: data.measure_taken_authority,
        details: data.details,
        sc_id: safeCityId,
        remarks: data.remarks || '',
      };

      if (editingMeasure) {
        const measureId = editingMeasure._id || editingMeasure.id;
        if (!measureId) {
          alert('Measure ID is missing. Cannot update measure.');
          return;
        }
        
        const updateEndpoint = `/safecity/update-safecity-measure-taken/${measureId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = `/safecity/add-safecity-measure-taken`;
        await api.post(addEndpoint, payload);
      }
      
      setShowModal(false);
      setEditingMeasure(null);
      setViewingMeasure(null);
      setIsViewMode(false);
      setFormData(buildInitialForm());
      
      // Refresh the list
      await fetchMeasures();
    } catch (err: any) {
      console.error('Error submitting measure:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to save measure. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedMeasures = useMemo(() => {
    let filtered = measures;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = measures.filter((measure) => {
        return (
          (measure.measure_taken || '').toLowerCase().includes(searchLower) ||
          (measure.measure_taken_authority || '').toLowerCase().includes(searchLower) ||
          (measure.details || '').toLowerCase().includes(searchLower) ||
          (measure.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'measure_taken':
            aValue = (a.measure_taken || '').toLowerCase();
            bValue = (b.measure_taken || '').toLowerCase();
            break;
          case 'measure_taken_authority':
            aValue = (a.measure_taken_authority || '').toLowerCase();
            bValue = (b.measure_taken_authority || '').toLowerCase();
            break;
          case 'details':
            aValue = (a.details || '').toLowerCase();
            bValue = (b.details || '').toLowerCase();
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
  }, [measures, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedMeasures = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedMeasures.slice(startIndex, endIndex);
  }, [filteredAndSortedMeasures, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedMeasures.length / itemsPerPage);

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
            <Shield className="h-5 w-5" />
            Measures Taken
          </CardTitle>
          <CardDescription>Security measures implemented for this Safe City project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading measures taken...</p>
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
            <Shield className="h-5 w-5" />
            Measures Taken
          </CardTitle>
          <CardDescription>Security measures implemented for this Safe City project</CardDescription>
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
                <Shield className="h-5 w-5" />
                Measures Taken
              </CardTitle>
              <CardDescription>Security measures implemented for this Safe City project</CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Measures Taken
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search measures taken..."
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
                    onClick={() => handleSort('measure_taken')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Measure Taken {getSortIcon('measure_taken')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('measure_taken_authority')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Measure Taken Authority {getSortIcon('measure_taken_authority')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('details')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Details {getSortIcon('details')}
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
              {paginatedMeasures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No measures found matching your search.' : 'No measures taken found for this Safe City project.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMeasures.map((measure) => (
                  <TableRow key={measure._id || measure.id}>
                    <TableCell className="font-medium">{measure.measure_taken || 'N/A'}</TableCell>
                    <TableCell>{measure.measure_taken_authority || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={measure.details}>
                      {measure.details || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={measure.remarks}>
                      {measure.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(measure)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(measure)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(measure)}
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
        {filteredAndSortedMeasures.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedMeasures.length)} of {filteredAndSortedMeasures.length} entries
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
      <MeasuresTakenFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingMeasure(null);
            setViewingMeasure(null);
            setIsViewMode(false);
            setFormData(buildInitialForm());
          }
        }}
        onSubmit={handleSubmit}
        initialData={isViewMode ? formData : editingMeasure ? formData : null}
        isEditMode={!!editingMeasure && !isViewMode}
        isViewMode={isViewMode}
        loading={loadingMeasure}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteConfirm}
        id={measureToDeleteId}
        message={`Are you sure you want to delete this measure: ${measureToDeleteName}? This action cannot be undone.`}
        deleting={deleting}
        title="Delete Measures Taken"
      />
    </Card>
  );
};

export default MeasuresTaken;

