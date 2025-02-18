import { useEffect } from 'react'
import { AuthProvider, NotificationProvider } from '@/contexts'
import 'semantic-ui-css/semantic.min.css'
import '@/styles/globals.css'

export default function App(props) {
  const { Component, pageProps } = props

  return (
    <AuthProvider>
      {/* <SocketProvider> */}
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      {/* </SocketProvider> */}
    </AuthProvider>
  )
}
