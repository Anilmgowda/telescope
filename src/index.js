import React from 'react'
import ReactDOM from 'react-dom'
import App from './component/App'
import { Provider } from 'react-redux'

import reducers from './store/reducers'
import { configureStore } from './config'

import './assets/scss/styles.scss'

const store = configureStore(reducers)

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
)
ReactDOM.render(jsx, document.querySelector('#root'))
