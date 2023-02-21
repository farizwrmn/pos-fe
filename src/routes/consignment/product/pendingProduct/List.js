import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { DropOption } from 'components'
import { CONSIGNMENTIMAGEURL, IMAGEURL } from 'utils/config.company'

const List = ({ ...tableProps, showConfirm, onFilterChange }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      showConfirm({ type: 'Approve', id: record.id })
    }
    if (e.key === '2') {
      showConfirm({ type: 'reject', id: record.id })
    }
  }

  const columns = [
    {
      title: 'Action',
      width: '50px',
      render: (_, record) => {
        return (
          <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Approve', disabled: false }, { key: '2', name: 'Reject', disabled: false }]} />
        )
      }
    },
    {
      title: 'Photo',
      dataIndex: 'productImage',
      key: 'productImage',
      width: '200px',
      render: (value, record) => <img alt={record.product_code} width="100%" style={{ maxWidth: '200px' }} src={value ? `${IMAGEURL}/${value}` : record.photo ? `${CONSIGNMENTIMAGEURL}/${record.photo}` : 'null'} />
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      width: 80,
      key: 'vendor.name'
    },
    {
      title: 'Kode Produk',
      dataIndex: 'product_code',
      width: 110,
      key: 'product_code'
    },
    {
      title: 'Nama Produk',
      width: 150,
      dataIndex: 'product_name',
      key: 'product_name'
    },
    {
      title: 'Barcode',
      width: 110,
      dataIndex: 'barcode',
      key: 'barcode'
    },
    {
      title: 'No. BPOM/PIRT',
      dataIndex: 'noLicense',
      width: 110,
      key: 'noLicense'
    },
    {
      title: 'Berat',
      dataIndex: 'weight',
      width: 60,
      key: 'weight'
    },
    {
      title: 'Kategori Utama',
      dataIndex: 'category.name',
      width: 110,
      key: 'category.name'
    },
    {
      title: 'Sub Kategori',
      dataIndex: 'subcategory.name',
      width: 110,
      key: 'subcategory.name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: value => value || '-'
    }
  ]

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  return (
    <Table {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 1500 }}
      rowKey={record => record.id}
      onChange={onChange}
    />
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
