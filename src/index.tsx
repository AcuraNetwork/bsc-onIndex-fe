import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Providers from './Providers'

import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/tokens/updater'
import MulticallUpdater from './state/multicall/updater'

ReactDOM.render(
  // <React.StrictMode>
    <Providers>
      <ListsUpdater />
      <ApplicationUpdater />
      <MulticallUpdater />
      <App />
    </Providers>,
  // </React.StrictMode>,
  document.getElementById('root'),
)
