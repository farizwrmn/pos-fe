import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Icon } from 'antd'
import { routerRedux } from 'dva/router'
import { DropOption } from 'components'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const confirm = Modal.confirm

const List = ({ ...tableProps, dispatch, loadingModel, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } if (e.key === '2') {
      dispatch(routerRedux.push('/transaction/purchase/add'))
    } if (e.key === '3') {
      dispatch(routerRedux.push('/report/fifo/card'))
    } else if (e.key === '4') {
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
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      className: styles.alignRight,
      render: (text) => {
        if (!loadingModel.effects['productstock/showProductQty']) {
          return text || 0
        }
        return <Icon type="loading" />
      }
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
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist 01',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist 02',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Dist 03',
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
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
      render: text => (text || '-').toLocaleString()
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
          key: 'createdAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
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
          key: 'updatedAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
        }
      ]
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Purchase' },
              { key: '3', name: 'History' },
              { key: '4', name: 'Delete' }
            ]}
          />
        )
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
