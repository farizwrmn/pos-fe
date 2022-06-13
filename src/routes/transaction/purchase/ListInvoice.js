import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { connect } from 'dva'
import styles from 'themes/index.less'
import { numberFormatter } from 'utils/string'

const ListInvoice = ({ onInvoiceHeader, listPurchaseOrder, onChooseInvoice, purchase, dispatch, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onChooseInvoice(record)
  }

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplier.supplierName',
      key: 'supplier.supplierName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'Qty',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        title={() => `Total: ${numberFormatter(listPurchaseOrder ? listPurchaseOrder.reduce((prev, next) => prev + (next.total), 0) : 0)}`}
        pagination={false}
        bordered
        columns={columns}
        simple
        size="small"
        rowKey={record => record.id}
        onRowClick={_record => handleMenuClick(_record)}
      />
    </div>
  )
}

ListInvoice.propTypes = {
  onChooseInvoice: PropTypes.func.isRequired,
  onInvoiceHeader: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.isRequired
}

export default connect(({ purchase }) => ({ purchase }))(ListInvoice)
