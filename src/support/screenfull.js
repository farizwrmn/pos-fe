/*!
 * screenfull
 * v3.3.1 - 2017-07-07
 * (c) Sindre Sorhus; MIT License
 */
(function () {
  let document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {}
  let isCommonjs = typeof module !== 'undefined' && module.exports
  let keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element

  let fn = (function () {
    let val

    let fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // New WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ]

    let i = 0
    let l = fnMap.length
    let ret = {}

    for (; i < l; i += 1) {
      val = fnMap[i]
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i += 1) {
          ret[fnMap[0][i]] = val[i]
        }
        return ret
      }
    }

    return false
  }())

  let eventNameMap = {
    change: fn.fullscreenchange,
    error: fn.fullscreenerror
  }

  let screenfull = {
    request (elem) {
      let request = fn.requestFullscreen

      elem = elem || document.documentElement

      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      // Browser sniffing, since the alternative with
      // setTimeout is even worse.
      if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
        elem[request]()
      } else {
        elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT)
      }
    },
    exit () {
      document[fn.exitFullscreen]()
    },
    toggle (elem) {
      if (this.isFullscreen) {
        this.exit()
      } else {
        this.request(elem)
      }
    },
    onchange (callback) {
      this.on('change', callback)
    },
    onerror (callback) {
      this.on('error', callback)
    },
    on (event, callback) {
      let eventName = eventNameMap[event]
      if (eventName) {
        document.addEventListener(eventName, callback, false)
      }
    },
    off (event, callback) {
      let eventName = eventNameMap[event]
      if (eventName) {
        document.removeEventListener(eventName, callback, false)
      }
    },
    raw: fn
  }

  if (!fn) {
    if (isCommonjs) {
      module.exports = false
    } else {
      window.screenfull = false
    }

    return
  }

  Object.defineProperties(screenfull, {
    isFullscreen: {
      get () {
        return Boolean(document[fn.fullscreenElement])
      }
    },
    element: {
      enumerable: true,
      get () {
        return document[fn.fullscreenElement]
      }
    },
    enabled: {
      enumerable: true,
      get () {
        // Coerce to boolean in case of old WebKit
        return Boolean(document[fn.fullscreenEnabled])
      }
    }
  })

  if (isCommonjs) {
    module.exports = screenfull
  } else {
    window.screenfull = screenfull
  }
}())
