/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'
import styles from 'themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => moment(text).format('lll')
    },
    {
      title: 'Invoice',
      dataIndex: 'pos.transNo',
      key: 'pos.transNo'
    },
    {
      title: 'Payment',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight,
      width: '175px',
      render: text => numberFormat.numberFormatter(text)
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      style={{ marginTop: '2rem' }}
      rowKey={record => record.transNo}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
