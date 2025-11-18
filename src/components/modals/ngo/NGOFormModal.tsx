import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import { Loader2 } from 'lucide-react';
import { fetchLookups, type DistrictOption } from '../../../lib/lookups';

interface NGOFormState {
  name: string;
  field_of_work: string;
  operating_area_district_id: string | null;
  funding_source: string;
  known_affiliate_linkage: string;
  ngo_category: string;
  ngo_risk_level: string;
  is_involve_financial_irregularities: boolean;
  is_against_national_interest: boolean;
  nature_of_anti_national_activity?: string;
  remarks: string;
}

interface NGOFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NGOFormState) => Promise<void>;
  initialData?: NGOFormState | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  loading?: boolean;
  submitting?: boolean;
}

const NGOFormModal: React.FC<NGOFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
  isViewMode = false,
  loading = false,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<NGOFormState>({
    name: '',
    field_of_work: '',
    operating_area_district_id: null,
    funding_source: '',
    known_affiliate_linkage: '',
    ngo_category: '',
    ngo_risk_level: '',
    is_involve_financial_irregularities: false,
    is_against_national_interest: false,
    nature_of_anti_national_activity: '',
    remarks: '',
  });

  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          field_of_work: initialData.field_of_work || '',
          operating_area_district_id: initialData.operating_area_district_id || null,
          funding_source: initialData.funding_source || '',
          known_affiliate_linkage: initialData.known_affiliate_linkage || '',
          ngo_category: initialData.ngo_category || '',
          ngo_risk_level: initialData.ngo_risk_level || '',
          is_involve_financial_irregularities: initialData.is_involve_financial_irregularities || false,
          is_against_national_interest: initialData.is_against_national_interest || false,
          nature_of_anti_national_activity: initialData.nature_of_anti_national_activity || '',
          remarks: initialData.remarks || '',
        });
      } else {
        setFormData({
          name: '',
          field_of_work: '',
          operating_area_district_id: null,
          funding_source: '',
          known_affiliate_linkage: '',
          ngo_category: '',
          ngo_risk_level: '',
          is_involve_financial_irregularities: false,
          is_against_national_interest: false,
          nature_of_anti_national_activity: '',
          remarks: '',
        });
      }
      loadDistricts();
    }
  }, [open, initialData]);

  const loadDistricts = async () => {
    try {
      setLoadingDistricts(true);
      const lookups = await fetchLookups();
      setDistricts(lookups.districts || []);
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof NGOFormState, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      
      // Clear nature_of_anti_national_activity when checkbox is unchecked
      if (field === 'is_against_national_interest' && !value) {
        updated.nature_of_anti_national_activity = '';
      }
      
      return updated;
    });
  };

  const isDisabled = isViewMode || submitting || loading;

  const modalTitle = isViewMode ? 'View NGO' : isEditMode ? 'Edit NGO' : 'Add NGO';
  const modalDescription = isViewMode
    ? 'View NGO details'
    : isEditMode
    ? 'Update NGO information'
    : 'Add a new NGO record';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}
      size="lg"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading NGO data...</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{modalDescription}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter NGO name"
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Field of Work */}
            <div className="space-y-2">
              <label htmlFor="field_of_work" className="block text-sm font-medium text-foreground">
                Field of Work <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="field_of_work"
                value={formData.field_of_work}
                onChange={(e) => handleChange('field_of_work', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter field of work"
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Operating Area District */}
            <div className="space-y-2">
              <label htmlFor="operating_area_district_id" className="block text-sm font-medium text-foreground">
                Operating Area District <span className="text-red-500">*</span>
              </label>
              <select
                id="operating_area_district_id"
                value={formData.operating_area_district_id || ''}
                onChange={(e) => handleChange('operating_area_district_id', e.target.value || null)}
                disabled={isDisabled || loadingDistricts}
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding Source */}
            <div className="space-y-2">
              <label htmlFor="funding_source" className="block text-sm font-medium text-foreground">
                Funding Source <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="funding_source"
                value={formData.funding_source}
                onChange={(e) => handleChange('funding_source', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter funding source"
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Known Affiliate Linkage */}
            <div className="space-y-2">
              <label htmlFor="known_affiliate_linkage" className="block text-sm font-medium text-foreground">
                Known Affiliate Linkage
              </label>
              <input
                type="text"
                id="known_affiliate_linkage"
                value={formData.known_affiliate_linkage}
                onChange={(e) => handleChange('known_affiliate_linkage', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter known affiliate linkage"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* NGO Category */}
            <div className="space-y-2">
              <label htmlFor="ngo_category" className="block text-sm font-medium text-foreground">
                NGO Category <span className="text-red-500">*</span>
              </label>
              <select
                id="ngo_category"
                value={formData.ngo_category}
                onChange={(e) => handleChange('ngo_category', e.target.value)}
                disabled={isDisabled}
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Category</option>
                <option value="Category-A">Category-A</option>
                <option value="Category-B">Category-B</option>
                <option value="Category-C">Category-C</option>
              </select>
            </div>

            {/* NGO Risk Level */}
            <div className="space-y-2">
              <label htmlFor="ngo_risk_level" className="block text-sm font-medium text-foreground">
                NGO Risk Level <span className="text-red-500">*</span>
              </label>
              <select
                id="ngo_risk_level"
                value={formData.ngo_risk_level}
                onChange={(e) => handleChange('ngo_risk_level', e.target.value)}
                disabled={isDisabled}
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Risk Level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Is Involve Financial Irregularities */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_involve_financial_irregularities}
                  onChange={(e) => handleChange('is_involve_financial_irregularities', e.target.checked)}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-input focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-foreground">
                  Is Involve Financial Irregularities
                </span>
              </label>
            </div>

            {/* Is Against National Interest */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_against_national_interest}
                  onChange={(e) => handleChange('is_against_national_interest', e.target.checked)}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-input focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-foreground">
                  Is Against National Interest
                </span>
              </label>
            </div>

            {/* Nature of Anti-National Activity - Conditional Field */}
            {formData.is_against_national_interest && (
              <div className="space-y-2">
                <label htmlFor="nature_of_anti_national_activity" className="block text-sm font-medium text-foreground">
                  Nature of Anti-National Activity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nature_of_anti_national_activity"
                  value={formData.nature_of_anti_national_activity || ''}
                  onChange={(e) => handleChange('nature_of_anti_national_activity', e.target.value)}
                  disabled={isDisabled}
                  placeholder="Enter nature of anti-national activity"
                  required={!isViewMode && formData.is_against_national_interest}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* Remarks */}
            <div className="space-y-2">
              <label htmlFor="remarks" className="block text-sm font-medium text-foreground">
                Remarks
              </label>
              <textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter any additional remarks..."
                rows={4}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {!isViewMode && (
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : isEditMode ? (
                    'Update NGO'
                  ) : (
                    'Add NGO'
                  )}
                </Button>
              </div>
            )}

            {isViewMode && (
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            )}
          </form>
        </>
      )}
    </Modal>
  );
};

export default NGOFormModal;
export type { NGOFormState };

