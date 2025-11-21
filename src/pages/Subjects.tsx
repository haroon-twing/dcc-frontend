import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Button } from '../components/UI/Button';
import { BookOpen, Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import SubjectAdditionFormModal from '../components/modals/madaris/SubjectAdditionFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface Subject {
  _id?: string;
  id?: string;
  subject: string;
  added_on_date: string;
  added_for_class: string;
  added_for_agegroup: string;
  remarks: string;
}

interface SubjectFormState {
  subject: string;
  added_on_date: string;
  added_for_class: string;
  added_for_agegroup: string;
  remarks: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
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
  
  const buildInitialForm = (): SubjectFormState => ({
    subject: '',
    added_on_date: '',
    added_for_class: '',
    added_for_agegroup: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<SubjectFormState>(buildInitialForm());

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const endpoint = '/madaris/get-subject-curriculums';
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const subjects: Subject[] = data.map((item: any) => ({
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
      console.error('Error fetching subjects:', err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

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

  const handleView = async (subject: Subject) => {
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
      const subjectData = response.data?.data || response.data || subject;

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

  const handleEdit = (subject: Subject) => {
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
      console.error('Error submitting subject:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingSubject ? 'update' : 'add'} subject. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (subject: Subject) => {
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
      console.error('Error deleting subject:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete subject. Please try again.'
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Subjects</h2>
          <p className="text-muted-foreground">Manage subjects and curriculum information.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="self-start sm:self-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading subjects...
            </div>
          ) : filteredAndSortedSubjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No subjects found matching your search.' : 'No subjects found.'}
            </div>
          ) : (
            <>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(subject)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(subject)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(subject)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
            </>
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
        title={isViewMode ? 'View Subject Details' : editingSubject ? 'Edit Subject' : 'Add Subject'}
        submitLabel={editingSubject ? 'Save Changes' : 'Add Subject'}
        submitting={submitting || loadingSubject}
        viewMode={isViewMode}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={subjectToDeleteId}
        message={`Are you sure you want to delete "${subjectToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Subject"
      />
    </div>
  );
};

export default Subjects;

