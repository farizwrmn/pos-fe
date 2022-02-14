import React from 'react'
import { connect } from 'dva'
import { Table, Tag } from 'antd'
import { color, config, lstorage } from 'utils'
import { version, versionInfo } from 'utils/config.main'
import styles from './Info.less'


const status = {
  1: { color: color.pastelgreen },
  2: { color: color.lightskyblue },
  3: { color: color.wewak },
  4: { color: color.teagreen },
  5: { color: color.pattensblue },
  6: { color: color.lavenderrose },
  7: { color: color.saffron },
  8: { color: color.wisteria }
}

const Info = () => {
  const sessionId = lstorage.getSessionId()

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      className: styles.name
    }, {
      title: 'value',
      dataIndex: 'value',
      className: styles.value,
      render: (text, it) => <div className={styles.truncate} title={it.title || text}><Tag color={status[it.status].color} style={{ fontSize: 8 }}>{text}</Tag></div>
    }
  ]

  const data = [
    { name: 'Version', value: `${version}`, title: `${versionInfo()}`, status: 2 },
    { name: 'Session', value: `${sessionId}`, status: 3 },
    { name: 'Service', value: `${config.apiHost}`, status: 4 }
  ]

  return (<Table pagination={false}
    showHeader={false}
    bordered={false}
    size="small"
    className="ant-table-info"
    columns={columns}
    rowKey={(record, key) => key}
    dataSource={data}
  />)
}

export default connect(({ app }) => ({ app }))(Info)
