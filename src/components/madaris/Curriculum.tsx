import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { BookOpen, Loader2, Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import CurriculumFormModal from '../modals/madaris/CurriculumFormModal';
import DeleteModal from '../UI/DeleteModal';

interface Curriculum {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  remarks: string;
}

interface CurriculumProps {
  madarisId: string;
}

interface CurriculumFormState {
  title: string;
  description: string;
  status: string;
  remarks: string;
}

const Curriculum: React.FC<CurriculumProps> = ({ madarisId }) => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [viewingCurriculum, setViewingCurriculum] = useState<Curriculum | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingCurriculum, setLoadingCurriculum] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [curriculumToDeleteId, setCurriculumToDeleteId] = useState<string | number | undefined>(undefined);
  const [curriculumToDeleteName, setCurriculumToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const buildInitialForm = (): CurriculumFormState => ({
    title: '',
    description: '',
    status: 'active',
    remarks: '',
  });

  const [formData, setFormData] = useState<CurriculumFormState>(buildInitialForm());

  const fetchCurriculums = async () => {
    if (!madarisId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-curriculums?madaris_id=${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const curriculums: Curriculum[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        title: item.title || 'N/A',
        description: item.description || 'N/A',
        status: item.status || 'active',
        remarks: item.remarks || '',
      }));
      
      setCurriculums(curriculums);
    } catch (err: any) {
      console.error('Error fetching curriculums:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load curriculums');
      setCurriculums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
  }, [madarisId]);

  const formatStatus = (status: string) => {
    if (!status) return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleView = async (curriculum: Curriculum) => {
    const curriculumId = curriculum._id || curriculum.id;
    if (!curriculumId) {
      alert('Curriculum ID is missing. Cannot load curriculum details.');
      return;
    }

    setLoadingCurriculum(true);
    setViewingCurriculum(curriculum);
    setEditingCurriculum(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-curriculum/${curriculumId}`;
      const response = await publicApi.get(viewEndpoint);
      const curriculumData = response.data?.data || response.data;

      setFormData({
        title: curriculumData.title || '',
        description: curriculumData.description || '',
        status: curriculumData.status || 'active',
        remarks: curriculumData.remarks || '',
      });
      
      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching curriculum details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load curriculum details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        title: curriculum.title || '',
        description: curriculum.description || '',
        status: curriculum.status || 'active',
        remarks: curriculum.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  const handleEdit = (curriculum: Curriculum) => {
    setEditingCurriculum(curriculum);
    setViewingCurriculum(null);
    setIsViewMode(false);
    setFormData({
      title: curriculum.title || '',
      description: curriculum.description || '',
      status: curriculum.status || 'active',
      remarks: curriculum.remarks || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCurriculum(null);
    setViewingCurriculum(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        remarks: formData.remarks,
        madaris_id: madarisId,
      };

      if (editingCurriculum) {
        const curriculumId = editingCurriculum._id || editingCurriculum.id;
        if (!curriculumId) {
          throw new Error('Curriculum ID is required for update');
        }
        const updateEndpoint = `/madaris/update-curriculum/${curriculumId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-curriculum';
        await api.post(addEndpoint, payload);
      }

      await fetchCurriculums();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingCurriculum(null);
    } catch (err: any) {
      console.error('Error submitting curriculum:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingCurriculum ? 'update' : 'add'} curriculum. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (curriculum: Curriculum) => {
    setCurriculumToDeleteId(curriculum._id || curriculum.id);
    setCurriculumToDeleteName(curriculum.title);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-curriculum/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setCurriculumToDeleteId(undefined);
      setCurriculumToDeleteName('');
      
      await fetchCurriculums();
    } catch (error: any) {
      console.error('Error deleting curriculum:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete curriculum. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedCurriculums = useMemo(() => {
    let filtered = curriculums;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = curriculums.filter((curriculum) => {
        return (
          (curriculum.title || '').toLowerCase().includes(searchLower) ||
          (curriculum.description || '').toLowerCase().includes(searchLower) ||
          (curriculum.status || '').toLowerCase().includes(searchLower) ||
          (curriculum.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'title':
            aValue = (a.title || '').toLowerCase();
            bValue = (b.title || '').toLowerCase();
            break;
          case 'description':
            aValue = (a.description || '').toLowerCase();
            bValue = (b.description || '').toLowerCase();
            break;
          case 'status':
            aValue = (a.status || '').toLowerCase();
            bValue = (b.status || '').toLowerCase();
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
  }, [curriculums, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedCurriculums = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCurriculums.slice(startIndex, endIndex);
  }, [filteredAndSortedCurriculums, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCurriculums.length / itemsPerPage);

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
            <BookOpen className="h-5 w-5" />
            Curriculum
          </CardTitle>
          <CardDescription>List of curriculums for this institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading curriculums...</p>
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
            <BookOpen className="h-5 w-5" />
            Curriculum
          </CardTitle>
          <CardDescription>List of curriculums for this institution</CardDescription>
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
                  <BookOpen className="h-5 w-5" />
                  Curriculum
                </CardTitle>
                <CardDescription>List of curriculums for this institution</CardDescription>
              </div>
              <Button
                onClick={handleAdd}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Curriculum
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search curriculums..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        {filteredAndSortedCurriculums.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No curriculums found matching your search.' : 'No curriculums found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Title {getSortIcon('title')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('description')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Description {getSortIcon('description')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Status {getSortIcon('status')}
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
                {paginatedCurriculums.map((curriculum) => (
                  <TableRow key={curriculum._id || curriculum.id}>
                    <TableCell className="font-medium">{curriculum.title || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={curriculum.description}>
                      {curriculum.description || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        curriculum.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                      }`}>
                        {formatStatus(curriculum.status)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={curriculum.remarks}>
                      {curriculum.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(curriculum)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(curriculum)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(curriculum)}
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
        {filteredAndSortedCurriculums.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCurriculums.length)} of {filteredAndSortedCurriculums.length} entries
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

    <CurriculumFormModal
      open={showModal}
      onOpenChange={(open) => {
        if (!open && !submitting && !loadingCurriculum) {
          setShowModal(false);
          setFormData(buildInitialForm());
          setEditingCurriculum(null);
          setViewingCurriculum(null);
          setIsViewMode(false);
        }
      }}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      title={isViewMode ? 'View Curriculum Details' : editingCurriculum ? 'Edit Curriculum' : 'Add Curriculum'}
      submitLabel={editingCurriculum ? 'Save Changes' : 'Add Curriculum'}
      submitting={submitting || loadingCurriculum}
      viewMode={isViewMode}
    />

    <DeleteModal
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      id={curriculumToDeleteId}
      message={`Are you sure you want to delete curriculum "${curriculumToDeleteName}"? This action cannot be undone.`}
      onSubmit={handleDeleteSubmit}
      deleting={deleting}
      title="Delete Curriculum"
    />
    </>
  );
};

export default Curriculum;

