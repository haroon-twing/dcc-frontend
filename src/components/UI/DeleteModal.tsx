import React from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string | number | undefined | null;
  message: string;
  onSubmit: (id: string | number) => void;
  deleting?: boolean;
  title?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onOpenChange,
  id,
  message,
  onSubmit,
  deleting = false,
  title = 'Confirm Delete',
}) => {
  const closeModal = () => {
    if (!deleting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = () => {
    if (id !== undefined && id !== null) {
      onSubmit(id as string | number);
    }
  };

  return (
    <Modal open={open} onOpenChange={closeModal} title={title}>
      <div className="space-y-4">
        <p className="text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={closeModal}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={deleting || id === undefined || id === null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

