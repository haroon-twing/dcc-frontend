import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Users, Loader2, Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import TeacherFormModal from '../modals/madaris/TeacherFormModal';
import DeleteModal from '../UI/DeleteModal';

interface Teacher {
  _id?: string;
  id?: string;
  full_name: string;
  gender: string;
  dob: string;
  cnic: string;
  contact_no: string;
  email: string;
  qualification: string;
  designation: string;
  joining_date: string;
  address: string;
  isMohtamim: boolean;
}

interface MadarisTeachersProps {
  madarisId: string;
}

interface TeacherFormState {
  full_name: string;
  gender: string;
  dob: string;
  cnic: string;
  contact_no: string;
  email: string;
  qualification: string;
  designation: string;
  joining_date: string;
  address: string;
  isMohtamim: boolean;
}

const MadarisTeachers: React.FC<MadarisTeachersProps> = ({ madarisId }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingTeacher, setLoadingTeacher] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [teacherToDeleteId, setTeacherToDeleteId] = useState<string | number | undefined>(undefined);
  const [teacherToDeleteName, setTeacherToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const buildInitialForm = (): TeacherFormState => ({
    full_name: '',
    gender: '',
    dob: '',
    cnic: '',
    contact_no: '',
    email: '',
    qualification: '',
    designation: '',
    joining_date: '',
    address: '',
    isMohtamim: false,
  });

  const [formData, setFormData] = useState<TeacherFormState>(buildInitialForm());

  const fetchTeachers = async () => {
    if (!madarisId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-all-madaris-teachers/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      // Map the API response to Teacher interface
      const teachers: Teacher[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        full_name: item.full_name || 'N/A',
        gender: item.gender || '',
        dob: item.dob || '',
        cnic: item.cnic || '',
        contact_no: item.contact_no || '',
        email: item.email || '',
        qualification: item.qualification || '',
        designation: item.designation || '',
        joining_date: item.joining_date || '',
        address: item.address || '',
        isMohtamim: Boolean(item.isMohtamim),
      }));
      
      setTeachers(teachers);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load teachers');
      setTeachers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
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

  const formatGender = (gender: string) => {
    if (!gender) return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  // Format date for HTML date input (YYYY-MM-DD format)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // If date is already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Try to parse the date and format it
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const handleView = async (teacher: Teacher) => {
    const teacherId = teacher._id || teacher.id;
    if (!teacherId) {
      alert('Teacher ID is missing. Cannot load teacher details.');
      return;
    }

    setLoadingTeacher(true);
    setViewingTeacher(teacher);
    setEditingTeacher(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-madaris-teacher/${teacherId}`;
      const response = await api.get(viewEndpoint);
      const teacherData = response.data?.data || response.data;

      // Update form data with the fetched teacher details
      setFormData({
        full_name: teacherData.full_name || '',
        gender: teacherData.gender || '',
        dob: formatDateForInput(teacherData.dob),
        cnic: teacherData.cnic || '',
        contact_no: teacherData.contact_no || '',
        email: teacherData.email || '',
        qualification: teacherData.qualification || '',
        designation: teacherData.designation || '',
        joining_date: formatDateForInput(teacherData.joining_date),
        address: teacherData.address || '',
        isMohtamim: teacherData.isMohtamim || false,
      });
      
      setShowTeacherModal(true);
    } catch (error: any) {
      console.error('Error fetching teacher details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load teacher details. Please try again.'
      );
      // Still show the modal with existing data as fallback
      setFormData({
        full_name: teacher.full_name || '',
        gender: teacher.gender || '',
        dob: formatDateForInput(teacher.dob),
        cnic: teacher.cnic || '',
        contact_no: teacher.contact_no || '',
        email: teacher.email || '',
        qualification: teacher.qualification || '',
        designation: teacher.designation || '',
        joining_date: formatDateForInput(teacher.joining_date),
        address: teacher.address || '',
        isMohtamim: teacher.isMohtamim || false,
      });
      setShowTeacherModal(true);
    } finally {
      setLoadingTeacher(false);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setViewingTeacher(null);
    setIsViewMode(false);
    setFormData({
      full_name: teacher.full_name || '',
      gender: teacher.gender || '',
      dob: formatDateForInput(teacher.dob),
      cnic: teacher.cnic || '',
      contact_no: teacher.contact_no || '',
      email: teacher.email || '',
      qualification: teacher.qualification || '',
      designation: teacher.designation || '',
      joining_date: formatDateForInput(teacher.joining_date),
      address: teacher.address || '',
      isMohtamim: teacher.isMohtamim || false,
    });
    setShowTeacherModal(true);
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setViewingTeacher(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowTeacherModal(true);
  };

  const handleSubmitTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        full_name: formData.full_name,
        gender: formData.gender,
        dob: formData.dob,
        cnic: formData.cnic,
        contact_no: formData.contact_no,
        email: formData.email,
        qualification: formData.qualification,
        designation: formData.designation,
        joining_date: formData.joining_date,
        address: formData.address,
        madaris_id: madarisId,
        isMohtamim: formData.isMohtamim,
      };

      if (editingTeacher) {
        // Update existing teacher
        const teacherId = editingTeacher._id || editingTeacher.id;
        if (!teacherId) {
          throw new Error('Teacher ID is required for update');
        }
        const updateEndpoint = `/madaris/update-madaris-teacher/${teacherId}`;
        await api.put(updateEndpoint, payload);
      } else {
        // Add new teacher
        const addEndpoint = '/madaris/add-madaris-teacher';
        await api.post(addEndpoint, payload);
      }

      // Refresh the list after successful submission
      await fetchTeachers();
      
      setShowTeacherModal(false);
      setFormData(buildInitialForm());
      setEditingTeacher(null);
    } catch (err: any) {
      console.error('Error submitting teacher:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingTeacher ? 'update' : 'add'} teacher. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (teacher: Teacher) => {
    setTeacherToDeleteId(teacher._id || teacher.id);
    setTeacherToDeleteName(teacher.full_name);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-madaris-teacher/${id}`;
      await api.delete(deleteEndpoint);
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setTeacherToDeleteId(undefined);
      setTeacherToDeleteName('');
      
      // Refresh the list after successful deletion
      await fetchTeachers();
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete teacher. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedTeachers = useMemo(() => {
    let filtered = teachers;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = teachers.filter((teacher) => {
        return (
          teacher.full_name.toLowerCase().includes(searchLower) ||
          teacher.gender.toLowerCase().includes(searchLower) ||
          teacher.cnic.toLowerCase().includes(searchLower) ||
          teacher.contact_no.toLowerCase().includes(searchLower) ||
          teacher.email.toLowerCase().includes(searchLower) ||
          teacher.qualification.toLowerCase().includes(searchLower) ||
          teacher.designation.toLowerCase().includes(searchLower) ||
          teacher.address.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'full_name':
            aValue = a.full_name.toLowerCase();
            bValue = b.full_name.toLowerCase();
            break;
          case 'gender':
            aValue = a.gender.toLowerCase();
            bValue = b.gender.toLowerCase();
            break;
          case 'cnic':
            aValue = a.cnic.toLowerCase();
            bValue = b.cnic.toLowerCase();
            break;
          case 'contact_no':
            aValue = a.contact_no.toLowerCase();
            bValue = b.contact_no.toLowerCase();
            break;
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case 'qualification':
            aValue = a.qualification.toLowerCase();
            bValue = b.qualification.toLowerCase();
            break;
          case 'designation':
            aValue = a.designation.toLowerCase();
            bValue = b.designation.toLowerCase();
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
  }, [teachers, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTeachers.slice(startIndex, endIndex);
  }, [filteredAndSortedTeachers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTeachers.length / itemsPerPage);

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
    setCurrentPage(1); // Reset to first page when sorting
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
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teachers
          </CardTitle>
          <CardDescription>List of teachers associated with this institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading teachers...</p>
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
            <Users className="h-5 w-5" />
            Teachers
          </CardTitle>
          <CardDescription>List of teachers associated with this institution</CardDescription>
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
                  <Users className="h-5 w-5" />
                  Teachers
                </CardTitle>
                <CardDescription>List of teachers associated with this institution</CardDescription>
              </div>
              <Button
                onClick={handleAddTeacher}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Teacher
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        {filteredAndSortedTeachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No teachers found matching your search.' : 'No teachers found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('full_name')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Full Name {getSortIcon('full_name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('gender')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Gender {getSortIcon('gender')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('cnic')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      CNIC {getSortIcon('cnic')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('contact_no')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Contact No {getSortIcon('contact_no')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Email {getSortIcon('email')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('qualification')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Qualification {getSortIcon('qualification')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('designation')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Designation {getSortIcon('designation')}
                    </button>
                  </TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Mohtamim</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher._id || teacher.id}>
                    <TableCell className="font-medium">{teacher.full_name || 'N/A'}</TableCell>
                    <TableCell>{formatGender(teacher.gender)}</TableCell>
                    <TableCell className="font-mono text-sm">{teacher.cnic || 'N/A'}</TableCell>
                    <TableCell>{teacher.contact_no || 'N/A'}</TableCell>
                    <TableCell>{teacher.email || 'N/A'}</TableCell>
                    <TableCell>{teacher.qualification || 'N/A'}</TableCell>
                    <TableCell>{teacher.designation || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={teacher.address}>
                      {teacher.address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        teacher.isMohtamim
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                      }`}>
                        {teacher.isMohtamim ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(teacher)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(teacher)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(teacher)}
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
        {filteredAndSortedTeachers.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTeachers.length)} of {filteredAndSortedTeachers.length} entries
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

    <TeacherFormModal
      open={showTeacherModal}
      onOpenChange={(open) => {
        if (!open && !submitting && !loadingTeacher) {
          setShowTeacherModal(false);
          setFormData(buildInitialForm());
          setEditingTeacher(null);
          setViewingTeacher(null);
          setIsViewMode(false);
        }
      }}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmitTeacher}
      title={isViewMode ? 'View Teacher Details' : editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
      submitLabel={editingTeacher ? 'Save Changes' : 'Add Teacher'}
      submitting={submitting || loadingTeacher}
      madarisId={madarisId}
      viewMode={isViewMode}
    />

    <DeleteModal
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      id={teacherToDeleteId}
      message={`Are you sure you want to delete teacher "${teacherToDeleteName}"? This action cannot be undone.`}
      onSubmit={handleDeleteSubmit}
      deleting={deleting}
      title="Delete Teacher"
    />
    </>
  );
};

export default MadarisTeachers;

