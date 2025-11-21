import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft } from 'lucide-react';
import { publicApi } from '../lib/api';

interface NCPVehicleRecovery {
  _id?: string;
  id?: string;
  date: string;
  location: string;
  activity_type: string;
  veh_make_type: string;
  vehno: string;
  cnic_owner: string;
  cnic_driver: string;
  remarks: string;
  ncp_vehicles_id?: string;
}

const NCPVehicleRecoveryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<NCPVehicleRecovery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-ncp-veh-recovery/get-single-ispec-ncp-veh-recovery/${id}`);
        const recordData = response.data?.data || response.data;
        
        if (recordData) {
          setRecord(recordData);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
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
          <h1 className="text-2xl font-bold">NCP Vehicle Recovery Record</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/illegal-spectrum/ncp-vehicles-recovery/edit/${record.id || record._id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Number</p>
              <p className="font-medium">{record.vehno || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Make/Type</p>
              <p className="font-medium">{record.veh_make_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recovery Date</p>
              <p className="font-medium">{formatDate(record.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{record.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activity Type</p>
              <p className="font-medium">{record.activity_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner CNIC</p>
              <p className="font-medium">{record.cnic_owner || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver CNIC</p>
              <p className="font-medium">{record.cnic_driver || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Remarks</p>
              <p className="font-medium">{record.remarks || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NCPVehicleRecoveryView;
