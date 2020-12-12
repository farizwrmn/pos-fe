import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isEmptyObject, lstorage, color, calendar } from 'utils'
import {
  currencyFormatter,
  numberFormatter
} from 'utils/string'
import { Badge, Icon, Table, Tabs, Tag } from 'antd'
import styles from '../../../themes/index.less'

const { dayByNumber } = calendar

const { getCashierTrans, getServiceTrans, getConsignment, getBundleTrans } = lstorage
const TabPane = Tabs.TabPane
const width = 1000

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
    console.log('record', record)
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

  const modalEditService = (record) => {
    dispatch({
      type: 'pos/getMechanics'
    })
    dispatch({
      type: 'pos/showServiceListModal',
      payload: {
        item: record,
        modalType: 'modalService'
      }
    })
  }

  const modalEditConsignment = (record) => {
    dispatch({
      type: 'pos/showConsignmentListModal',
      payload: {
        item: record,
        modalType: 'modalConsignment'
      }
    })
  }

  const modalEditBundle = () => {
    dispatch({
      type: 'pos/updateState',
      payload: {
        modalVoidSuspendVisible: true
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

  const product = getCashierTrans()
  const service = getServiceTrans()
  const consignment = getConsignment()

  const listTrans = product.map(item => ({ ...item, typeTrans: 'Product' }))
    .concat(service.map(item => ({ ...item, typeTrans: 'Service' })))
    .concat(consignment.map(item => ({ ...item, typeTrans: 'Consignment' })))
    .map((item, index) => ({ ...item, no: index + 1 }))

  return (
    <Tabs activeKey={paymentListActiveKey} onChange={key => changePaymentListTab(key)} >
      <TabPane tab={<Badge count={objectSize('cashier_trans')}>Product   </Badge>} key="1">
        <Table
          rowKey={(record, key) => key}
          bordered
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
              title: 'Product',
              dataIndex: 'code',
              width: '250px',
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
              width: '250px',
              className: styles.alignRight,
              render: (text, record) => {
                // const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                // const disc1 = record.disc1
                // const disc2 = record.disc2
                // const disc3 = record.disc3
                // const discount = record.discount
                const total = record.total
                return (
                  <div>
                    <strong>{`Total: ${currencyFormatter(total)}`}</strong>
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
      <TabPane tab={<Badge count={objectSize('service_detail')}>Service</Badge>} key="2">
        <Table
          rowKey={(record, key) => key}
          bordered
          size="small"
          scroll={{ x: '580px' }}
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
              title: 'Product',
              dataIndex: 'code',
              width: '250px',
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
              width: '250px',
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
          onRowClick={_record => modalEditService(_record)}
          dataSource={getServiceTrans()}
          style={{ marginBottom: 16 }}
        />
      </TabPane>
      <TabPane tab={<Badge count={objectSize('consignment')}>Consignment</Badge>} key="3">
        <Table
          rowKey={(record, key) => key}
          bordered
          size="small"
          scroll={{ x: '580px' }}
          locale={{
            emptyText: 'Your Consignment List'
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
              title: 'Product',
              dataIndex: 'code',
              width: '250px',
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
              width: '250px',
              className: styles.alignRight,
              render: (text, record) => {
                // const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                // const disc1 = record.disc1
                // const disc2 = record.disc2
                // const disc3 = record.disc3
                // const discount = record.discount
                const total = record.total
                return (
                  <div>
                    <div>
                      <strong>{`Total: ${currencyFormatter(total)}`}</strong>
                    </div>
                  </div>
                )
              }
            }
          ]}
          onRowClick={_record => modalEditConsignment(_record)}
          dataSource={getConsignment()}
          pagination={false}
          style={{ marginBottom: 16 }}
        />
      </TabPane>
      <TabPane tab={<Badge count={objectSize('bundle_promo')}>Bundle</Badge>} key="4">
        <Table
          rowKey={(record, key) => key}
          bordered
          size="small"
          scroll={{ x: '1000px' }}
          locale={{
            emptyText: 'Your Bundle List'
          }}
          onRowClick={_record => modalEditBundle(_record)}
          dataSource={getBundleTrans()}
          style={{ marginBottom: 16 }}
          columns={[
            {
              title: 'No',
              dataIndex: 'no',
              key: 'no',
              width: '47px',
              sortOrder: 'descend',
              sorter: (a, b) => a.no - b.no
            },
            {
              title: 'type',
              dataIndex: 'type',
              key: 'type',
              width: `${width * 0.115}px`,
              render: (text) => {
                return text === '0' ? 'Buy X Get Y' : 'Buy X Get Discount Y'
              }
            },
            {
              title: 'Code',
              dataIndex: 'code',
              key: 'code',
              width: `${width * 0.1}px`
            },
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              width: `${width * 0.15}px`
            },
            {
              title: 'Q',
              dataIndex: 'qty',
              width: '40px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Period',
              dataIndex: 'Date',
              key: 'Date',
              width: `${width * 0.15}px`,
              render: (text, record) => {
                return `${moment(record.startDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')} ~ ${moment(record.endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`
              }
            },
            {
              title: 'Available Date',
              dataIndex: 'availableDate',
              key: 'availableDate',
              width: `${width * 0.15}px`,
              render: (text) => {
                let date = text !== null ? text.split(',').sort() : <Tag color="green">{'Everyday'}</Tag>
                if (text !== null && (date || []).length === 7) {
                  date = <Tag color="green">{'Everyday'}</Tag>
                }
                if (text !== null && (date || []).length < 7) {
                  date = date.map(dateNumber => <Tag color="blue">{dayByNumber(dateNumber)}</Tag>)
                }
                return date
              }
            },
            {
              title: 'Available Hour',
              dataIndex: 'availableHour',
              key: 'availableHour',
              width: `${width * 0.1}px`,
              render: (text, record) => {
                return `${moment(record.startHour, 'HH:mm:ss').format('HH:mm')} ~ ${moment(record.endHour, 'HH:mm:ss').format('HH:mm')}`
              }
            }
          ]}
        />
      </TabPane>
      <TabPane tab={<Badge count={listTrans.count}>Sales</Badge>} key="5">
        <Table
          rowKey={(record, key) => key}
          bordered
          size="small"
          scroll={{ x: '580px' }}
          locale={{
            emptyText: 'Your Sales List'
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
              dataIndex: 'typeTrans',
              width: '150px'
            },
            {
              title: 'Product',
              dataIndex: 'code',
              width: '250px',
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
              width: '250px',
              className: styles.alignRight,
              render: (text, record) => {
                // const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                // const disc1 = record.disc1
                // const disc2 = record.disc2
                // const disc3 = record.disc3
                // const discount = record.discount
                const total = record.total
                return (
                  <div>
                    <div>
                      <strong>{`Total: ${currencyFormatter(total)}`}</strong>
                    </div>
                  </div>
                )
              }
            }
          ]}
          dataSource={listTrans}
          pagination={false}
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
