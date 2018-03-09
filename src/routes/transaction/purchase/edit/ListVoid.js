import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { connect } from 'dva'


const ListProduct = ({ onRestoreVoid, purchase, dispatch, ...tableProps }) => {
  const handleMenuClick = (record) => {
    record.ket = 'edit'
    onRestoreVoid(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 100
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 100
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Disc %',
      dataIndex: 'disc1',
      key: 'disc1',
      width: 100,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Disc NML',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      width: 100,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'PPN',
      dataIndex: 'ppn',
      key: 'ppn',
      width: 50,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'KET',
      dataIndex: 'ket',
      key: 'ket',
      width: 100,
      render: ket =>
        (<span>
          <Tag color={ket === 'void' ? 'red' : 'green'}>
            {ket === 'void' ? 'VOID' : 'ADD'}
          </Tag>
        </span>)
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1050, y: 388 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={_record => handleMenuClick(_record)}
      />
    </div>
  )
}

ListProduct.propTypes = {
  onRestoreVoid: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect(({ purchase }) => ({ purchase }))(ListProduct)
