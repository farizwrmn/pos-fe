const filesToCache = [
  '.',
  'index.html'
]
const CACHE_NAME = 'smiPOS20250505'

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        return caches.delete(key)
      }))
    })
  )
})

self.addEventListener('push', (event) => {
  const data = event.data.json()

  self.registration.showNotification(data.title, {
    body: data.content
  })
})

self.addEventListener('install', (event) => {
  // console.log('Attempting to install service worker and cache static assets')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        cache.delete('index.html')
        cache.delete('.')
        // return cache.addAll(filesToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  // console.log('Fetch event for ', event.request.url)
  event.respondWith(
    caches.match(event.request)
      .then((res) => {
        // console.log('Found ', event.request.url, ' in cache')
        // console.log('Network request for ', event.request.url)
        return res || fetch(event.request)
        // if (res) {
        //   console.log('Found ', event.request.url, ' in cache')
        //   return res
        // }
        // console.log('Network request for ', event.request.url)
        // return fetch(event.request)
      }).catch((error) => {
        console.log('ERROR', error)
      })
  )
})
