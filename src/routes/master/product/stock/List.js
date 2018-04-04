import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'
import styles from '../../../../themes/index.less'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.productName} ?`,
        onOk () {
          deleteItem(record.productCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'Active' : 'Non-Active'}</Tag>
      }
    },
    {
      title: 'ID',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brandName'
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Dist 01',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Dist 02',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Track Qty',
      dataIndex: 'trackQty',
      key: 'trackQty',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'True' : 'False'}</Tag>
      }
    },
    {
      title: 'Alert Qty',
      dataIndex: 'alertQty',
      key: 'alertQty',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Exception',
      dataIndex: 'exception01',
      key: 'exception01',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'True' : 'False'}</Tag>
      }
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => {
        return text || 'no_image.png'
      }
    },
    {
      title: 'Dummy Code',
      dataIndex: 'dummyCode',
      key: 'dummyCode'
    },
    {
      title: 'Dummy Name',
      dataIndex: 'dummyName',
      key: 'dummyName'
    },
    {
      title: 'Brand ID',
      dataIndex: 'brandId',
      key: 'brandId'
    },
    {
      title: 'Usage Period',
      children: [
        {
          title: 'Day(s)',
          dataIndex: 'usageTimePeriod',
          key: 'usageTimePeriod',
          className: styles.alignRight,
          render: text => text || 0
        },
        {
          title: 'KM',
          dataIndex: 'usageMileage',
          key: 'usageMileage',
          className: styles.alignRight,
          render: text => (text || 0).toLocaleString()
        }
      ]
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy'
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt'
        }
      ]
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy'
        },
        {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt'
        }
      ]
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 2500 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
