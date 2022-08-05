import React from 'react'

export function useWasm() {
  const [wasm, setWasm] = React.useState<any>()

  React.useEffect(() => {
    ;(async () => {
      const mod = await import('../wasm')
      setWasm(mod)
    })()
  }, [])

  return wasm
}
