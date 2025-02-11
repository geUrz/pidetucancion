import { FaFileAlt, FaListOl, FaUser, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import styles from './BottomMenu.module.css'
import { useEffect, useRef, useState } from 'react'

export function BottomMenu() {

  const { user } = useAuth()

  const [keyCode, setKeyCode] = useState(false)
  
    const handleKeyCode = (event) => {
      if(event.ctrlKey && event.key === 'l') {
        setKeyCode((prevState) => !prevState)
      }
    }
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyCode)
  
      return () => {
        window.removeEventListener('keydown', handleKeyCode)
      }
    }, [])
  
    const gestureAreaRef = useRef(null)
  
    const handleTouchStart = (e) => {
      e.currentTarget.touchStartTime = e.timeStamp
    };
  
    const handleTouchEnd = (e) => {
      const touchDuration = e.timeStamp - e.currentTarget.touchStartTime
      if (touchDuration > 5000) {
        setKeyCode((prevState) => !prevState)
        console.log('Toque prolongado detectado')
      }
    };
  
    useEffect(() => {
      const element = gestureAreaRef.current;
      if (element) {
        element.addEventListener('touchstart', handleTouchStart)
        element.addEventListener('touchend', handleTouchEnd)
      }
  
      return () => {
        if (element) {
          element.removeEventListener('touchstart', handleTouchStart)
          element.removeEventListener('touchend', handleTouchEnd)
        }
      };
    }, [])

  return (

    <div className={styles.main} ref={gestureAreaRef}>
      <div className={styles.section}>
        <Link href='/' className={styles.tab}>
          <div>
            <FaFileAlt />
            <h1>Lista de <br />canciones</h1>
          </div>
        </Link>
        <Link href='/cancionesenfila' className={styles.tab}>
          <div>
            <FaListOl />
            <h1>Canciones <br />en fila</h1>
          </div>
        </Link>

        {user && user.nivel === 'admin' || keyCode ?
          <>
            <Link href='/usuarios' className={styles.tab}>
            <div>
              <FaUsers />
              <h1>Usuarios</h1>
            </div>
          </Link>
          <Link href='/usuario' className={styles.tab}>
            <div>
              <FaUser />
              <h1>Usuario</h1>
            </div>
          </Link>
          </> : null
        }

      </div>
    </div>

  )
}
