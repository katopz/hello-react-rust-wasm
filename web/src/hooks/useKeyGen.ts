import { useCallback, useEffect, useRef, useState } from 'react'
import { useCrate } from './useCrate'
import { msToTime } from '../utils/time'

interface IKeypair {
  pubkey: string
  secret: string
}

export const useKeyGen = () => {
  const mod: any = useCrate()
  const [keypair, setKeypair] = useState<IKeypair>({
    pubkey: '',
    secret: ''
  })
  // const { setRender, setIsRunning, isRunning } = useRequestAnimationFrame()
  const [isRunning, setIsRunning] = useState(false)
  const [timeUsed, setTimeUsed] = useState('')
  const [speed, setSpeed] = useState(0)

  const time = useRef(0)
  const count = useRef(0)
  const batch_size = 100

  const renderer = useCallback(() => {
    if (!mod) return
    if (!isRunning) return

    const resp = mod.gen_keypair('aa', batch_size)
    const json = JSON.parse(resp || '{}') as { pubkey: string; secret: string }

    const timeDiff = Date.now() - time.current
    if (json.pubkey) {
      setTimeUsed(msToTime(timeDiff))
      setKeypair(json)
      setIsRunning(false)
    } else {
      count.current += batch_size
      console.log('speed:', count.current / (timeDiff / 1000))
      setSpeed(count.current / (timeDiff / 1000))
      renderer()
    }
  }, [isRunning, mod, time])

  // useTakeEffect(() => {
  //   if (!mod) return
  //   // setIsRunning(false)
  //   // setRender(renderer)
  // }, [mod])

  useEffect(() => {
    time.current = Date.now()
    renderer()
  }, [isRunning, renderer])

  return { isRunning, setIsRunning, keypair, timeUsed, speed }
}
