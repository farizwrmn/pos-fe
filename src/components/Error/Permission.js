import React from 'react'
import { Icon } from 'antd'

const Permission = () => {
  return (
    <h1 style={{ alignItems: 'center', textAlign: 'center' }} >
      <Icon style={{ fontSize: 40 }} type="exclamation-circle-o" />
      <br />
      You do not have access to view this page, please report to your Account Administrator
    </h1>
  )
}

export default Permission
