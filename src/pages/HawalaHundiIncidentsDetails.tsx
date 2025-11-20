import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, MapPin, Users, DollarSign, FileText, Calendar } from 'lucide-react';
import { publicApi } from '../lib/api';

interface HawalaHundiIncidentData {
  _id?: string;
  id?: string;
  date: string;
  location: string;
  no_people_apprehend: number;
  recoveries_pkr: number;
  details: string;
  remarks: string;
  is_active: boolean;
}

const HawalaHundiIncidentsDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [incidentData, setIncidentData] = useState<HawalaHundiIncidentData | null>(null);
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
        const response = await publicApi.get(
          `/ispec-hawala-hundi-incidents-crackdown-dealers/get-single-ispec-hawala-hundi-incidents-crackdown-dealer/${recordId}`
        );
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setIncidentData({
            _id: data._id || data.id,
            id: data._id || data.id,
            date: data.date || '',
            location: data.location || '',
            no_people_apprehend: data.no_people_apprehend || 0,
            recoveries_pkr: data.recoveries_pkr || 0,
            details: data.details || '',
            remarks: data.remarks || '',
            is_active: data.is_active !== undefined ? data.is_active : true,
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching hawala/hundi incident details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load hawala/hundi incident details. Please try again.'
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            onClick={() => navigate('/illegal-spectrum/hawala-hundi/incidents')}
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
              <p className="text-muted-foreground">{error || 'Incident record not found'}</p>
              <Button 
                onClick={() => navigate('/illegal-spectrum/hawala-hundi', { state: { tab: 'crackdown-incidents' } })} 
                variant="secondary"
              >
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
              onClick={() => navigate('/illegal-spectrum/hawala-hundi', { state: { tab: 'crackdown-incidents' } })}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Incident of Crackdown on Hawala/Hundi Dealers</h2>
          <p className="text-muted-foreground">
            Detailed information about the crackdown incident
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                People Apprehended
              </div>
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
      <div className="grid gap-6">
        {/* Recoveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recoveries
            </CardTitle>
            <CardDescription>Financial recoveries from the incident</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Amount Recovered (PKR)</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(incidentData.recoveries_pkr)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Incident Details
            </CardTitle>
            <CardDescription>Comprehensive information about the incident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                incidentData.is_active
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}>
                {incidentData.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Details</p>
              <p className="text-foreground whitespace-pre-line">
                {incidentData.details || 'No details provided.'}
              </p>
            </div>

            {incidentData.remarks && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                <p className="text-foreground whitespace-pre-line">
                  {incidentData.remarks}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HawalaHundiIncidentsDetails;
