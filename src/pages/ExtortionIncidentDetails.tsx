import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Loader2, MapPin, AlertCircle, FileText, Calendar, DollarSign, User, Shield } from 'lucide-react';
import { publicApi } from '../lib/api';

interface ExtortionIncidentData {
  id?: string;
  _id?: string;
  location: string;
  date: string;
  extorted_from: string;
  extorted_by: string;
  affiliation_terr_grp: string;
  amount_extorted: number;
  action_taken: string;
  remarks: string;
  extortion_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ExtortionIncidentDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [incidentData, setIncidentData] = useState<ExtortionIncidentData | null>(null);
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
        const response = await publicApi.get(`/ispec-extortion-incidents/get-single-ispec-extortion-incident/${recordId}`);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setIncidentData({
            id: data._id || data.id,
            location: data.location || '',
            date: data.date || '',
            extorted_from: data.extorted_from || '',
            extorted_by: data.extorted_by || '',
            affiliation_terr_grp: data.affiliation_terr_grp || '',
            amount_extorted: data.amount_extorted || 0,
            action_taken: data.action_taken || '',
            remarks: data.remarks || '',
            extortion_id: data.extortion_id,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching extortion incident details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load extortion incident details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentDetails();
  }, [recordId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading extortion incident details...</p>
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
            onClick={() => navigate('/illegal-spectrum/extortion')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-foreground">Error Loading Details</p>
              <p className="text-muted-foreground">{error || 'Extortion incident record not found'}</p>
              <Button onClick={() => navigate('/illegal-spectrum/extortion')} variant="secondary">
                Return to List
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
              onClick={() => navigate('/illegal-spectrum/extortion')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Extortion Incident Details</h2>
          <p className="text-muted-foreground">
            Comprehensive information about the extortion incident
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{incidentData.location || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount Extorted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {incidentData.amount_extorted ? `$${incidentData.amount_extorted.toLocaleString()}` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Terrorist Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {incidentData.affiliation_terr_grp || 'Not specified'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Incident Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-primary" />
              Incident Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-foreground">{incidentData.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-foreground">{formatDate(incidentData.date)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Extorted From</p>
                  <p className="text-foreground">{incidentData.extorted_from || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Extorted By</p>
                  <p className="text-foreground">{incidentData.extorted_by || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Group & Action Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-primary" />
              Group & Action Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terrorist Group</p>
                <p className="text-foreground">{incidentData.affiliation_terr_grp || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount Extorted</p>
                  <p className="text-foreground">
                    {incidentData.amount_extorted ? `$${incidentData.amount_extorted.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Action Taken</p>
                  <p className="text-foreground">{incidentData.action_taken || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Remarks */}
      {(incidentData.remarks || incidentData.id) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incidentData.remarks && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                <p className="whitespace-pre-line text-foreground">{incidentData.remarks}</p>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Record ID: {incidentData.id || 'N/A'}</p>
              {incidentData.createdAt && <p>Created: {formatDate(incidentData.createdAt)}</p>}
              {incidentData.updatedAt && <p>Last Updated: {formatDate(incidentData.updatedAt)}</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExtortionIncidentDetails;