import { useCallback, useState } from 'react'

export default function useToggle(initialState = false): [boolean, () => void] {
  const [state, setState] = useState(initialState)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const toggle = useCallback(() => setState(state => !state), [])
  return [state, toggle]
}
