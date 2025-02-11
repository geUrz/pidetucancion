import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import styles from './CancionesdisponiblesForm.module.css'

export function CancionesdisponiblesForm(props) {

  const { reload, onReload, onToastSuccess, onCloseForm } = props

  const [cancion, setCancion] = useState('')
  const [cantante, setCantante] = useState('')

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!cancion) {
      newErrors.cancion = 'El campo es requerido'
    }

    if (!cantante) {
      newErrors.cantante = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const crearCancion = async (e) => {
    e.preventDefault()

    if(!validarForm()){
      return
    }

    try {
      await axios.post ('/api/listadecanciones/listadecanciones', {
        cancion, 
        cantante, 
      })

      setCancion('')
      setCantante('')

      onReload()
      onCloseForm()
      onToastSuccess()

    } catch (error) {
        console.error('Error al crear la canción:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onCloseForm} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cancion}>
            <Label>Canción</Label>
            <Input
              type="text"
              value={cancion}
              onChange={(e) => setCancion(e.target.value)}
            />
            {errors.cancion && <Message negative>{errors.cancion}</Message>}
          </FormField>
          <FormField error={!!errors.cantante}>
            <Label>Cantante</Label>
            <Input
              type="text"
              value={cantante}
              onChange={(e) => setCantante(e.target.value)}
            />
            {errors.cantante && <Message negative>{errors.cantante}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={crearCancion}>Crear</Button>
      </Form>

    </>

  )
}
