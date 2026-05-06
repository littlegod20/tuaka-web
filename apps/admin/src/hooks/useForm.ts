import { useState } from 'react'

export function useForm<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function reset() {
    setValues(initial)
  }

  return { values, handleChange, reset, setValues }
}