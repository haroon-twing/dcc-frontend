import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2, ArrowLeft, Building2, ShieldCheck, Wifi, FileText } from 'lucide-react';
import { publicApi } from '../lib/api';

interface ConnectivityStatusDetailsData {
  office: string;
  is_nip_access: boolean;
  is_eoffice_access: boolean;
  is_oas_access: boolean;
  is_internet_access: boolean;
  remarks?: string;
}

const booleanDisplay = (value: boolean) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      value
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }`}
  >
    {value ? 'Yes' : 'No'}
  </span>
);

const ConnectivityStatusDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [details, setDetails] = useState<ConnectivityStatusDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/intl-cycle-connectivity-status/get-single-intl-cycle-connectivity-status/${recordId}`;
        const response = await publicApi.get(endpoint);
        const data = response.data?.data || response.data;

        if (data) {
          setDetails({
            office: data.office || 'N/A',
            is_nip_access: Boolean(data.is_nip_access),
            is_eoffice_access: Boolean(data.is_eoffice_access),
            is_oas_access: Boolean(data.is_oas_access),
            is_internet_access: Boolean(data.is_internet_access),
            remarks: data.remarks || 'N/A',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching connectivity status details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load connectivity status details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading connectivity status details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/intelligence-cycle/connectivity-status')}
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
              <p className="text-muted-foreground">{error || 'Connectivity status record not found'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/connectivity-status')} variant="secondary">
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/intelligence-cycle/connectivity-status')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Connectivity Status Details</h2>
          <p className="text-muted-foreground">Detailed connectivity profile for {details.office}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Office
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{details.office}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Core Access Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>NIP Access</span>
              {booleanDisplay(details.is_nip_access)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>E-Office Access</span>
              {booleanDisplay(details.is_eoffice_access)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>OAS Access</span>
              {booleanDisplay(details.is_oas_access)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Internet Access</span>
              {booleanDisplay(details.is_internet_access)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connectivity Summary
          </CardTitle>
          <CardDescription>Snapshot of system availability for the office</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Digital Systems Active</p>
              <p className="text-base font-medium text-foreground">
                {[
                  details.is_nip_access && 'NIP',
                  details.is_eoffice_access && 'E-Office',
                  details.is_oas_access && 'OAS',
                  details.is_internet_access && 'Internet',
                ]
                  .filter(Boolean)
                  .join(', ') || 'None'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Remarks
          </CardTitle>
          <CardDescription>Additional notes provided by the unit</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground whitespace-pre-line">{details.remarks || 'No remarks available.'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectivityStatusDetails;
