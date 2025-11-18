import React, { useState } from 'react';
import Modal from './UI/Modal';
import LeadCommunication from './LeadCommunication';

interface LeadViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any | null;
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({ open, onOpenChange, lead }) => {
  const [showCommunication, setShowCommunication] = useState(true);
  if (!lead) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`Lead: ${lead.title}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div style={{ background: '#f7f7f8', borderRadius: 8, padding: 12 }}>
          <div><strong>Status:</strong> {lead.status}</div>
          <div><strong>Priority:</strong> {lead.priority}</div>
          <div><strong>Department:</strong> {lead.departmentId?.name || '-'}</div>
          <div><strong>Section:</strong> {lead.sectionId?.name || '-'}</div>
          <div><strong>Assigned To:</strong> {lead.assignedToId?.name || '-'}</div>
        </div>

        <button onClick={() => setShowCommunication(v => !v)}>{showCommunication ? 'Hide' : 'Show'} Communication</button>

        {showCommunication && (
          <div style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid #eee' }}>
            <LeadCommunication leadId={lead._id} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LeadViewModal;
