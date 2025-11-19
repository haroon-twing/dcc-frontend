import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, FileText, Users, Tag } from 'lucide-react';
import { publicApi } from '../lib/api';

interface PIFTACReportData {
  name: string;
  type: string;
  category: string;
  forwarded_to: string;
  reference_no: string;
  remarks?: string;
}

const PIFTACReportsIntelligenceDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [data, setData] = useState<PIFTACReportData | null>(null);
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
        const endpoint = `/intl-cycle-piftac-reports/get-single-intl-cycle-piftac-report/${recordId}`;
        const response = await publicApi.get(endpoint);
        const d = response?.data?.data ?? response?.data;
        if (d) {
          setData({
            name: d.name || '',
            type: d.type || '',
            category: d.category || '',
            forwarded_to: d.forwarded_to || '',
            reference_no: d.reference_no || '',
            remarks: d.remarks || '',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching PIFTAC report details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load PIFTAC report details. Please try again.'
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
          <p className="text-muted-foreground">Loading PIFTAC report details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/intelligence-cycle/piftac-reports')}
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
              <p className="text-muted-foreground">{error || 'PIFTAC report not found'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/piftac-reports')} variant="secondary">
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
              onClick={() => navigate('/intelligence-cycle/piftac-reports')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">PIFTAC Report Details</h2>
          <p className="text-muted-foreground">Detailed information about this PIFTAC report entry</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Tag className="h-4 w-4 inline mr-2" />Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.type || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4 inline mr-2" />Forwarded To
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.forwarded_to || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4 inline mr-2" />Reference No
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.reference_no || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Category
            </CardTitle>
            <CardDescription>Report categorization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.category || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Name
            </CardTitle>
            <CardDescription>Report name/title</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.name || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Remarks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4 inline mr-2" />Remarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-wrap">{data.remarks || '—'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PIFTACReportsIntelligenceDetails;
