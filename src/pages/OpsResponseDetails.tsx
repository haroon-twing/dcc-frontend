import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Activity, Users, Shield, AlertTriangle, FileText } from 'lucide-react';
import { publicApi } from '../lib/api';

interface OpsResponseData {
  is_fdbk_mech_obtain_resp_devised: boolean;
  is_fdbk_mech_suggest_measures_devised: boolean;
  no_leads_identified_ibo: number;
  no_leads_workingon_ibo: number;
  no_ibo_conducted: number;
  no_terr_apprehended: number;
  no_terr_killed: number;
  no_terr_wounded: number;
  no_terr_convicted: number;
  no_terr_apprehended_clear_by_court: number;
  no_terr_pending_cases: number;
}

const OpsResponseDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [opsResponseData, setOpsResponseData] = useState<OpsResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpsResponseDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/ops-resp/get-single-ops-resp/${recordId}`;
        const response = await publicApi.get(endpoint);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setOpsResponseData({
            is_fdbk_mech_obtain_resp_devised: Boolean(data.is_fdbk_mech_obtain_resp_devised),
            is_fdbk_mech_suggest_measures_devised: Boolean(data.is_fdbk_mech_suggest_measures_devised),
            no_leads_identified_ibo: data.no_leads_identified_ibo || 0,
            no_leads_workingon_ibo: data.no_leads_workingon_ibo || 0,
            no_ibo_conducted: data.no_ibo_conducted || 0,
            no_terr_apprehended: data.no_terr_apprehended || 0,
            no_terr_killed: data.no_terr_killed || 0,
            no_terr_wounded: data.no_terr_wounded || 0,
            no_terr_convicted: data.no_terr_convicted || 0,
            no_terr_apprehended_clear_by_court: data.no_terr_apprehended_clear_by_court || 0,
            no_terr_pending_cases: data.no_terr_pending_cases || 0,
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching ops response details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load ops response details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOpsResponseDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading ops response details...</p>
        </div>
      </div>
    );
  }

  if (error || !opsResponseData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ops-response/list')}
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
              <p className="text-muted-foreground">{error || 'Ops Response record not found'}</p>
              <Button onClick={() => navigate('/ops-response/list')} variant="secondary">
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
              onClick={() => navigate('/ops-response/list')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Ops & Response Details</h2>
          <p className="text-muted-foreground">
            Detailed information about operations and response activities
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Identified (IBO)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{opsResponseData.no_leads_identified_ibo}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">IBO Conducted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{opsResponseData.no_ibo_conducted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terrorists Apprehended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{opsResponseData.no_terr_apprehended}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{opsResponseData.no_terr_pending_cases}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Feedback Mechanisms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Feedback Mechanisms
            </CardTitle>
            <CardDescription>Status of feedback mechanisms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Obtain Response Devised</p>
              <div className="flex items-center gap-2">
                {opsResponseData.is_fdbk_mech_obtain_resp_devised ? (
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
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Suggest Measures Devised</p>
              <div className="flex items-center gap-2">
                {opsResponseData.is_fdbk_mech_suggest_measures_devised ? (
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
            </div>
          </CardContent>
        </Card>

        {/* IBO Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              IBO Operations
            </CardTitle>
            <CardDescription>Intelligence-based operations details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Leads Identified</p>
              <p className="text-base text-foreground font-medium">{opsResponseData.no_leads_identified_ibo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Leads Working On</p>
              <p className="text-base text-foreground font-medium">{opsResponseData.no_leads_workingon_ibo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">IBO Conducted</p>
              <p className="text-base text-foreground font-medium">{opsResponseData.no_ibo_conducted}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terrorist Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Terrorist Statistics
          </CardTitle>
          <CardDescription>Comprehensive statistics on terrorist activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Apprehended</p>
              <p className="text-2xl font-semibold text-foreground">{opsResponseData.no_terr_apprehended}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Killed</p>
              <p className="text-2xl font-semibold text-foreground">{opsResponseData.no_terr_killed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Wounded</p>
              <p className="text-2xl font-semibold text-foreground">{opsResponseData.no_terr_wounded}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Convicted</p>
              <p className="text-2xl font-semibold text-foreground">{opsResponseData.no_terr_convicted}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Court Proceedings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Court Proceedings
          </CardTitle>
          <CardDescription>Status of cases in the judicial system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Cleared by Court</p>
              <p className="text-2xl font-semibold text-foreground">{opsResponseData.no_terr_apprehended_clear_by_court}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pending Cases</p>
              <p className="text-2xl font-semibold text-foreground">{opsResponseData.no_terr_pending_cases}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpsResponseDetails;

