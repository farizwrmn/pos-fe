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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((res) => {
        return res || fetch(event.request)
      }).catch((error) => {
        console.log('ERROR', error)
      })
  )
})
