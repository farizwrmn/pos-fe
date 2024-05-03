import React from 'react'
import PropTypes from 'prop-types'
import { Table, Icon, Modal } from 'antd'
import styles from '../../../themes/index.less'

const List = ({ dispatch, ...tableProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      className: styles.productPos
    },
    {
      title: 'Finish',
      dataIndex: 'checklist',
      key: 'checklist',
      width: '80px',
      className: styles.productPos,
      render: (text) => {
        if (text) {
          return <Icon type="check" />
        }
        return null
      }
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      className: styles.productPos,
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.productCode}</b></div>
            <div>{record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'orderQty',
      key: 'orderQty',
      width: '80px',
      className: styles.qtyPos
    },
    {
      title: 'Request',
      dataIndex: 'qty',
      key: 'qty',
      width: '80px',
      className: styles.qtyPos
    }
  ]

  const onModalClick = (record) => {
    Modal.confirm({
      title: 'Delete Delivery Order Item',
      content: 'Are you sure ?',
      onOk () {
        dispatch({
          type: 'deliveryOrderPacker/deleteDeliveryOrderCartItem',
          payload: {
            time: record.time
          }
        })
      }
    })
  }

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        simple
        locale={{
          emptyText: 'Your Transfer Out List'
        }}
        onRowClick={record => onModalClick({
          ...record,
          no: record.posit
        })}
        style={{ height: '400px' }}
        size="small"
        scroll={{ x: 1000, y: '370px' }}
        rowKey={record => record.time}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
