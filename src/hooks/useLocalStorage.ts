import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const updateValue = (nextValue: T) => {
    setValue(nextValue)
    window.localStorage.setItem(key, JSON.stringify(nextValue))
  }

  return [value, updateValue] as const
}
