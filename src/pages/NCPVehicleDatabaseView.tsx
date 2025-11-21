import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft } from 'lucide-react';
import { publicApi } from '../lib/api';

interface NCPVehiclesDatabase {
  _id?: string;
  id?: string;
  register_date: string;
  address: string;
  cnic_owner: string;
  veh_make_type: string;
  vehno: string;
  acquisition_method: string;
  present_use: string;
  remarks: string;
  ncp_vehicles_id?: string;
}

const NCPVehicleDatabaseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<NCPVehiclesDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-ncp-veh-database/get-single-ispec-ncp-veh-database/${id}`);
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
          <h1 className="text-2xl font-bold">NCP Vehicle Database Record</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/illegal-spectrum/ncp-vehicles-database/edit/${record.id || record._id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
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
              <p className="text-sm text-muted-foreground">Registration Date</p>
              <p className="font-medium">{formatDate(record.register_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner CNIC</p>
              <p className="font-medium">{record.cnic_owner || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Acquisition Method</p>
              <p className="font-medium">{record.acquisition_method || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Present Use</p>
              <p className="font-medium">{record.present_use || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{record.address || 'N/A'}</p>
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

export default NCPVehicleDatabaseView;
