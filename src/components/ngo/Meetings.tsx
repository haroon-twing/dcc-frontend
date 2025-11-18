import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Calendar, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import MeetingFormModal from '../modals/ngo/MeetingFormModal';

interface Meeting {
  _id?: string;
  id?: string;
  ngo_id: string;
  meeting_conducting_authority?: string;
  no_of_participants?: number;
  conducted_on_date?: string;
  venue?: string;
  agenda?: string;
  decision_taken?: string;
  remarks?: string;
}

interface MeetingFormState {
  meeting_conducting_authority: string;
  no_of_participants: number;
  conducted_on_date: string;
  venue: string;
  agenda: string;
  decision_taken: string;
  remarks: string;
}

interface MeetingsProps {
  ngoId: string;
}

const Meetings: React.FC<MeetingsProps> = ({ ngoId }) => {
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
    meeting_conducting_authority: '',
    no_of_participants: 0,
    conducted_on_date: '',
    venue: '',
    agenda: '',
    decision_taken: '',
    remarks: '',
  });

  const buildInitialForm = (): MeetingFormState => ({
    meeting_conducting_authority: '',
    no_of_participants: 0,
    conducted_on_date: '',
    venue: '',
    agenda: '',
    decision_taken: '',
    remarks: '',
  });

  const fetchMeetings = useCallback(async () => {
    if (!ngoId) {
      setLoading(false);
      setMeetings([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/ngo/get-all-ngo-meetings/${ngoId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const meetingsData: Meeting[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        ngo_id: item.ngo_id || ngoId,
        meeting_conducting_authority: item.meeting_conducting_authority || '',
        no_of_participants: item.no_of_participants || 0,
        conducted_on_date: item.conducted_on_date || '',
        venue: item.venue || '',
        agenda: item.agenda || '',
        decision_taken: item.decision_taken || '',
        remarks: item.remarks || '',
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
  }, [ngoId]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

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
      window.alert('Meeting ID is missing. Cannot load meeting details.');
      return;
    }

    setLoadingMeeting(true);
    setViewingMeeting(meeting);
    setEditingMeeting(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/ngo/get-single-ngo-meeting/${meetingId}`;
      const response = await publicApi.get(viewEndpoint);
      const meetingData = response.data?.data || response.data;

      if (meetingData) {
        setFormData({
          meeting_conducting_authority: meetingData.meeting_conducting_authority || '',
          no_of_participants: meetingData.no_of_participants || 0,
          conducted_on_date: meetingData.conducted_on_date || '',
          venue: meetingData.venue || '',
          agenda: meetingData.agenda || '',
          decision_taken: meetingData.decision_taken || '',
          remarks: meetingData.remarks || '',
        });
      } else {
        // Fallback to meeting data from table if API doesn't return data
        setFormData({
          meeting_conducting_authority: meeting.meeting_conducting_authority || '',
          no_of_participants: meeting.no_of_participants || 0,
          conducted_on_date: meeting.conducted_on_date || '',
          venue: meeting.venue || '',
          agenda: meeting.agenda || '',
          decision_taken: meeting.decision_taken || '',
          remarks: meeting.remarks || '',
        });
      }

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching meeting details:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load meeting details. Please try again.'
      );
      // Still show the modal with existing data as fallback
      setFormData({
        meeting_conducting_authority: meeting.meeting_conducting_authority || '',
        no_of_participants: meeting.no_of_participants || 0,
        conducted_on_date: meeting.conducted_on_date || '',
        venue: meeting.venue || '',
        agenda: meeting.agenda || '',
        decision_taken: meeting.decision_taken || '',
        remarks: meeting.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingMeeting(false);
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setFormData({
      meeting_conducting_authority: meeting.meeting_conducting_authority || '',
      no_of_participants: meeting.no_of_participants || 0,
      conducted_on_date: meeting.conducted_on_date || '',
      venue: meeting.venue || '',
      agenda: meeting.agenda || '',
      decision_taken: meeting.decision_taken || '',
      remarks: meeting.remarks || '',
    });
    setEditingMeeting(meeting);
    setViewingMeeting(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (meeting: Meeting) => {
    const meetingId = meeting._id || meeting.id;
    if (meetingId) {
      setMeetingToDeleteId(meetingId);
      setMeetingToDeleteName(meeting.agenda || 'this meeting');
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/ngo/delete-ngo-meeting/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setMeetingToDeleteId(undefined);
      setMeetingToDeleteName('');
      await fetchMeetings();
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      window.alert(
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
        meeting_conducting_authority: formData.meeting_conducting_authority,
        no_of_participants: formData.no_of_participants,
        conducted_on_date: formData.conducted_on_date,
        venue: formData.venue,
        agenda: formData.agenda,
        decision_taken: formData.decision_taken,
        remarks: formData.remarks || '',
        ngo_id: ngoId,
      };

      if (editingMeeting) {
        const meetingId = editingMeeting._id || editingMeeting.id;
        if (!meetingId) {
          throw new Error('Meeting ID is required for update');
        }
        const updateEndpoint = `/ngo/update-ngo-meeting/${meetingId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ngo/add-ngo-meeting/';
        await api.post(addEndpoint, payload);
      }

      // Refetch data after add/edit
      await fetchMeetings();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingMeeting(null);
      setViewingMeeting(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving meeting:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingMeeting ? 'update' : 'add'} meeting. Please try again.`
      );
      setSubmitting(false);
    }
  };

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

  // Filter and sort data
  const filteredAndSortedMeetings = useMemo(() => {
    let filtered = meetings;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = meetings.filter((meeting) => {
        return (
          (meeting.meeting_conducting_authority || '').toLowerCase().includes(searchLower) ||
          (meeting.venue || '').toLowerCase().includes(searchLower) ||
          (meeting.agenda || '').toLowerCase().includes(searchLower) ||
          (meeting.decision_taken || '').toLowerCase().includes(searchLower) ||
          (meeting.remarks || '').toLowerCase().includes(searchLower) ||
          formatDate(meeting.conducted_on_date || '').toLowerCase().includes(searchLower) ||
          String(meeting.no_of_participants || 0).includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'conducted_on_date':
            aValue = new Date(a.conducted_on_date || 0).getTime();
            bValue = new Date(b.conducted_on_date || 0).getTime();
            break;
          case 'meeting_conducting_authority':
            aValue = (a.meeting_conducting_authority || '').toLowerCase();
            bValue = (b.meeting_conducting_authority || '').toLowerCase();
            break;
          case 'no_of_participants':
            aValue = a.no_of_participants || 0;
            bValue = b.no_of_participants || 0;
            break;
          case 'venue':
            aValue = (a.venue || '').toLowerCase();
            bValue = (b.venue || '').toLowerCase();
            break;
          case 'agenda':
            aValue = (a.agenda || '').toLowerCase();
            bValue = (b.agenda || '').toLowerCase();
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meetings
          </CardTitle>
          <CardDescription>Meeting records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading meetings...</p>
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
            <Calendar className="h-5 w-5" />
            Meetings
          </CardTitle>
          <CardDescription>Meeting records for this NGO</CardDescription>
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
                <Calendar className="h-5 w-5" />
                Meetings
              </CardTitle>
              <CardDescription>Meeting records for this NGO</CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2" onClick={handleAdd}>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('conducted_on_date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Conducted On Date {getSortIcon('conducted_on_date')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('meeting_conducting_authority')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Meeting Conducting Authority {getSortIcon('meeting_conducting_authority')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_of_participants')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    No. of Participants {getSortIcon('no_of_participants')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('venue')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Venue {getSortIcon('venue')}
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
                <TableHead>Decision Taken</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No meetings found matching your search.' : 'No meetings found for this NGO.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMeetings.map((meeting) => (
                  <TableRow key={meeting._id || meeting.id}>
                    <TableCell>{formatDate(meeting.conducted_on_date || '')}</TableCell>
                    <TableCell className="font-medium">{meeting.meeting_conducting_authority || 'N/A'}</TableCell>
                    <TableCell>{meeting.no_of_participants || 0}</TableCell>
                    <TableCell>{meeting.venue || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={meeting.agenda}>
                      {meeting.agenda || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={meeting.decision_taken}>
                      {meeting.decision_taken || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={meeting.remarks}>
                      {meeting.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View"
                          onClick={() => handleView(meeting)}
                          disabled={loadingMeeting}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Edit"
                          onClick={() => handleEdit(meeting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                          onClick={() => handleDelete(meeting)}
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

      {/* Form Modal */}
      <MeetingFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setFormData(buildInitialForm());
            setEditingMeeting(null);
            setViewingMeeting(null);
            setIsViewMode(false);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={
          isViewMode
            ? 'View Meeting'
            : editingMeeting
            ? 'Edit Meeting'
            : 'Add Meeting'
        }
        submitLabel={editingMeeting ? 'Update' : 'Save'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteSubmit}
        id={meetingToDeleteId}
        message={`Are you sure you want to delete the meeting "${meetingToDeleteName}"? This action cannot be undone.`}
        deleting={deleting}
      />
    </Card>
  );
};

export default Meetings;

