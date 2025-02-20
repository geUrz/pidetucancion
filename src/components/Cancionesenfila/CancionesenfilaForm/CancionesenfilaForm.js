import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './CancionesenfilaForm.module.css'

import { useNotifications } from '@/contexts'

export function CancionesenfilaForm(props) {

  const { user, reload, onReload, cancionData, onOpenCloseDonar, onToastSuccess, onCloseDetalles } = props

  const { socket } = useNotifications()

  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mensajeLength, setMensajeLength] = useState(0)

  const crearCancion = async (e) => {
    e.preventDefault()

    const estado = 'activa'

    const nuevaCancion = {
      usuario_id: user && user.nivel === 'admin' ? user.id : user.cantante_id,
      cancion: cancionData.cancion,
      cantante: cancionData.cantante,
      nombre,
      mensaje,
      estado
    }
    

    try {
      const res = await axios.post('/api/cancionesenfila/cancionesenfila', nuevaCancion)

      const cancionConId = res.data 

      if (socket) {
        socket.emit('nuevaCancion', cancionConId)
      }

      setNombre('')
      setMensaje('')
      setMensajeLength(0)

      onReload()
      onCloseDetalles()
      onToastSuccess()

    } catch (error) {
        console.error('Error al crear la canción:', error.response || error.message)
    }
  }

  const MAX_MESSAGE_LENGTH = 150

  const handleMensajeChange = (e) => {
    const newMensaje = e.target.value;
    if (newMensaje.length <= MAX_MESSAGE_LENGTH) {
      setMensaje(newMensaje)
      setMensajeLength(newMensaje.length)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <Form>
        <FormGroup widths='equal'>
          <FormField>
            <Label>Nombre (opcional)</Label>
            <Input
              type="text"
              placeholder='Tu nombre'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>Mensaje (opcional)</Label>
            <TextArea
              type="text"
              placeholder='Escribe tu mensaje o dedicatoria aquí'
              value={mensaje}
              onChange={handleMensajeChange}
            />
            <div className={styles.charCount}>
              {mensajeLength}/{MAX_MESSAGE_LENGTH}
            </div>
          </FormField>
        </FormGroup>
        <Button primary onClick={crearCancion}>Agregar</Button>
      </Form>

    </>

  )
}
