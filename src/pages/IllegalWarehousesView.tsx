import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Edit } from 'lucide-react';
import { publicApi } from '../lib/api';

interface IllegalWarehousesRecord {
  id: string;
  is_db_formed: boolean;
  no_ill_wh_owner_apprehended: number;
  no_ill_wh_owner_convicted: number;
  no_ill_wh_owner_setfreebycourt: number;
  no_appr_ill_wh_owner_case_pending: number;
  remarks: string;
}

const IllegalWarehousesView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<IllegalWarehousesRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-illegal-warehouse/get-single-ispec-illegal-warehouse/${id}`);
        const recordData = response.data?.data || response.data;
        
        if (!recordData) {
          throw new Error('Record not found');
        }

        const mappedRecord: IllegalWarehousesRecord = {
          id: recordData._id || recordData.id,
          is_db_formed: recordData.is_db_formed || false,
          no_ill_wh_owner_apprehended: recordData.no_ill_wh_owner_apprehended || 0,
          no_ill_wh_owner_convicted: recordData.no_ill_wh_owner_convicted || 0,
          no_ill_wh_owner_setfreebycourt: recordData.no_ill_wh_owner_setfreebycourt || 0,
          no_appr_ill_wh_owner_case_pending: recordData.no_appr_ill_wh_owner_case_pending || 0,
          remarks: recordData.remarks || '',
        };

        setRecord(mappedRecord);
      } catch (err) {
        console.error('Error fetching record:', err);
        setError(err instanceof Error ? err.message : 'Failed to load record. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const getDisplayValue = (value: boolean): string => {
    return value ? 'Yes' : 'No';
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
          <h1 className="text-2xl font-bold">Illegal Warehouse Record</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/illegal-warehouses/edit/${record.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Database Formed</p>
              <p className="font-medium">{getDisplayValue(record.is_db_formed)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners Apprehended</p>
              <p className="font-medium">{record.no_ill_wh_owner_apprehended}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners Convicted</p>
              <p className="font-medium">{record.no_ill_wh_owner_convicted}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owners Set Free by Court</p>
              <p className="font-medium">{record.no_ill_wh_owner_setfreebycourt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cases Pending</p>
              <p className="font-medium">{record.no_appr_ill_wh_owner_case_pending}</p>
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

export default IllegalWarehousesView;
