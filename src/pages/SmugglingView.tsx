import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Edit } from 'lucide-react';
import { publicApi } from '../lib/api';

interface SmugglingRecord {
  id: string;
  is_db_formed: boolean;
  no_smug_apprehended: number;
  no_smug_convicted: number;
  no_appr_smug_freebycourt: number;
  no_appr_smug_casepending: number;
  is_mthly_report_formed: boolean;
  remarks: string;
  createdAt?: string;
  updatedAt?: string;
}

const SmugglingView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<SmugglingRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-smuggling/get-single-ispec-smuggling/${id}`);
        const recordData = response.data?.data || response.data;
        
        if (recordData) {
          setRecord({
            id: recordData._id || recordData.id,
            is_db_formed: recordData.is_db_formed || false,
            no_smug_apprehended: recordData.no_smug_apprehended || 0,
            no_smug_convicted: recordData.no_smug_convicted || 0,
            no_appr_smug_freebycourt: recordData.no_appr_smug_freebycourt || 0,
            no_appr_smug_casepending: recordData.no_appr_smug_casepending || 0,
            is_mthly_report_formed: recordData.is_mthly_report_formed || false,
            remarks: recordData.remarks || '',
            createdAt: recordData.createdAt,
            updatedAt: recordData.updatedAt
          });
        } else {
          setError('Record not found');
        }
      } catch (err) {
        console.error('Error fetching record:', err);
        setError('Failed to load record. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error || 'Record not found'}</p>
          <Button 
            onClick={() => navigate(-1)} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h1 className="text-2xl font-bold">Smuggling Record Details</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Database Formed</p>
              <p className="font-medium">{record.is_db_formed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Smugglers Apprehended</p>
              <p className="font-medium">{record.no_smug_apprehended}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Smugglers Convicted</p>
              <p className="font-medium">{record.no_smug_convicted}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Apprehended Smugglers Set Free by Court</p>
              <p className="font-medium">{record.no_appr_smug_freebycourt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Apprehended Smugglers with Cases Pending</p>
              <p className="font-medium">{record.no_appr_smug_casepending}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Report Formed</p>
              <p className="font-medium">{record.is_mthly_report_formed ? 'Yes' : 'No'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Remarks</p>
              <p className="font-medium">{record.remarks || '-'}</p>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>Created: {formatDate(record.createdAt)}</p>
              </div>
              <div>
                <p>Last Updated: {formatDate(record.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmugglingView;
