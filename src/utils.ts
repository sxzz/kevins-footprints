import { createSignal, onCleanup } from 'solid-js'

export function useDark() {
  const darkMedia = globalThis.matchMedia('(prefers-color-scheme: dark)')
  const [dark, setDark] = createSignal(darkMedia.matches)

  const ac = new AbortController()
  darkMedia.addEventListener('change', (event) => setDark(event.matches), {
    signal: ac.signal,
  })
  onCleanup(() => ac.abort())

  return dark
}
