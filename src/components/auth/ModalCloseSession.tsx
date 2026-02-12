import { Modal, Button, Message, Stack } from "rsuite";

type Props = {
  open: boolean;
  secondsLeft: number;
  onLogout: () => void;
  onContinue: () => void;
};

export function ModalCloseSession({
  open,
  onLogout,
  onContinue,
  secondsLeft,
}: Props) {
  return (
    <Modal
      open={open}
      backdrop="static"
      keyboard={false}
      size="sm"
      className="obrix-modal"
    >
      <div className="obrix-modal__accent" />

      <Modal.Header className="obrix-modal__header">
        <Stack spacing={12} alignItems="center">
          <div>
            <Modal.Title className="obrix-modal__title">
              <h4>Sesión por inactividad</h4>
            </Modal.Title>
            <div className="obrix-modal__subtitle">
              <span className="text-[#A4A2A1]">
                Por seguridad, detectamos 30 minutos sin actividad.
              </span>
            </div>
          </div>
        </Stack>
      </Modal.Header>

      <Modal.Body className="obrix-modal__body">
        <Message type="warning" showIcon className="obrix-modal__message">
          Si continúas, reiniciamos el contador. Si no, cerraremos la sesión.
        </Message>
      </Modal.Body>

      <Modal.Footer className="obrix-modal__footer">
        <Button
          appearance="primary"
          style={{ background: "#E4481C", borderColor: "#E4481C" }}
          onClick={onContinue}
          className="md:w-auto w-full"
        >
          Continuar
        </Button>

        <Button
          appearance="ghost"
          className="obrix-btn-ghost"
          onClick={onLogout}
        >
          Cerrar sesión ({secondsLeft})s
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
