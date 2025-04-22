//hooks
import { useLanguage } from 'r22n';
//components
import Button from 'frui/form/Button';
//views
import type { ModalConfirmProps } from '../types.js';

const ModalConfirm = ({ open, message, confirmed }: ModalConfirmProps) => {
  const { _ } = useLanguage();
  
  return (
    <div className="modal-confirm">
      <p className="message">{message}</p>
      <p className="alert">
        {_('This action cannot be undone.')}
      </p>
      <Button success className="confirm" onClick={() => {
        open(false);
        confirmed();
      }}>
        <i className="icon fas fa-fw fa-check"></i>
        {_('Confirm')}
      </Button>
      <Button error className="cancel" onClick={() => open(false)}>
        <i className="icon fas fa-fw fa-ban"></i>
        {_('Cancel')}
      </Button>
    </div>
  )
};

export default ModalConfirm;