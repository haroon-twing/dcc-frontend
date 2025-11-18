import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { BookOpen, Loader2, Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import SubjectAdditionFormModal from '../modals/madaris/SubjectAdditionFormModal';
import DeleteModal from '../UI/DeleteModal';

interface SubjectAddition {
  _id?: string;
  id?: string;
  subject: string;
  added_on_date: string;
  added_for_class: string;
  added_for_agegroup: string;
  remarks: string;
}

interface SubjectsAdditionProps {
  madarisId: string;
}

interface SubjectAdditionFormState {
  subject: string;
  added_on_date: string;
  added_for_class: string;
  added_for_agegroup: string;
  remarks: string;
}

const SubjectsAddition: React.FC<SubjectsAdditionProps> = ({ madarisId }) => {
  const [subjects, setSubjects] = useState<SubjectAddition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<SubjectAddition | null>(null);
  const [viewingSubject, setViewingSubject] = useState<SubjectAddition | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingSubject, setLoadingSubject] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [subjectToDeleteId, setSubjectToDeleteId] = useState<string | number | undefined>(undefined);
  const [subjectToDeleteName, setSubjectToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const buildInitialForm = (): SubjectAdditionFormState => ({
    subject: '',
    added_on_date: '',
    added_for_class: '',
    added_for_agegroup: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<SubjectAdditionFormState>(buildInitialForm());

  const fetchSubjects = async () => {
    if (!madarisId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-subject-curriculums?madaris_id=${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const subjects: SubjectAddition[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        subject: item.subject || 'N/A',
        added_on_date: item.added_on_date || '',
        added_for_class: item.added_for_class || 'N/A',
        added_for_agegroup: item.added_for_agegroup || 'N/A',
        remarks: item.remarks || '',
      }));
      
      setSubjects(subjects);
    } catch (err: any) {
      console.error('Error fetching subjects addition:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load subjects addition');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [madarisId]);

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

  const handleView = async (subject: SubjectAddition) => {
    const subjectId = subject._id || subject.id;
    if (!subjectId) {
      alert('Subject ID is missing. Cannot load subject details.');
      return;
    }

    setLoadingSubject(true);
    setViewingSubject(subject);
    setEditingSubject(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-subject-curriculum/${subjectId}`;
      const response = await publicApi.get(viewEndpoint);
      const subjectData = response.data?.data || response.data;

      setFormData({
        subject: subjectData.subject || '',
        added_on_date: formatDateForInput(subjectData.added_on_date),
        added_for_class: subjectData.added_for_class || '',
        added_for_agegroup: subjectData.added_for_agegroup || '',
        remarks: subjectData.remarks || '',
      });
      
      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching subject details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load subject details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        subject: subject.subject || '',
        added_on_date: formatDateForInput(subject.added_on_date),
        added_for_class: subject.added_for_class || '',
        added_for_agegroup: subject.added_for_agegroup || '',
        remarks: subject.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingSubject(false);
    }
  };

  const handleEdit = (subject: SubjectAddition) => {
    setEditingSubject(subject);
    setViewingSubject(null);
    setIsViewMode(false);
    setFormData({
      subject: subject.subject || '',
      added_on_date: formatDateForInput(subject.added_on_date),
      added_for_class: subject.added_for_class || '',
      added_for_agegroup: subject.added_for_agegroup || '',
      remarks: subject.remarks || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSubject(null);
    setViewingSubject(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        subject: formData.subject,
        added_on_date: formData.added_on_date,
        added_for_class: formData.added_for_class,
        added_for_agegroup: formData.added_for_agegroup,
        remarks: formData.remarks,
        madaris_id: madarisId,
      };

      if (editingSubject) {
        const subjectId = editingSubject._id || editingSubject.id;
        if (!subjectId) {
          throw new Error('Subject ID is required for update');
        }
        const updateEndpoint = `/madaris/update-subject-curriculum/${subjectId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-subject-curriculum';
        await api.post(addEndpoint, payload);
      }

      await fetchSubjects();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingSubject(null);
    } catch (err: any) {
      console.error('Error submitting subject addition:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingSubject ? 'update' : 'add'} subject addition. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (subject: SubjectAddition) => {
    setSubjectToDeleteId(subject._id || subject.id);
    setSubjectToDeleteName(subject.subject);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-subject-curriculum/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setSubjectToDeleteId(undefined);
      setSubjectToDeleteName('');
      
      await fetchSubjects();
    } catch (error: any) {
      console.error('Error deleting subject addition:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete subject addition. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedSubjects = useMemo(() => {
    let filtered = subjects;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = subjects.filter((subject) => {
        return (
          (subject.subject || '').toLowerCase().includes(searchLower) ||
          formatDate(subject.added_on_date).toLowerCase().includes(searchLower) ||
          (subject.added_for_class || '').toLowerCase().includes(searchLower) ||
          (subject.added_for_agegroup || '').toLowerCase().includes(searchLower) ||
          (subject.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'subject':
            aValue = (a.subject || '').toLowerCase();
            bValue = (b.subject || '').toLowerCase();
            break;
          case 'added_on_date':
            aValue = new Date(a.added_on_date || 0).getTime();
            bValue = new Date(b.added_on_date || 0).getTime();
            break;
          case 'added_for_class':
            aValue = (a.added_for_class || '').toLowerCase();
            bValue = (b.added_for_class || '').toLowerCase();
            break;
          case 'added_for_agegroup':
            aValue = (a.added_for_agegroup || '').toLowerCase();
            bValue = (b.added_for_agegroup || '').toLowerCase();
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
  }, [subjects, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedSubjects.slice(startIndex, endIndex);
  }, [filteredAndSortedSubjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedSubjects.length / itemsPerPage);

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
            Subjects Addition
          </CardTitle>
          <CardDescription>List of subjects added to this institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading subjects addition...</p>
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
            Subjects Addition
          </CardTitle>
          <CardDescription>List of subjects added to this institution</CardDescription>
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
                  Subjects Addition
                </CardTitle>
                <CardDescription>List of subjects added to this institution</CardDescription>
              </div>
              <Button
                onClick={handleAdd}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Subject Addition
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search subjects addition..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        {filteredAndSortedSubjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No subjects addition found matching your search.' : 'No subjects addition found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('subject')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Subject {getSortIcon('subject')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('added_on_date')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Added On Date {getSortIcon('added_on_date')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('added_for_class')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Added For Class {getSortIcon('added_for_class')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('added_for_agegroup')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Added For Age Group {getSortIcon('added_for_agegroup')}
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
                {paginatedSubjects.map((subject) => (
                  <TableRow key={subject._id || subject.id}>
                    <TableCell className="font-medium">{subject.subject || 'N/A'}</TableCell>
                    <TableCell>{formatDate(subject.added_on_date)}</TableCell>
                    <TableCell>{subject.added_for_class || 'N/A'}</TableCell>
                    <TableCell>{subject.added_for_agegroup || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={subject.remarks}>
                      {subject.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(subject)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(subject)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subject)}
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
        {filteredAndSortedSubjects.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedSubjects.length)} of {filteredAndSortedSubjects.length} entries
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

    <SubjectAdditionFormModal
      open={showModal}
      onOpenChange={(open) => {
        if (!open && !submitting && !loadingSubject) {
          setShowModal(false);
          setFormData(buildInitialForm());
          setEditingSubject(null);
          setViewingSubject(null);
          setIsViewMode(false);
        }
      }}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      title={isViewMode ? 'View Subject Addition Details' : editingSubject ? 'Edit Subject Addition' : 'Add Subject Addition'}
      submitLabel={editingSubject ? 'Save Changes' : 'Add Subject Addition'}
      submitting={submitting || loadingSubject}
      viewMode={isViewMode}
    />

    <DeleteModal
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      id={subjectToDeleteId}
      message={`Are you sure you want to delete subject addition "${subjectToDeleteName}"? This action cannot be undone.`}
      onSubmit={handleDeleteSubmit}
      deleting={deleting}
      title="Delete Subject Addition"
    />
    </>
  );
};

export default SubjectsAddition;

