import React from 'react'

export function useTakeEffect(fn: () => void | (() => void), deps: React.DependencyList) {
  React.useEffect(() => {
    if (deps.some((d) => !d)) return
    const destructor = fn()
    return () => {
      destructor && destructor()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
