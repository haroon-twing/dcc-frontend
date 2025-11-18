import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { GraduationCap, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import TeacherSupportFormModal from '../modals/madaris/TeacherSupportFormModal';

interface Teacher {
  _id?: string;
  id?: string;
  full_name: string;
}

interface TeacherSupport {
  _id?: string;
  id?: string;
  teacher_id?: string;
  education_obtain: string;
  edu_from: string;
  remarks?: string;
  madaris_id: string;
  teacher_name?: string;
}

interface TeacherSupportFormState {
  teacher_id: string;
  education_obtain: string;
  edu_from: string;
  remarks: string;
}

interface TeachersSupportHEProps {
  madarisId: string;
}

const TeachersSupportHE: React.FC<TeachersSupportHEProps> = ({ madarisId }) => {
  const [supports, setSupports] = useState<TeacherSupport[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSupport, setEditingSupport] = useState<TeacherSupport | null>(null);
  const [viewingSupport, setViewingSupport] = useState<TeacherSupport | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [loadingSupport, setLoadingSupport] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [supportToDeleteId, setSupportToDeleteId] = useState<string | number | undefined>(undefined);
  const [supportToDeleteName, setSupportToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<TeacherSupportFormState>({
    teacher_id: '',
    education_obtain: '',
    edu_from: '',
    remarks: '',
  });

  const buildInitialForm = (): TeacherSupportFormState => ({
    teacher_id: '',
    education_obtain: '',
    edu_from: '',
    remarks: '',
  });

  const fetchTeachers = useCallback(async (): Promise<Teacher[]> => {
    if (!madarisId) {
      setTeachers([]);
      return [];
    }

    try {
      setLoadingTeachers(true);
      const endpoint = `/madaris/get-all-madaris-teachers/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const teachersData: Teacher[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        full_name: item.full_name || 'N/A',
      }));

      setTeachers(teachersData);
      return teachersData;
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
      return [];
    } finally {
      setLoadingTeachers(false);
    }
  }, [madarisId]);

  const isValidObjectId = (id: string): boolean => {
    if (!id || typeof id !== 'string') return false;
    const trimmed = id.trim();
    return /^[0-9a-fA-F]{24}$/.test(trimmed);
  };

  const fetchSingleTeacher = useCallback(async (teacherId: string): Promise<string> => {
    if (!teacherId || !isValidObjectId(teacherId)) {
      return 'N/A';
    }

    try {
      const endpoint = `/madaris/get-single-madaris-teacher/${teacherId}`;
      const response = await publicApi.get(endpoint);
      const teacherData = response.data?.data || response.data;
      return teacherData?.full_name || teacherData?.name || 'N/A';
    } catch (err: any) {
      console.error('Error fetching single teacher:', err);
      return 'N/A';
    }
  }, []);

  const fetchSupports = useCallback(async (teachersList?: Teacher[]) => {
    if (!madarisId) {
      setLoading(false);
      setSupports([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-teachers-support-high-education/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const supportsData: TeacherSupport[] = await Promise.all(
        data.map(async (item: any) => {
          let teacherId = '';
          let teacherName = '';
          
          // Extract teacher_id - handle both object and string formats
          if (item.teacher_id) {
            if (typeof item.teacher_id === 'object' && item.teacher_id !== null) {
              // If teacher_id is an object (populated), extract _id and name
              teacherId = item.teacher_id._id || item.teacher_id.id || '';
              teacherName = item.teacher_id.full_name || item.teacher_id.name || '';
            } else if (typeof item.teacher_id === 'string') {
              // If teacher_id is already a string
              teacherId = item.teacher_id;
            }
          } else if (item.teacherId) {
            if (typeof item.teacherId === 'object' && item.teacherId !== null) {
              teacherId = item.teacherId._id || item.teacherId.id || '';
              teacherName = item.teacherId.full_name || item.teacherId.name || '';
            } else if (typeof item.teacherId === 'string') {
              teacherId = item.teacherId;
            }
          } else if (item.teacher) {
            if (typeof item.teacher === 'object' && item.teacher !== null) {
              teacherId = item.teacher._id || item.teacher.id || '';
              teacherName = item.teacher.full_name || item.teacher.name || '';
            } else if (typeof item.teacher === 'string') {
              teacherId = item.teacher;
            }
          }
          
          // Fallback to item.teacher_name if we still don't have a name
          if (!teacherName) {
            teacherName = item.teacher_name || '';
          }
          
          const teacherIdString = String(teacherId).trim();
          
          // Only fetch if we have a valid ObjectId and no name yet
          if (teacherIdString && isValidObjectId(teacherIdString) && !teacherName) {
            teacherName = await fetchSingleTeacher(teacherIdString);
          }

          return {
            _id: item._id || item.id,
            id: item._id || item.id,
            teacher_id: teacherIdString,
            madaris_id: item.madaris_id || madarisId,
            education_obtain: item.education_obtain || '',
            edu_from: item.edu_from || '',
            remarks: item.remarks || '',
            teacher_name: teacherName || 'N/A',
          };
        })
      );

      setSupports(supportsData);
    } catch (err: any) {
      console.error('Error fetching teacher support:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load teacher support records. Please try again.'
      );
      setSupports([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId, fetchSingleTeacher]);

  useEffect(() => {
    if (!madarisId) return;

    const loadData = async () => {
      await fetchTeachers();
      await fetchSupports();
    };

    loadData();
  }, [madarisId, fetchTeachers, fetchSupports]);

  const handleAdd = async () => {
    if (teachers.length === 0 && !loadingTeachers) {
      await fetchTeachers();
    }
    
    setFormData(buildInitialForm());
    setEditingSupport(null);
    setViewingSupport(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (support: TeacherSupport) => {
    const supportId = support._id || support.id;
    if (!supportId) {
      alert('Support ID is missing. Cannot load support details.');
      return;
    }

    // Ensure teachers are loaded before opening the modal
    let currentTeachers = teachers;
    if (currentTeachers.length === 0 && !loadingTeachers) {
      currentTeachers = await fetchTeachers();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setLoadingSupport(true);
    setViewingSupport(support);
    setEditingSupport(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/madaris/get-single-teacher-support-high-education/${supportId}`;
      const response = await publicApi.get(viewEndpoint);
      const supportData = response.data?.data || response.data;

      let teacherId = '';
      let teacherName = '';
      
      // Extract teacher_id - handle both object and string formats
      if (supportData.teacher_id) {
        if (typeof supportData.teacher_id === 'object' && supportData.teacher_id !== null) {
          // If teacher_id is an object (populated), extract _id and name
          teacherId = supportData.teacher_id._id || supportData.teacher_id.id || '';
          teacherName = supportData.teacher_id.full_name || supportData.teacher_id.name || '';
        } else if (typeof supportData.teacher_id === 'string') {
          // If teacher_id is already a string
          teacherId = supportData.teacher_id;
        }
      }
      
      // Fallback to support.teacher_name if we still don't have a name
      if (!teacherName) {
        teacherName = support.teacher_name || '';
      }
      
      const teacherIdString = String(teacherId).trim();
      
      // If teacher_id is empty but teacher_name exists, try to find teacher by name
      if (!teacherIdString && teacherName && currentTeachers.length > 0) {
        const foundTeacher = currentTeachers.find(t => 
          t.full_name?.toLowerCase().trim() === teacherName?.toLowerCase().trim()
        );
        if (foundTeacher) {
          teacherId = String(foundTeacher._id || foundTeacher.id || '').trim();
        }
      }
      
      // Fetch teacher name if we have a valid ObjectId but no name yet
      if (teacherIdString && isValidObjectId(teacherIdString) && !teacherName) {
        teacherName = await fetchSingleTeacher(teacherIdString);
        setSupports(prevSupports => 
          prevSupports.map(s => 
            s._id === support._id || s.id === support.id 
              ? { ...s, teacher_name: teacherName }
              : s
          )
        );
      }

      // Use teacherId if found by name, otherwise use teacherIdString
      const finalTeacherId = teacherId || teacherIdString;
      
      // Ensure the teacher is in the teachers list
      if (finalTeacherId && isValidObjectId(finalTeacherId)) {
        const teacherInList = currentTeachers.find(t => {
          const tId = String(t._id || t.id || '').trim();
          return tId === finalTeacherId;
        });
        
        // If teacher is not in the list, fetch it and add to list
        if (!teacherInList) {
          try {
            const fetchedTeacherName = teacherName || await fetchSingleTeacher(finalTeacherId);
            if (fetchedTeacherName && fetchedTeacherName !== 'N/A') {
              const newTeacher: Teacher = {
                _id: finalTeacherId,
                id: finalTeacherId,
                full_name: fetchedTeacherName
              };
              setTeachers(prev => [...prev, newTeacher]);
            }
          } catch (err) {
            console.error('Error fetching teacher for view:', err);
          }
        }
      }

      setFormData({
        teacher_id: finalTeacherId,
        education_obtain: supportData.education_obtain || '',
        edu_from: supportData.edu_from || '',
        remarks: supportData.remarks || '',
      });

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching teacher support details:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load teacher support details. Please try again.'
      );
      
      // Fallback: use data from the support object
      let teacherId = '';
      if (support.teacher_id) {
        if (typeof support.teacher_id === 'object' && support.teacher_id !== null) {
          const teacherObj = support.teacher_id as any;
          teacherId = teacherObj._id || teacherObj.id || '';
        } else {
          teacherId = String(support.teacher_id).trim();
        }
      }
      
      // If teacher_id is empty but teacher_name exists, try to find teacher by name
      if (!teacherId && support.teacher_name && currentTeachers.length > 0) {
        const foundTeacher = currentTeachers.find(t => 
          t.full_name?.toLowerCase().trim() === support.teacher_name?.toLowerCase().trim()
        );
        if (foundTeacher) {
          teacherId = String(foundTeacher._id || foundTeacher.id || '').trim();
        }
      }
      
      let teacherName = support.teacher_name || '';
      
      if (teacherId && isValidObjectId(teacherId) && !teacherName) {
        teacherName = await fetchSingleTeacher(teacherId);
      }
      
      // Ensure the teacher is in the teachers list
      if (teacherId && isValidObjectId(teacherId)) {
        const teacherInList = currentTeachers.find(t => {
          const tId = String(t._id || t.id || '').trim();
          return tId === teacherId;
        });
        
        if (!teacherInList && teacherName) {
          const newTeacher: Teacher = {
            _id: teacherId,
            id: teacherId,
            full_name: teacherName
          };
          setTeachers(prev => [...prev, newTeacher]);
        }
      }
      
      setFormData({
        teacher_id: teacherId,
        education_obtain: support.education_obtain || '',
        edu_from: support.edu_from || '',
        remarks: support.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingSupport(false);
    }
  };

  const handleEdit = async (support: TeacherSupport) => {
    // Ensure teachers are loaded before opening the modal
    let currentTeachers = teachers;
    if (currentTeachers.length === 0 && !loadingTeachers) {
      currentTeachers = await fetchTeachers();
      // Small delay to ensure state has propagated
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Extract teacher_id - ensure it's a valid string
    let teacherId = '';
    if (support.teacher_id) {
      // Handle both object and string formats
      if (typeof support.teacher_id === 'object' && support.teacher_id !== null) {
        const teacherObj = support.teacher_id as any;
        teacherId = teacherObj._id || teacherObj.id || '';
      } else {
        teacherId = String(support.teacher_id).trim();
      }
    }
    
    // If teacher_id is empty but teacher_name exists, try to find teacher by name
    if (!teacherId && support.teacher_name && currentTeachers.length > 0) {
      const foundTeacher = currentTeachers.find(t => 
        t.full_name?.toLowerCase().trim() === support.teacher_name?.toLowerCase().trim()
      );
      if (foundTeacher) {
        teacherId = String(foundTeacher._id || foundTeacher.id || '').trim();
      }
    }
    
    // If we still don't have teacher_id but have teacher_name, try to fetch by searching
    // This is a fallback - ideally teacher_id should always be present
    if (!teacherId && support.teacher_name && isValidObjectId(support.teacher_name)) {
      // If teacher_name is actually an ID (edge case)
      teacherId = String(support.teacher_name).trim();
    }
    
    // Fetch teacher name if we have teacher_id but no name
    if (teacherId && isValidObjectId(teacherId) && !support.teacher_name) {
      const teacherName = await fetchSingleTeacher(teacherId);
      if (teacherName && teacherName !== 'N/A') {
        support.teacher_name = teacherName;
        setSupports(prevSupports => 
          prevSupports.map(s => 
            s._id === support._id || s.id === support.id 
              ? { ...s, teacher_name: teacherName }
              : s
          )
        );
      }
    }
    
    // Ensure the teacher is in the teachers list
    if (teacherId && isValidObjectId(teacherId)) {
      const teacherInList = currentTeachers.find(t => {
        const tId = String(t._id || t.id || '').trim();
        return tId === teacherId;
      });
      
      // If teacher is not in the list, fetch it and add to list
      if (!teacherInList) {
        try {
          const teacherName = support.teacher_name || await fetchSingleTeacher(teacherId);
          if (teacherName && teacherName !== 'N/A') {
            const newTeacher: Teacher = {
              _id: teacherId,
              id: teacherId,
              full_name: teacherName
            };
            setTeachers(prev => [...prev, newTeacher]);
          }
        } catch (err) {
          console.error('Error fetching teacher for edit:', err);
        }
      }
    }
    
    setFormData({
      teacher_id: teacherId,
      education_obtain: support.education_obtain || '',
      edu_from: support.edu_from || '',
      remarks: support.remarks || '',
    });
    setEditingSupport(support);
    setViewingSupport(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (support: TeacherSupport) => {
    const supportId = support._id || support.id;
    if (supportId) {
      setSupportToDeleteId(supportId);
      const displayName = support.teacher_name 
        ? `teacher support for ${support.teacher_name}` 
        : support.education_obtain || 'this teacher support';
      setSupportToDeleteName(displayName);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-teachers-support-high-education/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setSupportToDeleteId(undefined);
      setSupportToDeleteName('');
      await fetchSupports();
    } catch (error: any) {
      console.error('Error deleting teacher support:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete teacher support. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate teacher_id is selected
      if (!formData.teacher_id) {
        alert('Please select a teacher.');
        setSubmitting(false);
        return;
      }

      const payload = {
        teacher_id: formData.teacher_id,
        education_obtain: formData.education_obtain,
        edu_from: formData.edu_from,
        remarks: formData.remarks || '',
        madaris_id: madarisId,
      };

      if (editingSupport) {
        const supportId = editingSupport._id || editingSupport.id;
        if (!supportId) {
          throw new Error('Support ID is required for update');
        }
        const updateEndpoint = `/madaris/update-teachers-support-high-education/${supportId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-teachers-support-high-education';
        await api.post(addEndpoint, payload);
      }

      await fetchSupports();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingSupport(null);
      setViewingSupport(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving teacher support:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingSupport ? 'update' : 'add'} teacher support. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedSupports = useMemo(() => {
    let filtered = supports;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = supports.filter((support) => {
        return (
          (support.teacher_name || '').toLowerCase().includes(searchLower) ||
          (support.education_obtain || '').toLowerCase().includes(searchLower) ||
          (support.edu_from || '').toLowerCase().includes(searchLower) ||
          (support.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'teacher':
            aValue = (a.teacher_name || '').toLowerCase();
            bValue = (b.teacher_name || '').toLowerCase();
            break;
          case 'education_obtain':
            aValue = (a.education_obtain || '').toLowerCase();
            bValue = (b.education_obtain || '').toLowerCase();
            break;
          case 'edu_from':
            aValue = (a.edu_from || '').toLowerCase();
            bValue = (b.edu_from || '').toLowerCase();
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
  }, [supports, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedSupports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedSupports.slice(startIndex, endIndex);
  }, [filteredAndSortedSupports, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedSupports.length / itemsPerPage);

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
                <GraduationCap className="h-5 w-5" />
                Teachers Support (HE)
              </CardTitle>
              <CardDescription>Higher education support provided to teachers</CardDescription>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Teacher Support
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teacher support..."
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
            <span className="ml-2 text-muted-foreground">Loading teacher support records...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSupports()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedSupports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No teacher support records found matching your search.' : 'No teacher support records found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('teacher')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Teacher {getSortIcon('teacher')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('education_obtain')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Education Obtained {getSortIcon('education_obtain')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('edu_from')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Education From {getSortIcon('edu_from')}
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
                {paginatedSupports.map((support) => (
                  <TableRow key={support._id || support.id}>
                    <TableCell className="font-medium">
                      {support.teacher_name || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{support.education_obtain || 'N/A'}</TableCell>
                    <TableCell>{support.edu_from || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={support.remarks}>
                      {support.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(support)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(support)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(support)}
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
        {filteredAndSortedSupports.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedSupports.length)} of {filteredAndSortedSupports.length} entries
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

      {/* Teacher Support Form Modal */}
      <TeacherSupportFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!submitting) {
            setShowModal(open);
            if (!open) {
              setFormData(buildInitialForm());
              setEditingSupport(null);
              setViewingSupport(null);
              setIsViewMode(false);
            }
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Teacher Support' : editingSupport ? 'Edit Teacher Support' : 'Add Teacher Support'}
        submitLabel={editingSupport ? 'Save Changes' : 'Add Teacher Support'}
        submitting={submitting || loadingSupport}
        madarisId={madarisId}
        viewMode={isViewMode}
        teachers={teachers}
        loadingTeachers={loadingTeachers}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={supportToDeleteId}
        message={`Are you sure you want to delete teacher support "${supportToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Teacher Support"
      />
    </Card>
  );
};

export default TeachersSupportHE;
