import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, FileText, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';
import { publicApi } from '../lib/api';

interface IntelligenceCycleData {
  is_publication_province_intl_estimate: boolean;
  is_prep_action_plan: boolean;
  is_prep_m_e_framework: boolean;
  percent_completion_action_plan: number;
  is_connectivity_concerned_dept: boolean;
  is_prep_local_resp_mech: boolean;
  no_alerts_recvd: number;
  no_alerts_deduct_false: number;
  no_alerts_disposedof: number;
  is_prep_eval_report_local_affect: boolean;
}

const IntelligenceCycleListDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [data, setData] = useState<IntelligenceCycleData | null>(null);
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
        const endpoint = `/intl-cycle/get-single/${recordId}`;
        const response = await publicApi.get(endpoint);
        const d = response?.data?.data ?? response?.data;
        if (d) {
          setData({
            is_publication_province_intl_estimate: Boolean(d.is_publication_province_intl_estimate),
            is_prep_action_plan: Boolean(d.is_prep_action_plan),
            is_prep_m_e_framework: Boolean(d.is_prep_m_e_framework),
            percent_completion_action_plan: Number(d.percent_completion_action_plan) || 0,
            is_connectivity_concerned_dept: Boolean(d.is_connectivity_concerned_dept),
            is_prep_local_resp_mech: Boolean(d.is_prep_local_resp_mech),
            no_alerts_recvd: Number(d.no_alerts_recvd) || 0,
            no_alerts_deduct_false: Number(d.no_alerts_deduct_false) || 0,
            no_alerts_disposedof: Number(d.no_alerts_disposedof) || 0,
            is_prep_eval_report_local_affect: Boolean(d.is_prep_eval_report_local_affect),
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching intelligence cycle details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load intelligence cycle details. Please try again.'
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
          <p className="text-muted-foreground">Loading intelligence cycle details...</p>
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
            onClick={() => navigate('/intelligence-cycle/list')}
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
              <p className="text-muted-foreground">{error || 'Intelligence cycle record not found'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/list')} variant="secondary">
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
              onClick={() => navigate('/intelligence-cycle/list')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Intelligence Cycle Details</h2>
          <p className="text-muted-foreground">Detailed information about this intelligence cycle entry</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4 inline mr-2" />Publication Province Intl Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_publication_province_intl_estimate ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {data.is_publication_province_intl_estimate ? 'Completed' : 'Not Completed'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4 inline mr-2" />Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_prep_action_plan ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {data.is_prep_action_plan ? 'Prepared' : 'Not Prepared'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4 inline mr-2" />M&E Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_prep_m_e_framework ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {data.is_prep_m_e_framework ? 'Prepared' : 'Not Prepared'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Action Plan Completion
            </CardTitle>
            <CardDescription>Percentage of action plan completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{data.percent_completion_action_plan}%</span>
                <div className="w-16 h-16 relative">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-muted-foreground"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - data.percent_completion_action_plan / 100)}`}
                      className="text-primary transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {data.percent_completion_action_plan}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.percent_completion_action_plan}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connectivity Status
            </CardTitle>
            <CardDescription>Connectivity with concerned departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_connectivity_concerned_dept ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {data.is_connectivity_concerned_dept ? 'Connected' : 'Not Connected'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alerts Statistics
          </CardTitle>
          <CardDescription>Summary of alerts received and processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{data.no_alerts_recvd}</p>
              <p className="text-sm text-muted-foreground">Alerts Received</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{data.no_alerts_deduct_false}</p>
              <p className="text-sm text-muted-foreground">False Alerts Deducted</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{data.no_alerts_disposedof}</p>
              <p className="text-sm text-muted-foreground">Alerts Disposed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Local Response Mechanism
            </CardTitle>
            <CardDescription>Preparation of local response mechanism</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_prep_local_resp_mech ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {data.is_prep_local_resp_mech ? 'Prepared' : 'Not Prepared'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Evaluation Report
            </CardTitle>
            <CardDescription>Local affect evaluation report status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {data.is_prep_eval_report_local_affect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {data.is_prep_eval_report_local_affect ? 'Prepared' : 'Not Prepared'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceCycleListDetails;
