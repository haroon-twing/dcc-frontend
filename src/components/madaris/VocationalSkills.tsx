import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Briefcase, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import VocationalSkillFormModal from '../modals/madaris/VocationalSkillFormModal';

interface VocationalSkill {
  _id?: string;
  id?: string;
  madaris_id: string;
  voc_skill_offered: string;
  age_group_offered: string;
  remarks?: string;
}

interface VocationalSkillFormState {
  voc_skill_offered: string;
  age_group_offered: string;
  remarks: string;
}

interface VocationalSkillsProps {
  madarisId: string;
}

const VocationalSkills: React.FC<VocationalSkillsProps> = ({ madarisId }) => {
  const [skills, setSkills] = useState<VocationalSkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<VocationalSkill | null>(null);
  const [viewingSkill, setViewingSkill] = useState<VocationalSkill | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSkill, setLoadingSkill] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [skillToDeleteId, setSkillToDeleteId] = useState<string | number | undefined>(undefined);
  const [skillToDeleteName, setSkillToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<VocationalSkillFormState>({
    voc_skill_offered: '',
    age_group_offered: '',
    remarks: '',
  });

  const buildInitialForm = (): VocationalSkillFormState => ({
    voc_skill_offered: '',
    age_group_offered: '',
    remarks: '',
  });

  const fetchSkills = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setSkills([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-teaching-vocational-skills/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const skillsData: VocationalSkill[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        madaris_id: item.madaris_id || madarisId,
        voc_skill_offered: item.voc_skill_offered || '',
        age_group_offered: item.age_group_offered || '',
        remarks: item.remarks || '',
      }));

      setSkills(skillsData);
    } catch (err: any) {
      console.error('Error fetching vocational skills:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load vocational skills. Please try again.'
      );
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId]);

  useEffect(() => {
    if (madarisId) {
      fetchSkills();
    }
  }, [madarisId, fetchSkills]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingSkill(null);
    setViewingSkill(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (skill: VocationalSkill) => {
    const skillId = skill._id || skill.id;
    if (!skillId) {
      alert('Skill ID is missing. Cannot load skill details.');
      return;
    }

    setLoadingSkill(true);
    setViewingSkill(skill);
    setEditingSkill(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/madaris/get-teaching-vocational-skills/skill/${skillId}`;
      const response = await publicApi.get(viewEndpoint);
      const skillData = response.data?.data || response.data;

      // Update form data with the fetched skill details
      setFormData({
        voc_skill_offered: skillData.voc_skill_offered || '',
        age_group_offered: skillData.age_group_offered || '',
        remarks: skillData.remarks || '',
      });

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching skill details:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load skill details. Please try again.'
      );
      // Still show the modal with existing data as fallback
      setFormData({
        voc_skill_offered: skill.voc_skill_offered || '',
        age_group_offered: skill.age_group_offered || '',
        remarks: skill.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingSkill(false);
    }
  };

  const handleEdit = (skill: VocationalSkill) => {
    setFormData({
      voc_skill_offered: skill.voc_skill_offered || '',
      age_group_offered: skill.age_group_offered || '',
      remarks: skill.remarks || '',
    });
    setEditingSkill(skill);
    setViewingSkill(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (skill: VocationalSkill) => {
    const skillId = skill._id || skill.id;
    if (skillId) {
      setSkillToDeleteId(skillId);
      setSkillToDeleteName(skill.voc_skill_offered || 'this vocational skill');
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-teaching-vocational-skills/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setSkillToDeleteId(undefined);
      setSkillToDeleteName('');
      await fetchSkills();
    } catch (error: any) {
      console.error('Error deleting vocational skill:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete vocational skill. Please try again.'
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
        voc_skill_offered: formData.voc_skill_offered,
        age_group_offered: formData.age_group_offered,
        remarks: formData.remarks || '',
        madaris_id: madarisId,
      };

      if (editingSkill) {
        const skillId = editingSkill._id || editingSkill.id;
        if (!skillId) {
          throw new Error('Skill ID is required for update');
        }
        const updateEndpoint = `/madaris/update-teaching-vocational-skills/${skillId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-teaching-vocational-skills';
        await api.post(addEndpoint, payload);
      }

      // Refetch data after add/edit
      await fetchSkills();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingSkill(null);
      setViewingSkill(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving vocational skill:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingSkill ? 'update' : 'add'} vocational skill. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedSkills = useMemo(() => {
    let filtered = skills;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = skills.filter((skill) => {
        return (
          (skill.voc_skill_offered || '').toLowerCase().includes(searchLower) ||
          (skill.age_group_offered || '').toLowerCase().includes(searchLower) ||
          (skill.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'voc_skill_offered':
            aValue = (a.voc_skill_offered || '').toLowerCase();
            bValue = (b.voc_skill_offered || '').toLowerCase();
            break;
          case 'age_group_offered':
            aValue = (a.age_group_offered || '').toLowerCase();
            bValue = (b.age_group_offered || '').toLowerCase();
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
  }, [skills, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedSkills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedSkills.slice(startIndex, endIndex);
  }, [filteredAndSortedSkills, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage);

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
                <Briefcase className="h-5 w-5" />
                Vocational Skills
              </CardTitle>
              <CardDescription>Vocational skills programs offered by this institution</CardDescription>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Vocational Skill
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vocational skills..."
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
            <span className="ml-2 text-muted-foreground">Loading vocational skills...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSkills()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedSkills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No vocational skills found matching your search.' : 'No vocational skills found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('voc_skill_offered')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Vocational Skill Offered {getSortIcon('voc_skill_offered')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('age_group_offered')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Age Group Offered {getSortIcon('age_group_offered')}
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
                {paginatedSkills.map((skill) => (
                  <TableRow key={skill._id || skill.id}>
                    <TableCell className="font-medium">{skill.voc_skill_offered || 'N/A'}</TableCell>
                    <TableCell>{skill.age_group_offered || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={skill.remarks}>
                      {skill.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(skill)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(skill)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(skill)}
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
        {filteredAndSortedSkills.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedSkills.length)} of {filteredAndSortedSkills.length} entries
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

      {/* Vocational Skill Form Modal */}
      <VocationalSkillFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!submitting) {
            setShowModal(open);
            if (!open) {
              setFormData(buildInitialForm());
              setEditingSkill(null);
              setViewingSkill(null);
              setIsViewMode(false);
            }
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Vocational Skill' : editingSkill ? 'Edit Vocational Skill' : 'Add Vocational Skill'}
        submitLabel={editingSkill ? 'Save Changes' : 'Add Vocational Skill'}
        submitting={submitting || loadingSkill}
        madarisId={madarisId}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={skillToDeleteId}
        message={`Are you sure you want to delete "${skillToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Vocational Skill"
      />
    </Card>
  );
};

export default VocationalSkills;
