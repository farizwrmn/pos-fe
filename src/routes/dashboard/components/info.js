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

function Info ({ ipAddress }) {
  console.log('ipAddress', ipAddress)
  ipAddress = ipAddress || '127.0.0.1'
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
  const data = [ {name: 'IP Address', value: `${ipAddress}`, status: 1 } ]

  return <Table pagination={false} showHeader={false} columns={columns} rowKey={(record, key) => key} dataSource={data} />
}

Info.propTypes = {
  ipAddress: PropTypes.array,
}

export default Info
