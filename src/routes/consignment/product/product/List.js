import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { DropOption } from 'components'
import { IMAGEURL, CONSIGNMENTIMAGEURL } from 'utils/config.company'

const List = ({ ...tableProps, showConfirm, onFilterChange }) => {
  const handleMenuClick = (record, event) => {
    if (event.key === '1') {
      showConfirm({ type: 'edit', id: record.id })
    }
    if (event.key === '2') {
      showConfirm({ type: 'delete', id: record.id })
    }
  }

  const columns = [
    {
      title: 'Action',
      width: 50,
      render: (_, record) => {
        return (
          <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: true }]} />
        )
      }
    },
    {
      title: 'Photo',
      dataIndex: 'productPhoto',
      key: 'productImage',
      width: '200px',
      render: (value, record) => {
        return (
          <img alt={record.product_code} width="100%" style={{ maxWidth: '200px' }} src={value ? `${IMAGEURL}/${value}` : record.photo ? `${CONSIGNMENTIMAGEURL}/${record.photo}` : 'null'} />
        )
      }
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      key: 'vendor.name'
    },
    {
      title: 'Kode Produk',
      dataIndex: 'product_code',
      key: 'product_code'
    },
    {
      title: 'Nama Produk',
      dataIndex: 'product_name',
      key: 'product_name'
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      render: value => value || '-'
    },
    {
      title: 'No. BPOM/PIRT',
      dataIndex: 'noLicense',
      key: 'noLicense',
      render: value => value || '-'
    },
    {
      title: 'Berat',
      dataIndex: 'weight',
      key: 'weight',
      render: value => value || '-'
    },
    {
      title: 'Kategori Utama',
      dataIndex: 'category.name',
      key: 'category.name'
    },
    {
      title: 'Sub Kategori',
      dataIndex: 'subcategory.name',
      key: 'subcategory.name',
      render: value => value || '-'
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
