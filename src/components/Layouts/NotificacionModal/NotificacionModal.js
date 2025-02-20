import { useEffect, useState } from 'react';
import { useNotifications } from '@/contexts';
import { Modal, Button } from 'semantic-ui-react';
import styles from './NotificacionModal.module.css'

export function NotificacionModal() {
  const { showNotification, hasNewNotification, resetNotification  } = useNotifications()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (hasNewNotification) {
      setOpen(true)
    }
  }, [hasNewNotification])

  const handleClose = () => {
    setOpen(false)
    resetNotification()
  };

  return (
    <>
      {showNotification && open &&  
        <Modal open={open} onClose={handleClose} size="small" className={styles.modal}>
          <Modal.Header className={styles.header}>
          <h1>Notificación</h1>
        </Modal.Header>
          <Modal.Content className={styles.content}>
            <div className={styles.main}>
              <h1>{showNotification?.message}</h1>
              <h1>{showNotification?.details}</h1>
            </div>
          </Modal.Content>
          <Modal.Actions className={styles.content}>
            <Button onClick={handleClose} primary>
              Cerrar
            </Button>
          </Modal.Actions>
        </Modal>
      }
    </>
  )
}
