import Link from 'next/link'
import styles from './Menu.module.css'
import { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';

export function Menu() {

  const [keyCode, setKeyCode] = useState(false)

  const gestureAreaRef = useRef(null)
  
    const handleTouchStart = (e) => {
      e.currentTarget.touchStartTime = e.timeStamp
    };
  
    const handleTouchEnd = (e) => {
      const touchDuration = e.timeStamp - e.currentTarget.touchStartTime
      if (touchDuration > 3000) {
        setKeyCode((prevState) => !prevState)
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

    <>
    
      <div className={styles.mainTop} ref={gestureAreaRef}>
        <Link href='/'>
          <h1>Pide tu canción</h1>
        </Link>
        {true ?
          <div className={styles.iconUser}>
            <Link href='/join/signin'>
              <FaUser />
            </Link> 
          </div> : null
        }
      </div>
    
    </>

  )
}
