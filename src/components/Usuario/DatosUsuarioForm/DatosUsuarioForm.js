import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import styles from './DatosUsuarioForm.module.css'

export function DatosUsuarioForm(props) {

  const { user, usuarioData, reload, onReload, fieldToEdit, actualizarCancion, onShowCloseEditDatosUsuario } = props
  
  const [formData, setFormData] = useState({
    nombre: usuarioData?.nombre || '',
    artista: usuarioData?.artista || '',
    whatsapp: usuarioData?.whatsapp || '',
    facebook: usuarioData?.facebook || '',
    tiktok: usuarioData?.tiktok || '',
    instagram: usuarioData?.instagram || '',
    vimeo: usuarioData?.vimeo || '',
    youtube: usuarioData?.youtube || ''
  })
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const crearDatos = async (e) => {
    e.preventDefault()

    try {
      if (usuarioData?.usuario_id) {

        await axios.put(`/api/usuarios/datos_usuario?usuario_id=${usuarioData.usuario_id}`, {
          usuario_id: user.id,
          ...formData 
        })
      } else {
  
        await axios.post('/api/usuarios/datos_usuario', {
          usuario_id: user.id,
          ...formData
        })
      }

      setFormData({
        nombre: '',
        artista: '',
        whatsapp: '',
        facebook: '',
        tiktok: '',
        instagram: '',
        vimeo: '',
        youtube: ''
      })

      onReload()
      actualizarCancion(formData)
      onShowCloseEditDatosUsuario()

    } catch (error) {
      console.error('Error al enviar los datos:', error)
    }
  }

  return (
    <>
      <IconClose onOpenClose={onShowCloseEditDatosUsuario} />
      
      <Form>
        <FormGroup widths='equal'>
          {fieldToEdit === 'nombre' && (
            <FormField>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </FormField>
          )}
          {fieldToEdit === 'artista' && (
            <FormField>
              <Label>Tipo de artista</Label>
              <Input
                type="text"
                name="artista"
                value={formData.artista}
                onChange={handleInputChange}
              />
            </FormField>
          )}
          {fieldToEdit === 'whatsapp' && (
            <FormField>
              <Label>Whatsapp</Label>
              <Input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </FormField>
          )}
          {fieldToEdit === 'facebook' && (
            <FormField>
              <Label>Facebook</Label>
              <Input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder='https://www.facebook.com/miperfil'
              />
            </FormField>
          )}
          {fieldToEdit === 'tiktok' && (
            <FormField>
              <Label>Tiktok</Label>
              <Input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                placeholder='https://www.tiktok.com/@miperfil'
              />
            </FormField>
          )}
          {fieldToEdit === 'instagram' && (
            <FormField>
              <Label>Instagram</Label>
              <Input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder='https://www.instagram.com/miperfil'
              />
            </FormField>
          )}
          {fieldToEdit === 'vimeo' && (
            <FormField>
              <Label>Vimeo</Label>
              <Input
                type="text"
                name="vimeo"
                value={formData.vimeo}
                onChange={handleInputChange}
                placeholder='https://www.vimeo.com/watch?v=mivideo'
              />
            </FormField>
          )}
          {fieldToEdit === 'youtube' && (
            <FormField>
              <Label>Youtube</Label>
              <Input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                placeholder='https://www.youtube.com/watch?v=mivideo'
              />
            </FormField>
          )}
        </FormGroup>
        
        <Button primary onClick={crearDatos}>Guardar</Button>
      </Form>
    </>
  )
}
