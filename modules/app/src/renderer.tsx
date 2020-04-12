import ReactDOM from 'react-dom'
import React from 'react'
import { App } from './components/App'
import { AppController } from './logic/app-controller'

const { remote } = require('electron')

const dbLocation = require.resolve('../../../data/macaulay.sqlite')
console.log({ dbLocation })

async function init() {
  await AppController.init(dbLocation)
  ReactDOM.render(<App/>, document.getElementById('app'))
}

init().catch(console.error)

remote.getCurrentWindow().on('close', () => {
  if (AppController.isInitialized) {
    AppController.instance.dispose()
      .catch(console.error)
      .then(() => console.log('disposed app controller'))
  }
})
