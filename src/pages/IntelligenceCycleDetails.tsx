import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { publicApi } from '../lib/api';
import { ArrowLeft, Loader2, Activity, CheckCircle, XCircle, BarChart2, AlertTriangle, ClipboardList } from 'lucide-react';

interface IntelligenceCycleDetailsData {
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

const IntelligenceCycleDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [details, setDetails] = useState<IntelligenceCycleDetailsData | null>(null);
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
        const response = await publicApi.get(`/intl-cycle/get-single/${recordId}`);
        const data = response.data?.data || response.data;

        if (data) {
          setDetails({
            is_publication_province_intl_estimate: Boolean(data.is_publication_province_intl_estimate),
            is_prep_action_plan: Boolean(data.is_prep_action_plan),
            is_prep_m_e_framework: Boolean(data.is_prep_m_e_framework),
            percent_completion_action_plan: Number(data.percent_completion_action_plan) || 0,
            is_connectivity_concerned_dept: Boolean(data.is_connectivity_concerned_dept),
            is_prep_local_resp_mech: Boolean(data.is_prep_local_resp_mech),
            no_alerts_recvd: Number(data.no_alerts_recvd) || 0,
            no_alerts_deduct_false: Number(data.no_alerts_deduct_false) || 0,
            no_alerts_disposedof: Number(data.no_alerts_disposedof) || 0,
            is_prep_eval_report_local_affect: Boolean(data.is_prep_eval_report_local_affect),
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

  const renderBoolean = (value: boolean) => (
    <div className="flex items-center gap-2">
      {value ? (
        <>
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-foreground">Yes</span>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5 text-gray-400" />
          <span className="font-semibold text-foreground">No</span>
        </>
      )}
    </div>
  );

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

  if (error || !details) {
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
          <p className="text-muted-foreground">Detailed status across planning, connectivity, and alert metrics</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Action Plan</CardTitle>
            <CardDescription>Percent complete</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{details.percent_completion_action_plan}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts Received</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{details.no_alerts_recvd}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts Deducted False</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{details.no_alerts_deduct_false}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts Disposed Of</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{details.no_alerts_disposedof}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Planning & Publication
            </CardTitle>
            <CardDescription>Status of core planning artefacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Publication Province Intl Estimate</p>
              {renderBoolean(details.is_publication_province_intl_estimate)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preparation Action Plan</p>
              {renderBoolean(details.is_prep_action_plan)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preparation M&E Framework</p>
              {renderBoolean(details.is_prep_m_e_framework)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Connectivity & Local Response
            </CardTitle>
            <CardDescription>Operational readiness indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Connectivity with Concerned Departments</p>
              {renderBoolean(details.is_connectivity_concerned_dept)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local Response Mechanism Prepared</p>
              {renderBoolean(details.is_prep_local_resp_mech)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Evaluation Report on Local Affect</p>
              {renderBoolean(details.is_prep_eval_report_local_affect)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Alert Processing Overview
          </CardTitle>
          <CardDescription>Pipeline of alerts across stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Received</p>
              <p className="text-2xl font-semibold text-foreground">{details.no_alerts_recvd}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deducted False</p>
              <p className="text-2xl font-semibold text-foreground">{details.no_alerts_deduct_false}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disposed Of</p>
              <p className="text-2xl font-semibold text-foreground">{details.no_alerts_disposedof}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Overall Assessment
          </CardTitle>
          <CardDescription>Snapshot of preparedness and reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section summarizes the readiness of the intelligence cycle across planning, coordination, and alert management.
            All boolean indicators above reflect the latest submission for the selected record.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceCycleDetails;
