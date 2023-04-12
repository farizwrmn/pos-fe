import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { DropOption } from 'components'
import { IMAGEURL, CONSIGNMENTIMAGEURL } from 'utils/config.company'
import { currencyFormatter } from 'utils/string'

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
      dataIndex: 'productImage',
      key: 'productImage',
      width: 150,
      textAlign: 'center',
      render: (value, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
            {(value || record.photo) ? <img alt={record.product_code} style={{ maxWidth: '150px', maxHeight: '150px', alignSelf: 'center' }} src={value ? `${IMAGEURL}/${value}` : `${CONSIGNMENTIMAGEURL}/${record.photo}`} /> : 'No Photo'}
          </div>
        )
      }
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      key: 'vendor.name',
      width: 150
    },
    {
      title: 'Kode Produk',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120
    },
    {
      title: 'Nama Produk',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 150
    },
    {
      title: 'Harga Jual',
      dataIndex: 'stock',
      key: 'stock',
      width: 150,
      render: value => (value ? currencyFormatter(Number(value.price)) : currencyFormatter(0))
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 120,
      render: value => value || '-'
    },
    {
      title: 'No. BPOM/PIRT',
      dataIndex: 'noLicense',
      key: 'noLicense',
      width: 120,
      render: value => value || '-'
    },
    {
      title: 'Berat',
      dataIndex: 'weight',
      key: 'weight',
      width: 60,
      render: value => value || '-'
    },
    {
      title: 'Kategori Utama',
      dataIndex: 'category.name',
      key: 'category.name',
      width: 120
    },
    {
      title: 'Sub Kategori',
      dataIndex: 'subcategory.name',
      key: 'subcategory.name',
      width: 120,
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
