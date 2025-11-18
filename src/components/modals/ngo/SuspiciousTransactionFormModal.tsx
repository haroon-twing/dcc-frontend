import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface SuspiciousTransactionFormState {
  source_of_reported_transaction: string;
  nature_susp_trans: string;
  action_taken: string;
  remarks: string;
  transaction_date: string;
  amount: number;
  currency: string;
  status: string;
}

interface SuspiciousTransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SuspiciousTransactionFormState;
  setFormData: React.Dispatch<React.SetStateAction<SuspiciousTransactionFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const SuspiciousTransactionFormModal: React.FC<SuspiciousTransactionFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Suspicious Transaction',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof SuspiciousTransactionFormState, value: string | number) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="source_of_reported_transaction" className="block text-sm font-medium mb-1">
            Source of Reported Transaction <span className="text-red-500">*</span>
          </label>
          <Input
            id="source_of_reported_transaction"
            type="text"
            value={formData.source_of_reported_transaction}
            onChange={(e) => handleChange('source_of_reported_transaction', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter source of reported transaction"
          />
        </div>

        <div>
          <label htmlFor="nature_susp_trans" className="block text-sm font-medium mb-1">
            Nature of Suspicious Transaction <span className="text-red-500">*</span>
          </label>
          <Input
            id="nature_susp_trans"
            type="text"
            value={formData.nature_susp_trans}
            onChange={(e) => handleChange('nature_susp_trans', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter nature of suspicious transaction"
          />
        </div>

        <div>
          <label htmlFor="action_taken" className="block text-sm font-medium mb-1">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <Input
            id="action_taken"
            type="text"
            value={formData.action_taken}
            onChange={(e) => handleChange('action_taken', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter action taken"
          />
        </div>

        <div>
          <label htmlFor="transaction_date" className="block text-sm font-medium mb-1">
            Transaction Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="transaction_date"
            type="date"
            value={formData.transaction_date ? formData.transaction_date.split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value ? `${e.target.value}T00:00:00` : '';
              handleChange('transaction_date', dateValue);
            }}
            required
            disabled={viewMode}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ''}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              required
              disabled={viewMode}
              min="0"
              step="0.01"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">
              Currency <span className="text-red-500">*</span>
            </label>
            <Input
              id="currency"
              type="text"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              required
              disabled={viewMode}
              placeholder="Enter currency (e.g., PKR)"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            required
            disabled={viewMode}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select status</option>
            <option value="Reported">Reported</option>
            <option value="Not Reported">Not Reported</option>
          </select>
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            disabled={viewMode}
            placeholder="Enter remarks (optional)"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {!viewMode && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        )}
        {viewMode && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default SuspiciousTransactionFormModal;

