/* @refresh reload */
import { render } from 'solid-js/web'
import { App } from './App.tsx'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles.css'

const root = document.querySelector('#root')

render(() => <App />, root!)
