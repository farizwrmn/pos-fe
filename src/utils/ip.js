const findIP = (onNewIP) => { //  onNewIp - your listener function for new IPs
  let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
  const pc = new MyPeerConnection({ iceServers: [] }),
    noop = function () {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
  function ipIterate (ip) {
    if (!localIPs[ip]) onNewIP(ip)
    localIPs[ip] = true
  }
  pc.createDataChannel('') // create a bogus data channel
  pc.createOffer((sdp) => {
    sdp.sdp.split('\n').forEach((line) => {
      if (line.indexOf('candidate') < 0) return
      line.match(ipRegex).forEach(ipIterate)
    })
    pc.setLocalDescription(sdp, noop, noop)
  }, noop) // create offer and set local description
  pc.onicecandidate = (ice) => { // listen for candidate events
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
  }
}
let localIp = []

findIP((ip) => { // get from app.js
  localIp.push(ip)
})

const getIpAddress = () => {
  return localIp[0]
}

module.exports = {
  getIpAddress
}