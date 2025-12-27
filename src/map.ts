import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl, { type Map } from 'mapbox-gl'
import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { effect } from 'solid-js/web'
import { useDark } from './utils'
import 'mapbox-gl/dist/mapbox-gl.css'

// @unocss-include

interface Place {
  label: string
  coords: [number, number] | `${number},${number}`
  current?: boolean
}
export type MapData = {
  id: string
  color: string
  label: string
  places: Place[]
}[]

export function useMap(container: HTMLElement) {
  const [dark] = useDark()
  const style = createMemo(
    () => `mapbox://styles/mapbox/${dark() ? 'dark' : 'light'}-v10`,
  )

  const [map, setMap] = createSignal<Map>()
  onMount(() => {
    setMap(initMap())
  })

  onCleanup(() => {
    map()?.remove()
  })

  effect(() => {
    map()?.setStyle(style())
  })

  return map

  function initMap() {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container,
      style: style(),
      center: [100, 30],
      zoom: 2,
      projection: 'globe',
      dragRotate: true,
      touchPitch: true,
      attributionControl: false,
    })

    map.addControl(
      new MapboxLanguage({
        defaultLanguage: {
          'zh-cn': 'zh-Hans',
          'zh-hk': 'zh-Hant',
          'zh-tw': 'zh-Hant',
        }[navigator.language.toLowerCase()],
      }),
    )

    map.on('style.load', () => {
      map.setFog({
        color: 'rgba(0,0,0,0)',
        'high-color': 'rgba(255,255,255,0.1)',
        'space-color': 'rgba(0,0,0,0)',
        'horizon-blend': 0,
      })
    })

    return map
  }
}

export function PlaceMarker({
  map,
  id,
  place,
}: {
  map: Map
  id: string
  place: Place
}) {
  const { label, coords, current } = place

  const element = document.createElement('div')
  element.className = `mapbox-marker mapbox-marker--${id} ${
    current ? 'animate-pulse' : ''
  }`
  element.setAttribute('aria-label', label)
  element.tabIndex = 0

  const pos =
    typeof coords === 'string'
      ? (coords.split(',').map(Number).toReversed() as [number, number])
      : coords

  const marker = new mapboxgl.Marker({ element, anchor: 'center' })
    .setLngLat(pos)
    .addTo(map)

  const popup = new mapboxgl.Popup({
    offset: 8,
    closeButton: false,
    closeOnMove: false,
    focusAfterOpen: false,
  }).setText(label)

  const show = () => popup.setLngLat(pos).addTo(map)
  const hide = () => popup.remove()
  element.addEventListener('mouseenter', show)
  element.addEventListener('mouseleave', hide)
  element.addEventListener('focus', show)
  element.addEventListener('blur', hide)
  element.addEventListener('click', (evt) => {
    evt.stopPropagation()
    show()
  })
  map.on('click', hide)

  onCleanup(() => {
    marker.remove()
  })

  return null
}
