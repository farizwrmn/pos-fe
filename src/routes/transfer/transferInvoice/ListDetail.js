import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const Browse = ({
  handleModalShowList, listTransGroup, modalType, listItem, ...purchaseProps }) => {
  let columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        if (record.deliveryOrderNo) {
          return `Delivery Order: ${record.deliveryOrderNo}`
        }
        return text
      }
    },
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName'
    },
    {
      title: 'Amount',
      dataIndex: 'amountTransfer',
      key: 'amountTransfer',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Charge (%)',
      dataIndex: 'chargePercent',
      key: 'chargePercent',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Charge (N)',
      dataIndex: 'chargeNominal',
      key: 'chargeNominal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: (text, item) => {
        const total = (item.amountTransfer * (1 + (item.chargePercent / 100))) + item.chargeNominal
        return (total || '-').toLocaleString()
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    }
  ]
  if (modalType === 'edit') {
    columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Trans No',
        dataIndex: 'transferOut.transNo',
        key: 'transferOut.transNo',
        render: (text, record) => {
          if (record.deliveryOrderNo) {
            return `Delivery Order: ${record.deliveryOrderNo}`
          }
          return text
        }
      },
      {
        title: 'Employee',
        dataIndex: 'createdBy',
        key: 'createdBy'
      },
      {
        title: 'Amount',
        dataIndex: 'amountTransfer',
        key: 'amountTransfer',
        className: styles.alignRight,
        render: text => (text || '-').toLocaleString()
      },
      {
        title: 'Charge (%)',
        dataIndex: 'chargePercent',
        key: 'chargePercent',
        className: styles.alignRight,
        render: text => (text || '-').toLocaleString()
      },
      {
        title: 'Charge (N)',
        dataIndex: 'chargeNominal',
        key: 'chargeNominal',
        className: styles.alignRight,
        render: text => (text || '-').toLocaleString()
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        className: styles.alignRight,
        render: (text, item) => {
          const total = (item.amountTransfer * (1 + (item.chargePercent / 100))) + item.chargeNominal
          return (total || '-').toLocaleString()
        }
      },
      {
        title: 'Memo',
        dataIndex: 'memo',
        key: 'memo'
      }
    ]
  }

  const hdlModalShow = (record) => {
    handleModalShowList(record)
  }

  return (
    <Table
      {...purchaseProps}
      bordered={false}
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      onRowClick={_record => hdlModalShow(_record)}
      footer={() => (
        <div>
          <div>Total : {listTransGroup.reduce((cnt, item) => cnt + (parseFloat(item.amountTransfer) * (1 + (parseFloat(item.chargePercent) / 100))) + parseFloat(item.chargeNominal) || 0, 0).toLocaleString()}</div>
        </div>)
      }
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
