import { AuthProvider, NotificationProvider } from '@/contexts'
import 'semantic-ui-css/semantic.min.css'
import '@/styles/globals.css'
import { NotificacionModal } from '@/components/Layouts'

export default function App(props) {
  const { Component, pageProps } = props

  return (
    <AuthProvider>
      {/* <SocketProvider> */}
        <NotificationProvider>
          <NotificacionModal />
          <Component {...pageProps} />
        </NotificationProvider>
      {/* </SocketProvider> */}
    </AuthProvider>
  )
}
