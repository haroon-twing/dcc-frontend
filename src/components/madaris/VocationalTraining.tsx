import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Briefcase, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import VocationalTrainingFormModal from '../modals/madaris/VocationalTrainingFormModal';

interface VocationalTraining {
  _id?: string;
  id?: string;
  tr_name: string;
  age_group: string;
  duration: string;
  start_date: string;
  end_date: string;
  madaris_id: string;
  remarks: string;
}

interface VocationalTrainingFormState {
  tr_name: string;
  age_group: string;
  duration: string;
  start_date: string;
  end_date: string;
  remarks: string;
}

interface VocationalTrainingProps {
  madarisId: string;
}

const VocationalTraining: React.FC<VocationalTrainingProps> = ({ madarisId }) => {
  const [trainings, setTrainings] = useState<VocationalTraining[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState<VocationalTraining | null>(null);
  const [viewingTraining, setViewingTraining] = useState<VocationalTraining | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingTraining, setLoadingTraining] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [trainingToDeleteId, setTrainingToDeleteId] = useState<string | number | undefined>(undefined);
  const [trainingToDeleteName, setTrainingToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<VocationalTrainingFormState>({
    tr_name: '',
    age_group: '',
    duration: '',
    start_date: '',
    end_date: '',
    remarks: '',
  });

  const buildInitialForm = (): VocationalTrainingFormState => ({
    tr_name: '',
    age_group: '',
    duration: '',
    start_date: '',
    end_date: '',
    remarks: '',
  });

  const fetchTrainings = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setTrainings([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-vocational-trainings-against-madrasa/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const trainingsData: VocationalTraining[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        tr_name: item.tr_name || 'N/A',
        age_group: item.age_group || 'N/A',
        duration: item.duration || 'N/A',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        madaris_id: item.madaris_id || madarisId,
        remarks: item.remarks || '',
      }));
      
      setTrainings(trainingsData);
    } catch (err: any) {
      console.error('Error fetching vocational trainings:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load vocational trainings');
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
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
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const handleView = async (training: VocationalTraining) => {
    const trainingId = training._id || training.id;
    if (!trainingId) {
      alert('Training ID is missing. Cannot load training details.');
      return;
    }

    setLoadingTraining(true);
    setViewingTraining(training);
    setEditingTraining(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-vocational-training/${trainingId}`;
      const response = await publicApi.get(viewEndpoint);
      const trainingData = response.data?.data || response.data || training;

      setFormData({
        tr_name: trainingData.tr_name || '',
        age_group: trainingData.age_group || '',
        duration: trainingData.duration || '',
        start_date: formatDateForInput(trainingData.start_date),
        end_date: formatDateForInput(trainingData.end_date),
        remarks: trainingData.remarks || '',
      });
      
      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching training details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load training details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        tr_name: training.tr_name || '',
        age_group: training.age_group || '',
        duration: training.duration || '',
        start_date: formatDateForInput(training.start_date),
        end_date: formatDateForInput(training.end_date),
        remarks: training.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingTraining(false);
    }
  };

  const handleEdit = (training: VocationalTraining) => {
    setEditingTraining(training);
    setViewingTraining(null);
    setIsViewMode(false);
    setFormData({
      tr_name: training.tr_name || '',
      age_group: training.age_group || '',
      duration: training.duration || '',
      start_date: formatDateForInput(training.start_date),
      end_date: formatDateForInput(training.end_date),
      remarks: training.remarks || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTraining(null);
    setViewingTraining(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowModal(true);
  };

  const handleDelete = (training: VocationalTraining) => {
    const trainingId = training._id || training.id;
    const trainingName = training.tr_name || 'this training';
    if (trainingId) {
      setTrainingToDeleteId(trainingId);
      setTrainingToDeleteName(trainingName);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-vocational-training/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setTrainingToDeleteId(undefined);
      setTrainingToDeleteName('');
      await fetchTrainings();
    } catch (error: any) {
      console.error('Error deleting training:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete training. Please try again.'
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
        tr_name: formData.tr_name,
        age_group: formData.age_group,
        duration: formData.duration,
        start_date: formData.start_date,
        end_date: formData.end_date,
        madaris_id: madarisId,
        remarks: formData.remarks,
      };

      if (editingTraining) {
        const trainingId = editingTraining._id || editingTraining.id;
        if (!trainingId) {
          throw new Error('Training ID is required for update');
        }
        const updateEndpoint = `/madaris/update-vocational-training/${trainingId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-vocational-training';
        await api.post(addEndpoint, payload);
      }

      await fetchTrainings();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingTraining(null);
      setViewingTraining(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving training:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingTraining ? 'update' : 'add'} training. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedTrainings = useMemo(() => {
    let filtered = trainings;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = trainings.filter((training) => {
        return (
          (training.tr_name || '').toLowerCase().includes(searchLower) ||
          (training.age_group || '').toLowerCase().includes(searchLower) ||
          (training.duration || '').toLowerCase().includes(searchLower) ||
          formatDate(training.start_date).toLowerCase().includes(searchLower) ||
          formatDate(training.end_date).toLowerCase().includes(searchLower) ||
          (training.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'tr_name':
            aValue = (a.tr_name || '').toLowerCase();
            bValue = (b.tr_name || '').toLowerCase();
            break;
          case 'age_group':
            aValue = (a.age_group || '').toLowerCase();
            bValue = (b.age_group || '').toLowerCase();
            break;
          case 'duration':
            aValue = (a.duration || '').toLowerCase();
            bValue = (b.duration || '').toLowerCase();
            break;
          case 'start_date':
            aValue = new Date(a.start_date || 0).getTime();
            bValue = new Date(b.start_date || 0).getTime();
            break;
          case 'end_date':
            aValue = new Date(a.end_date || 0).getTime();
            bValue = new Date(b.end_date || 0).getTime();
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
  }, [trainings, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedTrainings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTrainings.slice(startIndex, endIndex);
  }, [filteredAndSortedTrainings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTrainings.length / itemsPerPage);

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
            <Briefcase className="h-5 w-5" />
            Vocational Training
          </CardTitle>
          <CardDescription>List of vocational trainings for this institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading vocational trainings...</p>
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
            <Briefcase className="h-5 w-5" />
            Vocational Training
          </CardTitle>
          <CardDescription>List of vocational trainings for this institution</CardDescription>
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
                  <Briefcase className="h-5 w-5" />
                  Vocational Training
                </CardTitle>
                <CardDescription>List of vocational trainings for this institution</CardDescription>
              </div>
              <Button
                onClick={handleAdd}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Vocational Training
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search vocational trainings..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        {filteredAndSortedTrainings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No vocational trainings found matching your search.' : 'No vocational trainings found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('tr_name')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Training Name {getSortIcon('tr_name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('age_group')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Age Group {getSortIcon('age_group')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('duration')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Duration {getSortIcon('duration')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('start_date')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Start Date {getSortIcon('start_date')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('end_date')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      End Date {getSortIcon('end_date')}
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
                {paginatedTrainings.map((training) => (
                  <TableRow key={training._id || training.id}>
                    <TableCell className="font-medium">{training.tr_name || 'N/A'}</TableCell>
                    <TableCell>{training.age_group || 'N/A'}</TableCell>
                    <TableCell>{training.duration || 'N/A'}</TableCell>
                    <TableCell>{formatDate(training.start_date)}</TableCell>
                    <TableCell>{formatDate(training.end_date)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={training.remarks}>
                      {training.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(training)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(training)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(training)}
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
        {filteredAndSortedTrainings.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTrainings.length)} of {filteredAndSortedTrainings.length} entries
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

    <VocationalTrainingFormModal
      open={showModal}
      onOpenChange={(open) => {
        if (!open && !submitting && !loadingTraining) {
          setShowModal(false);
          setFormData(buildInitialForm());
          setEditingTraining(null);
          setViewingTraining(null);
          setIsViewMode(false);
        }
      }}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      title={isViewMode ? 'View Vocational Training Details' : editingTraining ? 'Edit Vocational Training' : 'Add Vocational Training'}
      submitLabel={editingTraining ? 'Save Changes' : 'Add Vocational Training'}
      submitting={submitting || loadingTraining}
      viewMode={isViewMode}
    />

    <DeleteModal
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      id={trainingToDeleteId}
      message={`Are you sure you want to delete vocational training "${trainingToDeleteName}"? This action cannot be undone.`}
      onSubmit={handleDeleteSubmit}
      deleting={deleting}
      title="Delete Vocational Training"
    />
    </>
  );
};

export default VocationalTraining;

