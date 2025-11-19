import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, FileText, Activity, Timer, Target } from 'lucide-react';
import { publicApi } from '../lib/api';

interface PredictiveAnalysisData {
  name: string;
  forwarded_to: string;
  assess_accuracy: string;
  timely_response: string;
  is_incident_averted: boolean;
  is_generated: boolean;
  remarks?: string;
}

const PredictiveAnalysisDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [data, setData] = useState<PredictiveAnalysisData | null>(null);
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
        const endpoint = `/intl-cycle-predictive-analysis-details/get-single-intl-cycle-predictive-analysis-detail/${recordId}`;
        const response = await publicApi.get(endpoint);
        const d = response?.data?.data ?? response?.data;
        if (d) {
          setData({
            name: d.name || '',
            forwarded_to: d.forwarded_to || '',
            assess_accuracy: d.assess_accuracy || '',
            timely_response: d.timely_response || '',
            is_incident_averted: Boolean(d.is_incident_averted),
            is_generated: Boolean(d.is_generated),
            remarks: d.remarks || '',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching predictive analysis details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load predictive analysis details. Please try again.'
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
          <p className="text-muted-foreground">Loading predictive analysis details...</p>
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
            onClick={() => navigate('/intelligence-cycle/predictive-analysis')}
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
              <p className="text-muted-foreground">{error || 'Predictive Analysis record not found'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/predictive-analysis')} variant="secondary">
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
              onClick={() => navigate('/intelligence-cycle/predictive-analysis')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Predictive Analysis Details</h2>
          <p className="text-muted-foreground">Detailed information about this predictive analysis entry</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" /> Assess Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.assess_accuracy || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Timer className="h-4 w-4" /> Timely Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.timely_response || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" /> Forwarded To
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{data.forwarded_to || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Booleans */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Incident Averted
            </CardTitle>
            <CardDescription>Status of incident prevention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_incident_averted ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">Yes</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-foreground">No</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated
            </CardTitle>
            <CardDescription>Whether a report/intelligence was generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_generated ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">Yes</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-foreground">No</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" /> Remarks
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

export default PredictiveAnalysisDetails;
