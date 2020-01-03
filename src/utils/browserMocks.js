const localStorageMock = (() => {
  let store = {}

  return ({
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
    removeItem: (key) => {
      store[key] = undefined
    }
  })
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})
