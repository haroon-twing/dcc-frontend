import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Edit, Trash2, FileText, Calendar, MapPin, User, FileText as FileTextIcon, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import { format } from 'date-fns';
import DeleteModal from '../components/UI/DeleteModal';

interface PolicyAndLegislativeAmendment {
  id?: string;
  _id?: string;
  name_executive_order: string;
  area_focus: string;
  location_affected: string;
  passed_by: string;
  passed_on: string;
  expires_on: string;
  remarks: string;
}

const PolicyAndLegislativeAmendmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [record, setRecord] = useState<PolicyAndLegislativeAmendment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-armsexpl-policy-legislative-ammend/get-single-ispec-armsexpl-policy-legislative-ammend/${id}`);
        setRecord(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching record:', err);
        setError('Failed to load record. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    if (!record?.id && !record?._id) return;
    
    try {
      setDeleting(true);
      const recordId = record.id || record._id;
      await api.delete(`/ispec-armsexpl-policy-legislative-ammend/delete-ispec-armsexpl-policy-legislative-ammend/${recordId}`);
      navigate('/illegal-spectrum/arms-explosives-urea');
    } catch (err) {
      console.error('Error deleting record:', err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading policy/legislative amendment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-lg font-semibold text-foreground">Error Loading Details</p>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => navigate(-1)} variant="secondary">
                Return to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-lg font-semibold text-foreground">Record Not Found</p>
              <p className="text-muted-foreground">The requested policy/legislative amendment record could not be found.</p>
              <Button onClick={() => navigate(-1)} variant="secondary">
                Return to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recordId = record.id || record._id;

  const isActive = record.expires_on ? new Date(record.expires_on) > new Date() : true;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Policy/Legislative Amendment</h2>
            <p className="text-muted-foreground">
              Detailed information about the policy or legislative amendment
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/illegal-spectrum/arms-explosives-urea/policy-legislative-amendments/edit/${recordId}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Active</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                <span className="text-sm font-medium">Expired</span>
              </>
            )}
            <span className="text-sm text-muted-foreground ml-2">
              {isActive 
                ? 'This policy/legislation is currently in effect.' 
                : `Expired on ${formatDate(record.expires_on)}`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Policy Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Details
            </CardTitle>
            <CardDescription>Essential information about the policy or legislative amendment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Executive Order Name</p>
              <p className="text-base text-foreground font-medium">{record.name_executive_order || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Area Focus</p>
              <p className="text-base text-foreground font-medium">{record.area_focus || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Location Affected</p>
              <p className="text-base text-foreground font-medium">{record.location_affected || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Enactment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Enactment Details
            </CardTitle>
            <CardDescription>Information about when and by whom the policy was enacted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Passed By</p>
              <p className="text-base text-foreground font-medium">{record.passed_by || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date Enacted</p>
              <p className="text-base text-foreground font-medium">{formatDate(record.passed_on)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {isActive ? 'Expires On' : 'Expired On'}
              </p>
              <p className="text-base text-foreground font-medium">
                {record.expires_on ? formatDate(record.expires_on) : 'No expiration date'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Additional Information
          </CardTitle>
          <CardDescription>Additional details and notes about this policy or legislative amendment</CardDescription>
        </CardHeader>
        <CardContent>
          {record.remarks ? (
            <div className="space-y-2 mt-6">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Remarks
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                {record.remarks}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No additional information available.</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDelete}
        id={recordId || ''}
        deleting={deleting}
        title="Delete Policy/Legislative Amendment"
        message={`Are you sure you want to delete "${record.name_executive_order}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PolicyAndLegislativeAmendmentDetails;
