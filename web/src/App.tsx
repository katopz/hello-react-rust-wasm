import React from 'react'
import { useCrate } from './hooks/useCrate'
import { useTakeEffect } from './hooks/useTakeEffect'
import logo from './logo.svg'
import './App.css'
import { useRequestAnimationFrame } from './hooks/useRequestAnimationFrame'
import { msToTime } from './utils/time'

const App: React.FC = () => {
  const mod = useCrate()
  const [response, setResponse] = React.useState<any>({
    pubkey: '',
    secret: ''
  })
  const { setRender, setIsRunning } = useRequestAnimationFrame()
  let time = 0

  const batch_size = 100
  time = Date.now()

  const renderer = () => {
    console.log('🔥gen_keypair')
    const resp = mod.gen_keypair('a', batch_size)
    console.log(resp)
    const json = JSON.parse(resp || '{}') as { pubkey: string; secret: string }

    if (json.pubkey) {
      const timeUse = Date.now() - time
      console.log(msToTime(timeUse))
      setResponse(json)
      setIsRunning(false)
    } else {
      console.log('again!')
      renderer()
    }
  }

  useTakeEffect(() => {
    if (!mod) return

    setRender(renderer)
    setIsRunning(true)
  }, [mod])

  const onClick = () => {
    console.log('again!')
    setIsRunning(true)
    renderer()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <small>{response.pubkey}</small>
        <small>{response.secret}</small>
        <button onClick={onClick}>gen</button>
      </header>
    </div>
  )
}

export default App
