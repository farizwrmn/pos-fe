import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  currencyFormatter,
  numberFormatter
} from 'utils/string'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

// const TabPane = Tabs.TabPane

class TransactionDetail extends Component {
  state = {
    product: [],
    service: []
  }

  render () {
    const {
      // dispatch,
      qty,
      netto,
      product,
      bundle,
      service,
      consignment,
      listTrans = product
        .filter(filtered => !filtered.bundleId)
        .map(item => ({ ...item, type: 'Product' }))
        .concat(bundle ? bundle.map(item => ({ ...item, type: 'Bundle' })) : [])
        .concat(service.map(item => ({ ...item, type: 'Service' })))
        .concat(consignment.map(item => ({ ...item, type: 'Consignment' })))
        .map((item, index) => ({ ...item, no: index + 1 })),
      loading
    } = this.props

    // const changePaymentListTab = (key) => {
    //   dispatch({
    //     type: 'pos/updateState',
    //     payload: {
    //       paymentListActiveKey: key
    //     }
    //   })
    // }

    return (
      <div>
        <Table
          title={() => (
            <div style={{ textAlign: 'right' }}>
              <div>Qty: {qty.toLocaleString()}</div>
              <div><strong>Netto: {netto.toLocaleString()}</strong></div>
            </div>
          )}
          loading={loading}
          rowKey={(record, key) => key}
          bordered
          pagination={false}
          size="small"
          rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
          locale={{
            emptyText: 'Your Payment List'
          }}
          columns={[
            {
              title: 'No',
              width: '60px',
              dataIndex: 'no',
              sortOrder: 'descend',
              sorter: (a, b) => a.no - b.no
            },
            {
              title: 'Product',
              dataIndex: 'code',
              width: '380px',
              render: (text, record) => {
                return (
                  <div>
                    <div><strong>{record.code}</strong>-{record.name}</div>
                  </div>
                )
              }
            },
            {
              title: 'Qty',
              dataIndex: 'qty',
              width: '40px',
              className: styles.alignCenter,
              render: text => numberFormatter((text).toLocaleString())
            },
            {
              title: 'Price',
              dataIndex: 'sellPrice',
              width: '120px',
              className: styles.alignRight,
              render: (text, record) => {
                const total = record.total
                return (
                  <div>
                    <strong>{`Total: ${currencyFormatter(total)}`}</strong>
                  </div>
                )
              }
            }
          ]}
          dataSource={listTrans}
          style={{ marginBottom: 16 }}
        />
      </div>
    )
  }
}

TransactionDetail.propTypes = {
  // dispatch: PropTypes.func.isRequired
}

export default TransactionDetail
