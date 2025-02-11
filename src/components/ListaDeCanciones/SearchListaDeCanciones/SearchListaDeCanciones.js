import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { ListaDeCancionesSearch } from '../ListaDeCancionesSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchListaDeCanciones.module.css';

export function SearchListaDeCanciones(props) {

  const {user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listadecanciones, setListadecanciones] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setListadecanciones([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`/api/listadecanciones/listadecanciones?search=${query}`)
        setListadecanciones(response.data)
      } catch (err) {
        setError('No se encontraron canciones')
        setListadecanciones([])
      } finally {
        setLoading(false)
      }
    };

    fetchData()
  }, [query])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar por canción o cantante..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          loading={loading}
        />
        <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
          <FaTimesCircle />
        </div>
      </div>

      <div className={styles.visitaLista}>
        {error && <p>{error}</p>}
        {listadecanciones.length > 0 && (
          <div className={styles.resultsContainer}>
            <ListaDeCancionesSearch user={user} listadecanciones={listadecanciones} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
