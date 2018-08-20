/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ dataSource, ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '100px'
    },
    {
      title: 'Mechanic',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '100px'
    },
    {
      title: 'Service Code',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: '155px'
    },
    {
      title: 'Service',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: '100px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => <p style={{ textAlign: 'left' }}>{text ? moment(text).format('DD-MMM-YYYY') : null}</p>
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text ? formatNumberIndonesia(text) : null}</p>
    }
  ]
  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNo}
      dataSource={dataSource}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
