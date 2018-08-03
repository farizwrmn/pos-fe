/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../../themes/index.less'

const Browse = ({ transTime, ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${moment(text).format('DD-MMM-YYYY')}`
    },
    {
      title: '',
      dataIndex: 'count1',
      key: 'count1',
      className: styles.alignRight
    },
    {
      title: '',
      dataIndex: 'count2',
      key: 'count2',
      className: styles.alignRight
    },
    {
      title: '',
      dataIndex: 'count3',
      key: 'count3',
      className: styles.alignRight
    },
    {
      title: '',
      dataIndex: 'count4',
      key: 'count4',
      className: styles.alignRight
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
