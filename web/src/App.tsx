import { useEffect, useState } from 'react'
import './App.css'
import { useWasm } from './hooks/useWasm'

function App() {
  const mod = useWasm()
  const [foo, setFoo] = useState()

  useEffect(() => {
    if (!mod) return
    const fire = async () => {
      const result = await mod.fetch('https://raw.githubusercontent.com/katopz/hello-react-rust-wasm/master/package.json')
      setFoo(result)
    }
    fire()
  }, [mod])

  return <div className="App">{foo}</div>
}

export default App
