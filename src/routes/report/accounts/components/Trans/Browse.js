/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import moment from 'moment'
import styles from '../../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '155px'
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: '175px',
      render: text => `${moment(text).format('LL ')}`
    },
    {
      title: 'Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      width: '100px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString()
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      width: '100px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: text => (
        <span>
          <Tag color={text === 'PAID' ? 'green' : text === 'PARTIAL' ? 'yellow' : 'red'}>
            {(text || '')}
          </Tag>
        </span>
      )
    }
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: 1000, y: 300 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.transNo}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
