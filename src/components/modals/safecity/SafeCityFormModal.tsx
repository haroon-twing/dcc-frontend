import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { fetchLookups, fetchCities, type ProvinceOption, type DistrictOption, type CityOption } from '../../../lib/lookups';

export type { CityOption };

export interface SafeCityFormState {
  id?: string;
  province_id?: ProvinceOption | null;
  district_id?: DistrictOption | null;
  city_id?: CityOption | null;
  approval_date: string;
  present_status: string;
  per_present_status?: number;
  no_of_total_cameras: number;
  active_cameras: number;
  inactive_cameras: number;
  fr_cameras: number;
  non_fr_cameras: number;
  no_of_employees: number;
  remarks: string;
}

interface SafeCityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SafeCityFormState;
  setFormData: React.Dispatch<React.SetStateAction<SafeCityFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
}

const statusOptions = ['pending', 'in progress'];

const SafeCityFormModal: React.FC<SafeCityFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Safe City',
  submitLabel = 'Save',
  submitting = false,
}) => {
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [allDistricts, setAllDistricts] = useState<DistrictOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  useEffect(() => {
    const loadLookups = async () => {
      if (open) {
        try {
          setLoadingLookups(true);
          const [lookupsResult, citiesList] = await Promise.all([
            fetchLookups(),
            fetchCities(),
          ]);
          
          const { provinces: provs, districts: dists } = lookupsResult;
          setProvinces(provs);
          setAllDistricts(dists);
          setCities(citiesList);
        } catch (error) {
          console.error('Error loading lookups:', error);
        } finally {
          setLoadingLookups(false);
        }
      }
    };

    loadLookups();
  }, [open]);

  const handleChange = (key: keyof SafeCityFormState, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (key === 'province_id') {
        updated.province_id = value;
        updated.district_id = null;
        return updated;
      }
      if (key === 'no_of_total_cameras' || key === 'active_cameras' || key === 'inactive_cameras' || 
          key === 'fr_cameras' || key === 'non_fr_cameras' || key === 'no_of_employees' || key === 'per_present_status') {
        updated[key] = value === '' ? 0 : Number(value) || 0;
        return updated;
      }
      if (key === 'present_status' && value !== 'in progress') {
        // Clear percentage when status is not "in progress"
        updated.per_present_status = undefined;
      }
      (updated as any)[key] = value;
      return updated;
    });
  };

  const availableDistricts = React.useMemo(() => {
    if (!formData.province_id) {
      return [];
    }
    const provinceId = formData.province_id._id;
    return allDistricts.filter((dist) => dist.provinceId === provinceId);
  }, [formData.province_id, allDistricts]);

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title}
      size="xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Province <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.province_id?._id || ''}
              onChange={(e) => {
                const selectedProvince = provinces.find((p) => p._id === e.target.value);
                handleChange('province_id', selectedProvince || null);
              }}
              required
              disabled={submitting || loadingLookups}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province._id} value={province._id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.district_id?._id || ''}
              onChange={(e) => {
                const selectedDistrict = availableDistricts.find((d) => d._id === e.target.value);
                handleChange('district_id', selectedDistrict || null);
              }}
              required
              disabled={submitting || loadingLookups || !formData.province_id}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
            >
              <option value="">Select District</option>
              {availableDistricts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.city_id?._id || ''}
              onChange={(e) => {
                const selectedCity = cities.find((c) => c._id === e.target.value);
                handleChange('city_id', selectedCity || null);
              }}
              required
              disabled={submitting || loadingLookups}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Approval Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Approval Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formatDateForInput(formData.approval_date)}
              onChange={(e) => handleChange('approval_date', e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          {/* Present Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Present Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.present_status}
              onChange={(e) => handleChange('present_status', e.target.value)}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
            >
              <option value="">Select Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Percentage of Progress - Only show when "in progress" is selected */}
          {formData.present_status === 'in progress' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Progress Percentage <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.per_present_status || ''}
                onChange={(e) => handleChange('per_present_status', e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                required
                disabled={submitting}
              />
            </div>
          )}

          {/* Number of Employees */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Number of Employees <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.no_of_employees}
              onChange={(e) => handleChange('no_of_employees', e.target.value)}
              placeholder="0"
              min="0"
              required
              disabled={submitting}
            />
          </div>

          {/* Active Cameras */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Active Cameras <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.active_cameras}
              onChange={(e) => handleChange('active_cameras', e.target.value)}
              placeholder="0"
              min="0"
              required
              disabled={submitting}
            />
          </div>

          {/* Inactive Cameras */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Inactive Cameras <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.inactive_cameras}
              onChange={(e) => handleChange('inactive_cameras', e.target.value)}
              placeholder="0"
              min="0"
              required
              disabled={submitting}
            />
          </div>

          {/* FR Cameras */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              FR Cameras <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.fr_cameras}
              onChange={(e) => handleChange('fr_cameras', e.target.value)}
              placeholder="0"
              min="0"
              required
              disabled={submitting}
            />
          </div>

          {/* Non-FR Cameras */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Non-FR Cameras <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.non_fr_cameras}
              onChange={(e) => handleChange('non_fr_cameras', e.target.value)}
              placeholder="0"
              min="0"
              required
              disabled={submitting}
            />
          </div>

          {/* Number of Total Cameras */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Total Cameras <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.no_of_total_cameras}
              onChange={(e) => handleChange('no_of_total_cameras', e.target.value)}
              placeholder="0"
              min="0"
              required
              disabled={submitting}
            />
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Enter remarks"
              rows={3}
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || loadingLookups}
          >
            {submitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SafeCityFormModal;

