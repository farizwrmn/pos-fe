import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isEmptyObject, lstorage, color } from 'utils'
import {
  currencyFormatter,
  numberFormatter
} from 'utils/string'
import { Icon, Table, Tabs } from 'antd'
import styles from '../../../themes/index.less'

const TabPane = Tabs.TabPane

class TransactionDetail extends Component {
  state = {
    product: [],
    service: []
  }

  render () {
    const {
      dispatch,
      pos,
      product,
      service,
      consignment,
      listTrans = product.map(item => ({ ...item, type: 'Product' }))
        .concat(service.map(item => ({ ...item, type: 'Service' })))
        .concat(consignment.map(item => ({ ...item, type: 'Consignment' })))
        .map((item, index) => ({ ...item, no: index + 1 })),
      loading
    } = this.props
    const {
      paymentListActiveKey,
      cashierInformation
    } = pos

    let currentCashier = {
      cashierId: null,
      employeeName: null,
      shiftId: null,
      shiftName: null,
      counterId: null,
      counterName: null,
      period: null,
      status: null,
      cashActive: null
    }
    if (!isEmptyObject(cashierInformation)) currentCashier = cashierInformation

    const changePaymentListTab = (key) => {
      dispatch({
        type: 'pos/updateState',
        payload: {
          paymentListActiveKey: key
        }
      })
    }

    let infoCashRegister = {}
    infoCashRegister.title = 'Cashier Information'
    infoCashRegister.titleColor = color.normal
    infoCashRegister.descColor = color.error
    infoCashRegister.dotVisible = false
    infoCashRegister.cashActive = ((currentCashier.cashActive || '0') === '1')

    let checkTimeDiff = lstorage.getLoginTimeDiff()
    if (checkTimeDiff > 500) {
      console.log('something fishy', checkTimeDiff)
    } else {
      const currentDate = moment(new Date(), 'DD/MM/YYYY').subtract(lstorage.getLoginTimeDiff(), 'milliseconds').toDate().format('yyyy-MM-dd')
      if (!currentCashier.period) {
        infoCashRegister.desc = '* Select the correct cash register'
        infoCashRegister.dotVisible = true
      } else if (currentCashier.period !== currentDate) {
        if (currentCashier.period && currentDate) {
          const diffDays = moment.duration(moment(currentCashier.period, 'YYYY-MM-DD').diff(currentDate)).asDays()
          infoCashRegister.desc = `${diffDays} day${Math.abs(diffDays) > 1 ? 's' : ''}`
          infoCashRegister.dotVisible = true
        }
      }
      infoCashRegister.Caption = infoCashRegister.title + (infoCashRegister.desc || '')
      infoCashRegister.CaptionObject =
        (<span style={{ color: infoCashRegister.titleColor }}>
          <Icon type={infoCashRegister.cashActive ? 'smile-o' : 'frown-o'} /> {infoCashRegister.title}
          <span style={{ display: 'block', color: infoCashRegister.descColor }}>
            {infoCashRegister.desc}
          </span>
        </span>)
    }

    return (
      <Tabs activeKey={paymentListActiveKey} onChange={key => changePaymentListTab(key)} >
        <TabPane tab="Sales" key="1">
          <Table
            loading={loading}
            rowKey={(record, key) => key}
            bordered
            pagination={false}
            size="small"
            scroll={{ x: '680px' }}
            locale={{
              emptyText: 'Your Payment List'
            }}
            columns={[
              {
                title: 'No',
                width: '40px',
                dataIndex: 'no',
                sortOrder: 'descend',
                sorter: (a, b) => a.no - b.no
              },
              {
                title: 'Type',
                dataIndex: 'type'
              },
              {
                title: 'Product',
                dataIndex: 'code',
                width: '300px',
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
                width: '300px',
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
        </TabPane>
      </Tabs>
    )
  }
}

TransactionDetail.propTypes = {
  pos: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default TransactionDetail
