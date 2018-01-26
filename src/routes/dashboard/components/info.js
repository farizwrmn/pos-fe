import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import styles from './info.less'
import { color } from 'utils'

const status = {
  1: {
    color: color.green,
  },
  2: {
    color: color.red,
  },
  3: {
    color: color.blue,
  },
  4: {
    color: color.yellow,
  },
}

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

function Info ({ ipAddress }) {
  ipAddress = localIp[0] || '127.0.0.1'
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      className: styles.name,
    }, {
      title: 'value',
      dataIndex: 'value',
      className: styles.value,
      render: (text, it) => <Tag color={status[it.status].color}>{text}</Tag>,
    },
  ]
  const data = [{ name: 'IP Address', value: `${ipAddress}`, status: 1 }]

  return <Table pagination={false} showHeader={false} columns={columns} rowKey={(record, key) => key} dataSource={data} />
}

Info.propTypes = {
  ipAddress: PropTypes.array,
}

export default Info
