/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import moment from 'moment'
import { formatNumberIndonesia } from 'utils'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '155px'
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: '155px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${text ? moment(text).format('DD-MMM-YYYY') : null}`
    },
    {
      title: 'Debit',
      dataIndex: 'amountIn',
      key: 'amountIn',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Credit',
      dataIndex: 'amountOut',
      key: 'amountOut',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: text => (
        <span>
          <Tag color={text === '1' ? 'green' : 'red'}>
            {text === '1' ? 'Active' : 'Non-active'}
          </Tag>
        </span >
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
