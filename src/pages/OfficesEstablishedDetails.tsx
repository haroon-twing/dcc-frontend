import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2, ArrowLeft, User, Phone, ClipboardList, FileText } from 'lucide-react';
import { publicApi } from '../lib/api';

interface OfficeEstablishedDetailsData {
  name: string;
  rank: string;
  appointment: string;
  contact_no: string;
  remarks?: string;
}

const OfficesEstablishedDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [officeData, setOfficeData] = useState<OfficeEstablishedDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/intl-cycle-offc-estd-piftac/get-single-intl-cycle-offc-estd-piftac/${recordId}`;
        const response = await publicApi.get(endpoint);
        const data = response.data?.data || response.data;

        if (data) {
          setOfficeData({
            name: data.name || 'N/A',
            rank: data.rank || 'N/A',
            appointment: data.appointment || 'N/A',
            contact_no: data.contact_no || 'N/A',
            remarks: data.remarks || 'N/A',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching office established details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load office established details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading office established details...</p>
        </div>
      </div>
    );
  }

  if (error || !officeData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/intelligence-cycle/offices-established-piftac')}
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
              <p className="text-muted-foreground">{error || 'Office Established record not found'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/offices-established-piftac')} variant="secondary">
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
              onClick={() => navigate('/intelligence-cycle/offices-established-piftac')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Office Established Details</h2>
          <p className="text-muted-foreground">Comprehensive information for the selected office</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{officeData.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              Rank & Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Rank</p>
              <p className="text-base font-semibold text-foreground">{officeData.rank}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Appointment</p>
              <p className="text-base font-semibold text-foreground">{officeData.appointment}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Primary contact details for the office</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{officeData.contact_no}</p>
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
            <p className="text-base text-foreground whitespace-pre-line">{officeData.remarks || 'No remarks available.'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficesEstablishedDetails;
