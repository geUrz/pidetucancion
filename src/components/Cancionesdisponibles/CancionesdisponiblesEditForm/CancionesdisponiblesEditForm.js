import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import styles from './CancionesdisponiblesEditForm.module.css'

export function CancionesdisponiblesEditForm(props) {

  const { reload, onReload, cancionData, onOpenCloseEdit, actualizarCancion,onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    cancion: cancionData?.cancion || '',
    cantante: cancionData?.cantante || '',
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.cancion) {
      newErrors.cancion = 'El campo es requerido'
    }

    if (!formData.cantante) {
      newErrors.cantante = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/listadecanciones/listadecanciones?id=${cancionData.id}`, {
        ...formData
      })
      onReload()
      actualizarCancion(formData)
      onOpenCloseEdit()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la canción:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseEdit} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cancion}>
            <Label>
              Canción
            </Label>
            <Input
              type="text"
              name="cancion"
              value={formData.cancion}
              onChange={handleChange}
            />
            {errors.cancion && <Message negative>{errors.cancion}</Message>}
          </FormField>
          <FormField error={!!errors.cantante}>
            <Label>
              Cantante
            </Label>
            <Input
              type="text"
              name="cantante"
              value={formData.cantante}
              onChange={handleChange}
            />
            {errors.cantante && <Message negative>{errors.cantante}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
