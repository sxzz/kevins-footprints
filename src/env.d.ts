declare module '*.yaml' {
  const value: import('./map').MapData
  export default value
}
