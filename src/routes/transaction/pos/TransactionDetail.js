import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isEmptyObject, lstorage, color } from 'utils'
import {
  currencyFormatter,
  discountFormatter,
  numberFormatter
} from 'utils/string'
import { Badge, Icon, Table, Tabs } from 'antd'
import styles from '../../../themes/index.less'

const { getCashierTrans } = lstorage
const TabPane = Tabs.TabPane

const TransactionDetail = ({
  dispatch,
  pos
}) => {
  const {
    paymentListActiveKey,
    cashierInformation
  } = pos

  const objectSize = (text) => {
    let queue = localStorage.getItem(text) ? JSON.parse(localStorage.getItem(text)) : []
    return (queue || []).length
  }

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

  const modalEditPayment = (record) => {
    dispatch({
      type: 'pos/getMechanics'
    })
    dispatch({
      type: 'pos/showPaymentModal',
      payload: {
        item: record,
        modalType: 'modalPayment'
      }
    })
  }

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
      <TabPane tab={<Badge count={objectSize('cashier_trans')}>Product   </Badge>} key="1">
        <Table
          rowKey={(record, key) => key}
          pagination={{ pageSize: 5 }}
          bordered
          size="small"
          scroll={{ x: '680px', y: '220px' }}
          locale={{
            emptyText: 'Your Payment List'
          }}
          columns={[
            {
              title: 'No',
              width: '40px',
              dataIndex: 'no'
            },
            {
              title: 'Product',
              dataIndex: 'code',
              width: '250px',
              render: (text, record) => {
                return (
                  <div>
                    <div>{`Product Code: ${record.code}`}</div>
                    <div>{`Product Name: ${record.name}`}</div>
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
              width: '250px',
              className: styles.alignRight,
              render: (text, record) => {
                const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                const disc1 = record.disc1
                const disc2 = record.disc2
                const disc3 = record.disc3
                const discount = record.discount
                const total = record.total
                return (
                  <div>
                    <div>{`Sell Price: ${currencyFormatter(sellPrice)}`}</div>
                    <div>{`Disc 1 + Disc 2 + Disc 3: ${discountFormatter(disc1)} + ${discountFormatter(disc2)} + ${discountFormatter(disc3)}`}</div>
                    <div>{`Disc (N): ${currencyFormatter(discount)}`}</div>
                    <div>
                      <strong>{`Total: ${currencyFormatter(total)}`}</strong>
                    </div>
                  </div>
                )
              }
            }
          ]}
          onRowClick={record => modalEditPayment(record)}
          dataSource={getCashierTrans()}
          style={{ marginBottom: 16 }}
        />
      </TabPane>
    </Tabs>
  )
}

TransactionDetail.propTypes = {
  pos: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default TransactionDetail
