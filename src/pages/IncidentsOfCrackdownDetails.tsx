import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Calendar, MapPin, Users, Shield, FileText, AlertTriangle } from 'lucide-react';
import { publicApi } from '../lib/api';

interface IncidentsOfCrackdownData {
  _id?: string;
  id?: string;
  date: string;
  location: string;
  no_people_apprehend: number;
  recoveries: string;
  details: string;
  remarks: string;
}

const IncidentsOfCrackdownDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [incidentData, setIncidentData] = useState<IncidentsOfCrackdownData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-armsexpl-incidents-crackdown/get-single-ispec-armsexpl-incidents-crackdown/${recordId}`);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setIncidentData({
            _id: data._id || data.id,
            id: data._id || data.id,
            date: data.date || '',
            location: data.location || '',
            no_people_apprehend: data.no_people_apprehend || 0,
            recoveries: data.recoveries || '',
            details: data.details || '',
            remarks: data.remarks || '',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching incident details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load incident details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentDetails();
  }, [recordId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (error || !incidentData) {
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
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-foreground">Error Loading Details</p>
              <p className="text-muted-foreground">{error || 'Incident record not found'}</p>
              <Button onClick={() => navigate(-1)} variant="secondary">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
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
          <h2 className="text-3xl font-bold text-foreground">Crackdown Incident Details</h2>
          <p className="text-muted-foreground">
            Detailed information about the crackdown incident
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {formatDate(incidentData.date)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {incidentData.location || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              People Apprehended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {incidentData.no_people_apprehend}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Incident Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Details
            </CardTitle>
            <CardDescription>Comprehensive information about the crackdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {incidentData.details ? (
                <p className="whitespace-pre-line">{incidentData.details}</p>
              ) : (
                <p className="text-muted-foreground italic">No details provided</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recoveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recoveries
            </CardTitle>
            <CardDescription>Items recovered during the crackdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Recovered Items</p>
              <p className="text-base text-foreground whitespace-pre-line">
                {incidentData.recoveries || 'No recoveries recorded'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remarks Section */}
      <div className="grid gap-6">

        {/* Remarks */}
        {incidentData.remarks && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Remarks</CardTitle>
              <CardDescription>Additional information and notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{incidentData.remarks}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back to List
        </Button>
        <Button
          variant="default"
          onClick={() => navigate(`/illegal-spectrum/incidents-crackdown/edit?id=${incidentData.id || incidentData._id}`)}
        >
          Edit Incident
        </Button>
      </div>
    </div>
  );
};

export default IncidentsOfCrackdownDetails;
