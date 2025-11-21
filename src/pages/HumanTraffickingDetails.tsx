import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { publicApi } from '../lib/api';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Activity, AlertTriangle, TrendingUp, Users, ClipboardList } from 'lucide-react';

interface HumanTraffickingDetailsData {
  is_db_formed: boolean;
  no_ops_launch_against_ht_networks: number;
  no_indv_appr_during_ops: number;
  no_indv_neut_during_ops: number;
  no_indv_appr_ht_charges_convicted: number;
  no_indv_appr_ht_charges_setfreebycourt: number;
  no_indv_appr_ht_charges_pendingcases: number;
  is_mthly_trend_anal_report_prep: boolean;
  remarks: string;
}

const HumanTraffickingDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [details, setDetails] = useState<HumanTraffickingDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching human trafficking details for ID:', recordId);
    const fetchDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching human trafficking details for ID:', recordId);
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-human-traff/get-single-ispec-human-traff/${recordId}`);
        const data = response.data?.data || response.data;

        if (data) {
          setDetails({
            is_db_formed: Boolean(data.is_db_formed),
            no_ops_launch_against_ht_networks: Number(data.no_ops_launch_against_ht_networks) || 0,
            no_indv_appr_during_ops: Number(data.no_indv_appr_during_ops) || 0,
            no_indv_neut_during_ops: Number(data.no_indv_neut_during_ops) || 0,
            no_indv_appr_ht_charges_convicted: Number(data.no_indv_appr_ht_charges_convicted) || 0,
            no_indv_appr_ht_charges_setfreebycourt: Number(data.no_indv_appr_ht_charges_setfreebycourt) || 0,
            no_indv_appr_ht_charges_pendingcases: Number(data.no_indv_appr_ht_charges_pendingcases) || 0,
            is_mthly_trend_anal_report_prep: Boolean(data.is_mthly_trend_anal_report_prep),
            remarks: data.remarks || '—'
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching human trafficking details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load human trafficking details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [recordId]);

  const renderBoolean = (value: boolean, trueLabel = 'Yes', falseLabel = 'No') => (
    <div className="flex items-center gap-2">
      {value ? (
        <>
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-foreground">{trueLabel}</span>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5 text-gray-400" />
          <span className="font-semibold text-foreground">{falseLabel}</span>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading human trafficking details...</p>
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
            onClick={() => navigate('/illegal-spectrum/human-trafficking')}
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
              <p className="text-muted-foreground">{error || 'Human trafficking record not found'}</p>
              <Button onClick={() => navigate('/illegal-spectrum/human-trafficking')} variant="secondary">
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
            onClick={() => navigate('/illegal-spectrum/human-trafficking')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h2 className="text-3xl font-bold text-foreground">Human Trafficking Details</h2>
          <p className="text-muted-foreground">Detailed statistics for the selected record</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Operations Overview
            </CardTitle>
            <CardDescription>Key operations metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">DB Formed</p>
              {renderBoolean(details.is_db_formed, 'Formed', 'Not Formed')}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Trend Analysis Report</p>
              {renderBoolean(details.is_mthly_trend_anal_report_prep, 'Prepared', 'Not Prepared')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Operations Stats
            </CardTitle>
            <CardDescription>Operational progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Operations Launched</p>
            <p className="text-2xl font-semibold text-foreground">{details.no_ops_launch_against_ht_networks}</p>
            <p className="text-sm text-muted-foreground">Individuals Apprehended</p>
            <p className="text-2xl font-semibold text-foreground">{details.no_indv_appr_during_ops}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Neutralized / Support
            </CardTitle>
            <CardDescription>Follow-up actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Individuals Neutralized</p>
            <p className="text-2xl font-semibold text-foreground">{details.no_indv_neut_during_ops}</p>
            <p className="text-sm text-muted-foreground">Remarks</p>
            <p className="text-muted-foreground">{details.remarks}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Court Proceedings
            </CardTitle>
            <CardDescription>Status of court outcomes</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Convicted</p>
              <p className="text-2xl font-semibold text-foreground">{details.no_indv_appr_ht_charges_convicted}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Set Free</p>
              <p className="text-2xl font-semibold text-foreground">{details.no_indv_appr_ht_charges_setfreebycourt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Cases</p>
              <p className="text-2xl font-semibold text-foreground">{details.no_indv_appr_ht_charges_pendingcases}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Summary
            </CardTitle>
            <CardDescription>High-level snapshot</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This record summarizes operational, legal, and reporting progress against human trafficking objectives. Review remarks for any
              additional context provided during data entry.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HumanTraffickingDetails;
