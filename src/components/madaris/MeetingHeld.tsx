import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Calendar, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import MeetingFormModal from '../modals/madaris/MeetingFormModal';

interface Participant {
  name: string;
  designation: string;
  organization: string;
}

interface Meeting {
  _id?: string;
  id?: string;
  date: string;
  agenda: string;
  participants?: Participant[];
  location: string;
  decision_made: string;
  notes?: string;
  madaris_id: string;
}

interface MeetingFormState {
  date: string;
  agenda: string;
  participants: Participant[];
  location: string;
  decision_made: string;
  notes: string;
}

interface MeetingHeldProps {
  madarisId: string;
}

const MeetingHeld: React.FC<MeetingHeldProps> = ({ madarisId }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [viewingMeeting, setViewingMeeting] = useState<Meeting | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMeeting, setLoadingMeeting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [meetingToDeleteId, setMeetingToDeleteId] = useState<string | number | undefined>(undefined);
  const [meetingToDeleteName, setMeetingToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<MeetingFormState>({
    date: '',
    agenda: '',
    participants: [],
    location: '',
    decision_made: '',
    notes: '',
  });

  const buildInitialForm = (): MeetingFormState => ({
    date: '',
    agenda: '',
    participants: [],
    location: '',
    decision_made: '',
    notes: '',
  });

  const fetchMeetings = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setMeetings([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-meetings/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const meetingsData: Meeting[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        madaris_id: item.madaris_id || madarisId,
        date: item.date || '',
        agenda: item.agenda || '',
        participants: item.participants || [],
        location: item.location || '',
        decision_made: item.decision_made || '',
        notes: item.notes || '',
      }));

      setMeetings(meetingsData);
    } catch (err: any) {
      console.error('Error fetching meetings:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load meetings. Please try again.'
      );
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId]);

  useEffect(() => {
    if (madarisId) {
      fetchMeetings();
    }
  }, [madarisId, fetchMeetings]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatParticipants = (participants?: Participant[]) => {
    if (!participants || participants.length === 0) return 'N/A';
    return participants.map(p => `${p.name} (${p.designation}, ${p.organization})`).join(', ');
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingMeeting(null);
    setViewingMeeting(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (meeting: Meeting) => {
    const meetingId = meeting._id || meeting.id;
    if (!meetingId) {
      alert('Meeting ID is missing. Cannot load meeting details.');
      return;
    }

    setLoadingMeeting(true);
    setViewingMeeting(meeting);
    setEditingMeeting(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/madaris/get-single-meeting/${meetingId}`;
      const response = await publicApi.get(viewEndpoint);
      const meetingData = response.data?.data || response.data;

      setFormData({
        date: meetingData.date || '',
        agenda: meetingData.agenda || '',
        participants: meetingData.participants || [],
        location: meetingData.location || '',
        decision_made: meetingData.decision_made || '',
        notes: meetingData.notes || '',
      });

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching meeting details:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load meeting details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        date: meeting.date || '',
        agenda: meeting.agenda || '',
        participants: meeting.participants || [],
        location: meeting.location || '',
        decision_made: meeting.decision_made || '',
        notes: meeting.notes || '',
      });
      setShowModal(true);
    } finally {
      setLoadingMeeting(false);
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setFormData({
      date: meeting.date || '',
      agenda: meeting.agenda || '',
      participants: meeting.participants || [],
      location: meeting.location || '',
      decision_made: meeting.decision_made || '',
      notes: meeting.notes || '',
    });
    setEditingMeeting(meeting);
    setViewingMeeting(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (meeting: Meeting) => {
    const meetingId = meeting._id || meeting.id;
    const meetingName = meeting.agenda || 'this meeting';
    if (meetingId) {
      setMeetingToDeleteId(meetingId);
      setMeetingToDeleteName(meetingName);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-meeting/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setMeetingToDeleteId(undefined);
      setMeetingToDeleteName('');
      await fetchMeetings();
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete meeting. Please try again.'
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
        date: formData.date,
        agenda: formData.agenda,
        participants: formData.participants,
        location: formData.location,
        decision_made: formData.decision_made,
        notes: formData.notes || '',
        madaris_id: madarisId,
      };

      if (editingMeeting) {
        const meetingId = editingMeeting._id || editingMeeting.id;
        if (!meetingId) {
          throw new Error('Meeting ID is required for update');
        }
        const updateEndpoint = `/madaris/update-meeting/${meetingId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-meeting';
        await api.post(addEndpoint, payload);
      }

      await fetchMeetings();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingMeeting(null);
      setViewingMeeting(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving meeting:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingMeeting ? 'update' : 'add'} meeting. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedMeetings = useMemo(() => {
    let filtered = meetings;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = meetings.filter((meeting) => {
        return (
          formatDate(meeting.date).toLowerCase().includes(searchLower) ||
          (meeting.agenda || '').toLowerCase().includes(searchLower) ||
          formatParticipants(meeting.participants).toLowerCase().includes(searchLower) ||
          (meeting.location || '').toLowerCase().includes(searchLower) ||
          (meeting.decision_made || '').toLowerCase().includes(searchLower) ||
          (meeting.notes || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'date':
            aValue = new Date(a.date || 0).getTime();
            bValue = new Date(b.date || 0).getTime();
            break;
          case 'agenda':
            aValue = (a.agenda || '').toLowerCase();
            bValue = (b.agenda || '').toLowerCase();
            break;
          case 'participants':
            aValue = formatParticipants(a.participants).toLowerCase();
            bValue = formatParticipants(b.participants).toLowerCase();
            break;
          case 'location':
            aValue = (a.location || '').toLowerCase();
            bValue = (b.location || '').toLowerCase();
            break;
          case 'decision_made':
            aValue = (a.decision_made || '').toLowerCase();
            bValue = (b.decision_made || '').toLowerCase();
            break;
          case 'notes':
            aValue = (a.notes || '').toLowerCase();
            bValue = (b.notes || '').toLowerCase();
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
  }, [meetings, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedMeetings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedMeetings.slice(startIndex, endIndex);
  }, [filteredAndSortedMeetings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedMeetings.length / itemsPerPage);

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
                <Calendar className="h-5 w-5" />
                Meeting Held
              </CardTitle>
              <CardDescription>Meetings held at this institution</CardDescription>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Meeting
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search meetings..."
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
            <span className="ml-2 text-muted-foreground">Loading meetings...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchMeetings()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedMeetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No meetings found matching your search.' : 'No meetings found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Date {getSortIcon('date')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('agenda')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Agenda {getSortIcon('agenda')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('participants')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Participants {getSortIcon('participants')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('location')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Location {getSortIcon('location')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('decision_made')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Decision Made {getSortIcon('decision_made')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('notes')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Notes {getSortIcon('notes')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMeetings.map((meeting) => (
                  <TableRow key={meeting._id || meeting.id}>
                    <TableCell>{formatDate(meeting.date)}</TableCell>
                    <TableCell className="font-medium">{meeting.agenda || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={formatParticipants(meeting.participants)}>
                        {formatParticipants(meeting.participants)}
                      </div>
                    </TableCell>
                    <TableCell>{meeting.location || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={meeting.decision_made}>
                      {meeting.decision_made || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={meeting.notes}>
                      {meeting.notes || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(meeting)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(meeting)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(meeting)}
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
        {filteredAndSortedMeetings.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedMeetings.length)} of {filteredAndSortedMeetings.length} entries
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

      {/* Meeting Form Modal */}
      <MeetingFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!submitting && !loadingMeeting) {
            setShowModal(open);
            if (!open) {
              setFormData(buildInitialForm());
              setEditingMeeting(null);
              setViewingMeeting(null);
              setIsViewMode(false);
            }
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Meeting' : editingMeeting ? 'Edit Meeting' : 'Add Meeting'}
        submitLabel={editingMeeting ? 'Save Changes' : 'Add Meeting'}
        submitting={submitting || loadingMeeting}
        madarisId={madarisId}
        meetingId={editingMeeting?._id || editingMeeting?.id}
        viewMode={isViewMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setShowDeleteModal(false);
            setMeetingToDeleteId(undefined);
            setMeetingToDeleteName('');
          }
        }}
        id={meetingToDeleteId}
        message={`Are you sure you want to delete meeting "${meetingToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Meeting"
      />
    </Card>
  );
};

export default MeetingHeld;
