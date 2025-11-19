import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2, ArrowLeft, FileText, ClipboardList, Info } from 'lucide-react';
import { publicApi } from '../lib/api';

interface SourceReliabilityDetailsData {
  source: string;
  intl_recvd_month: string;
  source_reliability: string;
  info_credibility: string;
  remarks?: string;
}

const SourceReliabilityDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [details, setDetails] = useState<SourceReliabilityDetailsData | null>(null);
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
        const endpoint = `/intl-cycle-src-reliability-info-credibility-indices/get-single-intl-cycle-src-reliability-info-credibility-index/${recordId}`;
        const response = await publicApi.get(endpoint);
        const data = response.data?.data || response.data;

        if (data) {
          setDetails({
            source: data.source || data.source_name || 'N/A',
            intl_recvd_month: data.intl_recvd_month || data.intelligence_received_month || data.month || 'N/A',
            source_reliability: data.source_reliability || data.reliability || 'N/A',
            info_credibility: data.info_credibility || data.information_credibility || 'N/A',
            remarks: data.remarks || data.notes || 'N/A',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching source reliability details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load source reliability details. Please try again.'
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
          <p className="text-muted-foreground">Loading source reliability details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/intelligence-cycle/source-reliability')}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-foreground">Error Loading Details</p>
              <p className="text-muted-foreground">{error || 'Source reliability record not found.'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/source-reliability')} variant="secondary">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/intelligence-cycle/source-reliability')}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <h2 className="text-3xl font-bold text-foreground">Source Reliability Details</h2>
          <p className="text-muted-foreground">Complete reliability and credibility snapshot for {details.source}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{details.source}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              Intelligence Received Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{details.intl_recvd_month}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Reliability & Credibility
          </CardTitle>
          <CardDescription>Confidence assessment for the provided intelligence</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Source Reliability</p>
            <p className="text-base font-semibold text-foreground">{details.source_reliability}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Information Credibility</p>
            <p className="text-base font-semibold text-foreground">{details.info_credibility}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Remarks</CardTitle>
          <CardDescription>Additional notes provided by the unit</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground whitespace-pre-line">{details.remarks || 'No remarks available.'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceReliabilityDetails;
