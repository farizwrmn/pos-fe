import { apiSubscribeNotification } from 'services/notification/subscribeService'
import { crypt } from 'utils'

const apiHeaderToken = crypt.apiheader()

function urlBase64ToUint8Array (base64String) {
  // eslint-disable-next-line no-mixed-operators
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const PUBLIC_VAPID_KEY = 'BDma5GOuAC5baiHlzPJ4cUAmhbn0ZnoOCzcEbj9vYx93QXO7lSFTgdP312gyZZcS-KPvTWDJ5afEFKS4Dsnpxqo'
const publicVapidKey = PUBLIC_VAPID_KEY

export const getSubscription = async () => {
  const register = await navigator.serviceWorker.register('/service-worker.js')

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  })
  const token = apiHeaderToken
  if (token && subscription) {
    const subscribe = JSON.parse(JSON.stringify(subscription))
    subscribe.type = 'web'
    return subscribe
  }
  return null
}

export async function triggerPushNotification () {
  if ('serviceWorker' in navigator) {
    const subscribe = await getSubscription()
    if (subscribe) {
      await apiSubscribeNotification(subscribe)
    }
  } else {
    console.error('Service workers are not supported in this browser')
  }
}
