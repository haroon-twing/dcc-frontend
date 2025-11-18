import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { GraduationCap, Loader2, Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import { fetchCountries as fetchCountriesLookup, CountryOption } from '../../lib/lookups';
import DeleteModal from '../UI/DeleteModal';
import StudentFormModal from '../modals/madaris/StudentFormModal';

interface Student {
  _id?: string;
  id?: string;
  total_foreign_students: number;
  origin_country?: string | { _id: string; name: string };
  origin_country_name?: string;
  remarks?: string;
  madaris_id: string;
}

interface MadarisStudentsProps {
  madarisId: string;
}

interface StudentFormState {
  total_foreign_students: string;
  origin_country: string;
  remarks: string;
}

const MadarisStudents: React.FC<MadarisStudentsProps> = ({ madarisId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingStudent, setLoadingStudent] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | number | undefined>(undefined);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const buildInitialForm = (): StudentFormState => ({
    total_foreign_students: '',
    origin_country: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<StudentFormState>(buildInitialForm());

  const loadCountries = useCallback(async () => {
    try {
      setLoadingCountries(true);
      const countriesData = await fetchCountriesLookup();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setStudents([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-all-madaris-students/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      // Ensure countries are loaded before mapping
      let countriesList = countries;
      if (countriesList.length === 0) {
        countriesList = await fetchCountriesLookup();
        setCountries(countriesList);
      }
      
      const students: Student[] = data.map((item: any) => {
        const countryId = item.origin_country?._id || item.origin_country || '';
        const countryName = item.origin_country?.name || 
          countriesList.find(c => c._id === countryId)?.name || 
          'N/A';
        
        return {
          _id: item._id || item.id,
          id: item._id || item.id,
          total_foreign_students: item.total_foreign_students || 0,
          origin_country: countryId,
          origin_country_name: countryName,
          remarks: item.remarks || '',
          madaris_id: item.madaris_id || madarisId,
        };
      });
      
      setStudents(students);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId, countries]);

  useEffect(() => {
    if (madarisId) {
      loadCountries();
    }
  }, [madarisId, loadCountries]);

  useEffect(() => {
    if (madarisId) {
      fetchStudents();
    }
  }, [madarisId, fetchStudents]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setViewingStudent(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowStudentModal(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setViewingStudent(null);
    setIsViewMode(false);
    setFormData({
      total_foreign_students: String(student.total_foreign_students || ''),
      origin_country: typeof student.origin_country === 'string' 
        ? student.origin_country 
        : student.origin_country?._id || '',
      remarks: student.remarks || '',
    });
    setShowStudentModal(true);
  };

  const handleView = async (student: Student) => {
    const studentId = student._id || student.id;
    if (!studentId) {
      alert('Student ID is missing. Cannot load student details.');
      return;
    }

    setLoadingStudent(true);
    setViewingStudent(student);
    setEditingStudent(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-madaris-student/${studentId}`;
      const response = await api.get(viewEndpoint);
      const studentData = response.data?.data || response.data;

      setFormData({
        total_foreign_students: String(studentData.total_foreign_students || ''),
        origin_country: typeof studentData.origin_country === 'string' 
          ? studentData.origin_country 
          : studentData.origin_country?._id || '',
        remarks: studentData.remarks || '',
      });
      
      setShowStudentModal(true);
    } catch (error: any) {
      console.error('Error fetching student details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load student details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        total_foreign_students: String(student.total_foreign_students || ''),
        origin_country: typeof student.origin_country === 'string' 
          ? student.origin_country 
          : student.origin_country?._id || '',
        remarks: student.remarks || '',
      });
      setShowStudentModal(true);
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleDelete = (student: Student) => {
    setStudentToDeleteId(student._id || student.id);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        total_foreign_students: parseInt(formData.total_foreign_students) || 0,
        origin_country: formData.origin_country || '',
        remarks: formData.remarks || '',
        madaris_id: madarisId,
      };

      if (editingStudent) {
        const studentId = editingStudent._id || editingStudent.id;
        if (!studentId) {
          throw new Error('Student ID is required for update');
        }
        const updateEndpoint = `/madaris/update-madaris-student/${studentId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-madaris-student';
        await api.post(addEndpoint, payload);
      }

      await fetchStudents();
      setShowStudentModal(false);
      setFormData(buildInitialForm());
      setEditingStudent(null);
    } catch (err: any) {
      console.error('Error submitting student:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingStudent ? 'update' : 'add'} student. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-madaris-student/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setStudentToDeleteId(undefined);
      await fetchStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete student. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = students.filter((student) => {
        return (
          String(student.total_foreign_students).includes(searchLower) ||
          (student.origin_country_name || '').toLowerCase().includes(searchLower) ||
          (student.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'total_foreign_students':
            aValue = a.total_foreign_students || 0;
            bValue = b.total_foreign_students || 0;
            break;
          case 'origin_country':
            aValue = (a.origin_country_name || '').toLowerCase();
            bValue = (b.origin_country_name || '').toLowerCase();
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
  }, [students, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedStudents.slice(startIndex, endIndex);
  }, [filteredAndSortedStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);

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
            <GraduationCap className="h-5 w-5" />
            Students
          </CardTitle>
          <CardDescription>List of students enrolled in this institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading students...</p>
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
            <GraduationCap className="h-5 w-5" />
            Students
          </CardTitle>
          <CardDescription>List of students enrolled in this institution</CardDescription>
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
                  <GraduationCap className="h-5 w-5" />
                  Students
                </CardTitle>
                <CardDescription>List of students enrolled in this institution</CardDescription>
              </div>
              <Button
                onClick={handleAddStudent}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No students found matching your search.' : 'No students found for this institution.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => handleSort('total_foreign_students')}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        Number of students {getSortIcon('total_foreign_students')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('origin_country')}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        Origin Country {getSortIcon('origin_country')}
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
                  {paginatedStudents.map((student) => (
                    <TableRow key={student._id || student.id}>
                      <TableCell className="font-medium">{student.total_foreign_students || 0}</TableCell>
                      <TableCell>{student.origin_country_name || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate" title={student.remarks}>
                        {student.remarks || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(student)}
                            className="h-8 w-8 p-0"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student)}
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student)}
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
          {filteredAndSortedStudents.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedStudents.length)} of {filteredAndSortedStudents.length} entries
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

      {/* Student Form Modal */}
      <StudentFormModal
        open={showStudentModal}
        onOpenChange={(open) => {
          if (!open && !submitting && !loadingStudent) {
            setShowStudentModal(false);
            setFormData(buildInitialForm());
            setEditingStudent(null);
            setViewingStudent(null);
            setIsViewMode(false);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Student Details' : editingStudent ? 'Edit Student' : 'Add Student'}
        submitLabel={editingStudent ? 'Save Changes' : 'Add Student'}
        submitting={submitting || loadingStudent}
        madarisId={madarisId}
        viewMode={isViewMode}
        countries={countries}
        loadingCountries={loadingCountries}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={studentToDeleteId}
        message="Are you sure you want to delete this student record? This action cannot be undone."
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Student"
      />
    </>
  );
};

export default MadarisStudents;
