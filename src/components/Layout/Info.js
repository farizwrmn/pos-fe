import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Tag } from 'antd'
import styles from './Info.less'
import { color, config, ip, lstorage } from 'utils'

const status = {
  1: { color: color.pastelgreen, },
  2: { color: color.lightskyblue, },
  3: { color: color.wewak, },
  4: { color: color.teagreen, },
  5: { color: color.pattensblue, },
  6: { color: color.lavenderrose, },
  7: { color: color.saffron, },
  8: { color: color.wisteria, },
}

const Info = ({ ipAddress, dispatch, app }) => {
  const { ipAddr } = app
  ipAddress = ip.getIpAddress() || '127.0.0.1'
  const sessionId = lstorage.getSessionId()

  if (!ipAddr) {
    dispatch({
      type: 'app/saveIPClient',
      payload: { ipAddr: ipAddress }
    })
  }

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      className: styles.name,
    }, {
      title: 'value',
      dataIndex: 'value',
      className: styles.value,
      render: (text, it) => <div className={styles.truncate} title={text}><Tag color={status[it.status].color}>{text}</Tag></div>,
    },
  ]

  const data = [
    { name: 'IP Address', value: `${ipAddress}`, status: 1 },
    { name: 'Version', value: `${config.version}`, status: 2 },
    { name: 'Session', value: `${sessionId}`, status: 3 },
  ]

  return <Table pagination={false} showHeader={false} bordered={false}
                size='small'
                columns={columns} rowKey={(record, key) => key} dataSource={data} />
}

Info.propTypes = {
  ipAddress: PropTypes.array,
  dispatch: PropTypes.func,
}

export default connect(({ ipAddress, app }) => ({ ipAddress, app }))(Info)
