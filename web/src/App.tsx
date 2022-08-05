import React, { useEffect, useRef, useState } from 'react'
import { msToTime } from './utils/time'

const BATCH_SIZE = 5000

class Miner {
  batch_size: number = BATCH_SIZE
  static mod: any
  pid: number = 0
  target: string = ''
  callback?: Function
  startTimestamp: number = 0
  previousTimestamp: number = 0
  elapsed: number = 0
  productCount: number = 0

  onStop?: Function
  onRun?: Function

  constructor(target: string = '', batch_size: number = BATCH_SIZE) {
    // !Miner.mod && import('./crate').then((mod) => (Miner.mod = mod))
    this.config(target, batch_size)
  }

  async init() {
    // import('./crate').then((mod) => (Miner.mod = mod))
    Miner.mod = await import('./crate')
    return this
  }

  config(target: string = '', batch_size: number = BATCH_SIZE) {
    this.target = target
    this.batch_size = batch_size
  }

  listen({ onRun, onStop }: { onRun: Function; onStop: Function }) {
    this.onStop = onStop
    this.onRun = onRun
  }

  step(_timestamp: number) {
    // this.target = ['aa', 'bb'][Math.round(Math.random())]
    // this.batch_size = 5000 // 1000 + 1000 * Math.round(Math.random())

    console.log(this.target, this.batch_size)
    if (this.startTimestamp === 0) this.startTimestamp = Date.now()

    const resp = Miner.mod.gen_keypair(this.target, this.batch_size)
    const json = JSON.parse(resp || '{}') as { pubkey: string; secret: string }
    console.log(json)
    this.elapsed = Date.now() - this.startTimestamp
    this.productCount += this.batch_size

    // output
    this.onRun && this.onRun(this.elapsed, this.productCount)

    if (json.pubkey) {
      this.callback && this.callback(json)
      this.stop()
      this.startTimestamp = 0
      this.productCount = 0
      return
    }

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
  const [batchSize, setBatchSize] = useState(BATCH_SIZE)
  const [processAmount, setProcessAmount] = useState(0)

  const [minterConfig, setMinterConfig] = useState({ startsWith: 'ok', batchSize: BATCH_SIZE })

  const inputBatchSizeRef = useRef<any>(0)

  useEffect(() => {
    console.log('new Miner')
    const miner = new Miner(minterConfig.startsWith, minterConfig.batchSize)
    miner.listen({
      onRun: (elapsed: number, amount: number) => {
        console.log(elapsed, amount)
        setProcessAmount(amount)
        elapsed ? setSpeed((1000 * amount) / elapsed) : setSpeed(amount)
      },
      onStop: (elapsed: number, _amount: number) => {
        setTimeUsed(elapsed)
        setIsRunning(false)
      }
    })

    miner.init().then(() => setMiner(miner))
  }, [minterConfig])

  useEffect(() => {
    if (!miner) return
    if (!isRunning) {
      miner.stop()
      return
    }

    miner.start(setKeyPair)
  }, [isRunning, miner])

  // useEffect(() => {
  //   if (!miner) return
  //   // miner.stop()
  //   // console.log('bz:', batchSize)
  //   miner.config('b', batchSize)

  //   // miner.start(setKeyPair)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [batchSize])

  const onClick = () => {
    setIsRunning(!isRunning)
  }

  const onClickBatchSize = () => {
    if (!inputBatchSizeRef.current.value) return
    const batchSize = inputBatchSizeRef.current.value

    console.log({ startsWith: 'ok', batchSize })

    setMinterConfig({ startsWith: 'ok', batchSize })
  }

  return (
    <div className="App">
      <input ref={inputBatchSizeRef} value={batchSize} onChange={(e) => setBatchSize(parseInt(e.target.value))}></input>
      <button onClick={onClickBatchSize}>OK</button>
      <br />
      <small>Process amount: {processAmount}</small>
      <br />
      <small>{isRunning ? `Running @ ${Math.round(speed)} key/s` : `Stopped: ${msToTime(timeUsed)} @ ${Math.round(speed)} key/s`}</small>
      <br />
      <small>{keypair && keypair.pubkey}</small>
      <br />
      <small>{keypair && keypair.secret}</small>
      <br />
      <button onClick={onClick}>{isRunning ? 'STOP' : 'RUN'}</button>
    </div>
  )
}

export default App
