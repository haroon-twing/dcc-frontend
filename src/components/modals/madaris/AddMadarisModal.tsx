import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { fetchLookups, fetchSchoolOfThoughts, clearLookupCache, type ProvinceOption, type DistrictOption, type SchoolOfThoughtOption } from '../../../lib/lookups';

// Re-export types for backward compatibility
export type { ProvinceOption, DistrictOption };

interface MadarisFormState {
  id?: string;
  name: string;
  reg_no: string;
  prov_id?: ProvinceOption | null;
  district_id?: DistrictOption | null;
  location: string;
  phone: string;
  status: string;
  long: string;
  lat: string;
  is_reg: boolean;
  reg_from_wafaq: string;
  school_of_thought: string;
  cooperative: boolean;
  no_of_local_students: number;
  category: string;
  non_cooperation_reason: string;
  remarks: string;
}

interface AddMadarisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MadarisFormState;
  setFormData: React.Dispatch<React.SetStateAction<MadarisFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  provinces?: ProvinceOption[];
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
}

const statusOptions = ['active', 'inactive'];
const categoryOptions = ['A', 'B', 'C'];

const AddMadarisModal: React.FC<AddMadarisModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  provinces: propsProvinces = [],
  title = 'Add Madaris',
  submitLabel = 'Save',
  submitting = false,
}) => {
  const [localProvinces, setLocalProvinces] = useState<ProvinceOption[]>(propsProvinces);
  const [allDistricts, setAllDistricts] = useState<DistrictOption[]>([]);
  const [schoolOfThoughts, setSchoolOfThoughts] = useState<SchoolOfThoughtOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  // Fetch lookups if not provided via props
  useEffect(() => {
    const loadLookups = async () => {
      try {
        setLoadingLookups(true);
        
        if (propsProvinces.length > 0) {
          // Use provided provinces and extract districts
          setLocalProvinces(propsProvinces);
          // Extract all districts from provinces
          const districts: DistrictOption[] = [];
          propsProvinces.forEach((prov) => {
            if (prov.districts) {
              districts.push(...prov.districts);
            }
          });
          setAllDistricts(districts);
          
          // Still fetch school of thoughts separately
          try {
            const sots = await fetchSchoolOfThoughts();
            setSchoolOfThoughts(sots);
          } catch (error) {
            console.error('Error loading school of thoughts:', error);
          }
        } else {
          // Fetch all lookups if not provided
          // Clear cache to ensure fresh data
          clearLookupCache();
          const { provinces, districts, schoolOfThoughts: sots } = await fetchLookups();
          setLocalProvinces(provinces);
          setAllDistricts(districts);
          setSchoolOfThoughts(sots);
          console.log('Loaded provinces:', provinces.length, 'districts:', districts.length, 'school of thoughts:', sots.length);
        }
      } catch (error) {
        console.error('Error loading lookups:', error);
      } finally {
        setLoadingLookups(false);
      }
    };

    if (open) {
      loadLookups();
    }
  }, [open, propsProvinces]);

  const handleChange = (key: keyof MadarisFormState, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (key === 'prov_id') {
        updated.prov_id = value;
        updated.district_id = null;
        return updated;
      }
      if (key === 'is_reg') {
        updated.is_reg = Boolean(value);
        if (!value) {
          updated.reg_no = '';
        }
        return updated;
      }
      if (key === 'cooperative') {
        updated.cooperative = Boolean(value);
        if (value) {
          // Clear non_cooperation_reason when cooperative is true
          updated.non_cooperation_reason = '';
        }
        return updated;
      }
      (updated as any)[key] = value;
      return updated;
    });
  };

  // Get available districts for the selected province
  const availableDistricts = React.useMemo(() => {
    if (!formData.prov_id) {
      return [];
    }
    const provinceId = formData.prov_id._id;
    
    // First try to get districts from the selected province object
    const selectedProvince = localProvinces.find((prov) => prov._id === provinceId);
    if (selectedProvince?.districts && selectedProvince.districts.length > 0) {
      return selectedProvince.districts;
    }
    
    // Fallback: filter all districts by provinceId
    const filtered = allDistricts.filter((dist) => dist.provinceId === provinceId);
    console.log('Filtered districts for province', provinceId, ':', filtered.length, filtered);
    return filtered;
  }, [formData.prov_id, localProvinces, allDistricts]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-2.5 px-1 pb-1">
        <Input
          label="Institution Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">School of Thought</label>
          <select
            value={schoolOfThoughts.find((sot) => sot.name === formData.school_of_thought)?._id || ''}
            onChange={(e) => {
              const selected = schoolOfThoughts.find((sot) => sot._id === e.target.value);
              handleChange('school_of_thought', selected?.name || '');
            }}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loadingLookups}
          >
            <option value="">{loadingLookups ? 'Loading school of thoughts...' : 'Select School of Thought'}</option>
            {schoolOfThoughts.map((sot) => (
              <option key={sot._id} value={sot._id}>
                {sot.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-6 py-1">
          <label className="flex items-center space-x-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={formData.is_reg}
              onChange={(e) => handleChange('is_reg', e.target.checked)}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <span>Registered</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={formData.cooperative}
              onChange={(e) => handleChange('cooperative', e.target.checked)}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <span>Cooperative</span>
          </label>
        </div>

        {!formData.cooperative && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Non Cooperation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.non_cooperation_reason || ''}
              onChange={(e) => handleChange('non_cooperation_reason', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
              placeholder="Please provide a reason for non-cooperation"
              required={!formData.cooperative}
            />
          </div>
        )}

        <Input
          label="Registration Number"
          value={formData.reg_no}
          onChange={(e) => handleChange('reg_no', e.target.value)}
          disabled={!formData.is_reg}
          required={formData.is_reg}
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Category</label>
          <select
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Province</label>
            <select
              value={formData.prov_id?._id || ''}
              onChange={(e) => {
                const selected = localProvinces.find((prov) => prov._id === e.target.value) || null;
                handleChange('prov_id', selected);
              }}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={loadingLookups}
            >
              <option value="">{loadingLookups ? 'Loading provinces...' : 'Select Province'}</option>
              {localProvinces.map((prov) => (
                <option key={prov._id} value={prov._id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">District</label>
            <select
              value={formData.district_id?._id || ''}
              onChange={(e) => {
                const selected = availableDistricts.find((dist: DistrictOption) => dist._id === e.target.value) || null;
                handleChange('district_id', selected);
              }}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={!formData.prov_id}
            >
              <option value="">{formData.prov_id ? 'Select District' : 'Select province first'}</option>
              {availableDistricts.map((dist: DistrictOption) => (
                <option key={dist._id} value={dist._id}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Input
            label="Longitude"
            value={formData.long}
            onChange={(e) => handleChange('long', e.target.value)}
          />
          <Input
            label="Latitude"
            value={formData.lat}
            onChange={(e) => handleChange('lat', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Registered From Wafaq"
          value={formData.reg_from_wafaq}
          onChange={(e) => handleChange('reg_from_wafaq', e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="Additional comments or notes"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-1">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export type { MadarisFormState };
export default AddMadarisModal;
