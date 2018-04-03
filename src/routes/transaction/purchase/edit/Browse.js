import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { configMain } from 'utils'
import styles from '../../../../themes/index.less'

const { prefix } = configMain
const Warning = Modal.warning

const Browse = ({
  modalShow, transNo, ...purchaseProps }) => {
  const dataBrowse = purchaseProps.purchase.dataBrowse ? purchaseProps.purchase.dataBrowse.filter(el => el.void !== 1) : {}
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Disc %',
      dataIndex: 'disc1',
      key: 'disc1',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Disc NML',
      dataIndex: 'discount',
      key: 'discount',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'PPN',
      dataIndex: 'ppn',
      key: 'ppn',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      key: 'ket',
      render: ket =>
        (<span>
          <Tag color={ket === 'edit' ? 'blue' : 'green'}>
            {ket === 'edit' ? 'EDIT' : 'ADD'}
          </Tag>
        </span>)
    }
  ]

  const hdlModalShow = (record) => {
    const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
    if (transNo.transDate < storeInfo.startPeriod) {
      Warning({
        title: 'Read-only Item',
        content: 'Cannot edit read-only Item'
      })
    } else {
      modalShow(record)
    }
  }

  return (
    <Table
      bordered
      scroll={{ x: 1300 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      dataSource={dataBrowse}
      onRowClick={_record => hdlModalShow(_record)}
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func.isRequired
}

export default Browse
