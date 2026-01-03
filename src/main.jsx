import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'
import { auth0Config } from './auth/auth0-config'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
      onRedirectCallback={(appState) => {
        // The redirect will be handled by the Login/Signup components
        // This just ensures the URL is correct
        const returnTo = appState?.returnTo || '/dashboard'
        window.history.replaceState({}, document.title, returnTo)
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)


