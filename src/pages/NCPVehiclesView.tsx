import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft } from 'lucide-react';
import { publicApi } from '../lib/api';

interface NCPVehiclesRecord {
  id: string;
  is_db_formed: boolean;
  no_cps_auth_lookfor_seize_ncp: number;
  no_ncp_veh_regularized: number;
  no_ncp_owners_apprehended: number;
  no_ncp_owners_convicted: number;
  no_ncp_owners_setfreebycourt: number;
  no_ncp_owners_casepending: number;
  remarks: string;
}

const NCPVehiclesView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<NCPVehiclesRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-ncp-vehicles/get-single-ispec-ncp-vehicle/${id}`);
        const recordData = response.data?.data || response.data;
        
        if (recordData) {
          setRecord({
            id: recordData._id || recordData.id,
            is_db_formed: recordData.is_db_formed || false,
            no_cps_auth_lookfor_seize_ncp: recordData.no_cps_auth_lookfor_seize_ncp || 0,
            no_ncp_veh_regularized: recordData.no_ncp_veh_regularized || 0,
            no_ncp_owners_apprehended: recordData.no_ncp_owners_apprehended || 0,
            no_ncp_owners_convicted: recordData.no_ncp_owners_convicted || 0,
            no_ncp_owners_setfreebycourt: recordData.no_ncp_owners_setfreebycourt || 0,
            no_ncp_owners_casepending: recordData.no_ncp_owners_casepending || 0,
            remarks: recordData.remarks || '',
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
          <h1 className="text-2xl font-bold">NCP Vehicles Record Details</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/ncp-vehicles/edit/${record.id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">DB Formed</p>
              <p className="font-medium">{record.is_db_formed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPS Authorized to Look/Seize</p>
              <p className="font-medium">{record.no_cps_auth_lookfor_seize_ncp}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicles Regularized</p>
              <p className="font-medium">{record.no_ncp_veh_regularized}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners Apprehended</p>
              <p className="font-medium">{record.no_ncp_owners_apprehended}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners Convicted</p>
              <p className="font-medium">{record.no_ncp_owners_convicted}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners Set Free by Court</p>
              <p className="font-medium">{record.no_ncp_owners_setfreebycourt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners with Cases Pending</p>
              <p className="font-medium">{record.no_ncp_owners_casepending}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Remarks</p>
              <p className="font-medium">{record.remarks || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NCPVehiclesView;
