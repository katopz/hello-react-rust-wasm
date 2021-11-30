import React from 'react'
import { useKeyGen } from './hooks/useKeyGen'

const App: React.FC = () => {
  const { isRunning, setIsRunning, keypair, timeUsed, speed } = useKeyGen()

  const onClick = () => {
    setIsRunning(true)
  }

  return (
    <div className="App">
      <small>{isRunning ? `Running @ ${speed}` : `Stopped: ${timeUsed} @ ${speed}`}</small>
      <br />
      <small>{keypair.pubkey}</small>
      <br />
      <small>{keypair.secret}</small>
      <br />
      <button onClick={onClick} disabled={isRunning}>
        {isRunning ? 'RUNNING' : 'RUN'}
      </button>
    </div>
  )
}

export default App
