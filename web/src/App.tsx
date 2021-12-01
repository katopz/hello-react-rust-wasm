import React, { useEffect, useState } from 'react'
import { msToTime } from './utils/time'

class Miner {
  batch_size: number
  mod: any
  pid: number = 0
  callback?: Function
  startTimestamp: number = 0
  previousTimestamp: number = 0
  elapsed: number = 0
  productCount: number = 0

  onStop: Function
  onRun: Function

  constructor(batch_size: number = 100, { onRun, onStop }: { onRun: Function; onStop: Function }) {
    this.batch_size = batch_size
    this.onStop = onStop
    this.onRun = onRun
  }

  async init() {
    this.mod = await import('./crate')
  }

  step(timestamp: number) {
    if (this.startTimestamp === 0) this.startTimestamp = timestamp
    this.elapsed = timestamp - this.startTimestamp

    const resp = this.mod.gen_keypair('a', this.batch_size)
    const json = JSON.parse(resp || '{}') as { pubkey: string; secret: string }

    if (json.pubkey) {
      this.callback && this.callback(json)
      this.stop()
      this.startTimestamp = 0
      this.productCount = 0
      return
    }

    // output
    this.productCount += this.batch_size
    this.onRun && this.onRun(this.elapsed, this.productCount)

    // next
    this.pid = requestAnimationFrame(this.step.bind(this))
  }

  start(callback: Function) {
    this.pid = requestAnimationFrame(this.step.bind(this))
    this.callback = callback
  }

  stop() {
    cancelAnimationFrame(this.pid)
    this.onStop && this.onStop(this.elapsed, this.productCount)
  }
}

interface IKeypair {
  pubkey: string
  secret: string
}

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [miner, setMiner] = useState<Miner>()
  const [keypair, setKeyPair] = useState<IKeypair>()
  const [timeUsed, setTimeUsed] = useState(0)
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    const miner = new Miner(100, {
      onRun: (elapsed: number, amount: number) => {
        setSpeed((1000 * amount) / elapsed)
      },
      onStop: (elapsed: number) => {
        setTimeUsed(elapsed)
        setIsRunning(false)
      }
    })
    miner.init().then(() => setMiner(miner))
  }, [])

  useEffect(() => {
    if (!miner) return
    if (!isRunning) {
      miner.stop()
      return
    }

    miner.start(setKeyPair)
  }, [isRunning, miner])

  const onClick = () => {
    setIsRunning(!isRunning)
  }

  console.log('isRunning:', isRunning)

  return (
    <div className="App">
      <small>{isRunning ? `Running @ ${speed}key/sec` : `Stopped: ${msToTime(timeUsed)} @ ${speed}key/sec`}</small>
      <br />
      <small>{keypair && keypair.pubkey}</small>
      <br />
      <small>{keypair && keypair.secret}</small>
      <br />
      <button onClick={onClick}>{isRunning ? 'RUNNING' : 'RUN'}</button>
    </div>
  )
}

export default App
