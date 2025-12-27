import { ReactiveSet } from '@solid-primitives/set'
import { createDeferred, createSignal, For, Index, Show } from 'solid-js'
import data from '../data.yaml'
import { PlaceMarker, useMap } from './map'

export function App() {
  const container = (
    <div style={{ width: '100vw', height: '100vh' }}></div>
  ) as HTMLDivElement

  const activeLegends = new ReactiveSet<string>(data.map((item) => item.id))
  const map = useMap(container)

  const filteredData = createDeferred(() =>
    data.filter((item) => activeLegends.has(item.id)),
  )

  return (
    <>
      {container}

      <Show when={map()}>
        <For each={filteredData()}>
          {(item) => (
            <For each={item.places}>
              {(place) => (
                <PlaceMarker map={map()!} color={item.color} place={place} />
              )}
            </For>
          )}
        </For>
      </Show>

      <div class="absolute bottom-6 right-6 flex items-center gap-3 rounded-full bg-white/20 px-3 py-2 text-sm text-#111827 shadow-lg backdrop-blur-md dark-text-#f9fafb">
        <Index each={data}>
          {(item) => (
            <LegendItem
              id={item().id}
              label={item().label}
              color={item().color}
              onToggle={(value) => {
                if (value) {
                  activeLegends.add(item().id)
                } else {
                  activeLegends.delete(item().id)
                }
              }}
            />
          )}
        </Index>
      </div>
    </>
  )
}

export function LegendItem(props: {
  id: string
  label: string
  color: string
  onToggle?: (value: boolean) => void
}) {
  const [isActive, setIsActive] = createSignal(true)
  function onClick() {
    const newValue = !isActive()
    setIsActive(newValue)
    props.onToggle?.(newValue)
  }

  return (
    <div
      class="flex cursor-pointer items-center gap-1.4 whitespace-nowrap"
      classList={{ 'opacity-30': !isActive() }}
      onClick={onClick}
    >
      <span
        class="h-2.5 w-2.5 border-1 border-white rounded-full"
        style={{ background: props.color }}
        aria-hidden="true"
      />
      <span>{props.label}</span>
    </div>
  )
}
