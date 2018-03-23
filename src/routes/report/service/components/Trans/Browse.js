/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ dataSource, ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '155px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${moment(text).format('LL ')}`
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
        dataSource={dataSource}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
