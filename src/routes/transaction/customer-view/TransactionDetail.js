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
      // qty,
      // netto,
      product,
      bundle,
      service,
      consignment,
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

    const listTrans = product
      .filter(filtered => !filtered.bundleId)
      .map(item => ({ ...item, type: 'Product' }))
      .concat(bundle ? bundle.map(item => ({ ...item, type: 'Bundle' })) : [])
      .concat(service.map(item => ({ ...item, type: 'Service' })))
      .concat(consignment.map(item => ({ ...item, type: 'Consignment' })))
      .sort((a, b) => a.inputTime - b.inputTime)
      .map((item, index) => ({ ...item, no: index + 1 }))
      .sort((a, b) => b.no - a.no)

    console.log('listTrans', listTrans)

    return (
      <div>
        <Table
          rowKey={(record, key) => key}
          bordered
          size="small"
          locale={{
            emptyText: 'Your Payment List'
          }}
          columns={[
            {
              title: 'No',
              width: '60px',
              dataIndex: 'no'
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
          rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
          loading={loading}
          pagination={false}
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
