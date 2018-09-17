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
      render: text => `${moment(text).format('DD-MMM-YYYY')}`
    },
    {
      title: '08:00 - 08:59',
      dataIndex: 'count8',
      key: 'count8',
      className: styles.alignRight
    },
    {
      title: '09:00 - 09:59',
      dataIndex: 'count9',
      key: 'count9',
      className: styles.alignRight
    },
    {
      title: '10:00 - 10:59',
      dataIndex: 'count10',
      key: 'count10',
      className: styles.alignRight
    },
    {
      title: '11:00 - 11:59',
      dataIndex: 'count11',
      key: 'count11',
      className: styles.alignRight
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNo}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
