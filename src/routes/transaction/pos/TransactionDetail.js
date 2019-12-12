import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isEmptyObject, lstorage, color, calendar } from 'utils'
import { Badge, Icon, Table, Tag, Tabs } from 'antd'
import styles from '../../../themes/index.less'

const { dayByNumber } = calendar
const { getCashierTrans } = lstorage
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

  const dataService = () => {
    let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
    return (service)
  }
  const dataBundle = () => {
    let data = localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []
    return data
  }

  return (
    <Tabs activeKey={paymentListActiveKey} onChange={key => changePaymentListTab(key)} >
      <TabPane tab={<Badge count={objectSize('cashier_trans')}>Product   </Badge>} key="1">
        <Table
          rowKey={(record, key) => key}
          pagination={{ pageSize: 5 }}
          bordered
          size="small"
          scroll={{ x: '1258px', y: '220px' }}
          locale={{
            emptyText: 'Your Payment List'
          }}
          columns={[
            {
              title: 'No',
              dataIndex: 'no',
              width: '35px'
            },
            {
              title: 'Code',
              dataIndex: 'code',
              width: '100px'
            },
            {
              title: 'Product Name',
              dataIndex: 'name',
              width: '160px'
            },
            {
              title: 'Q',
              dataIndex: 'qty',
              width: '40px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Price',
              dataIndex: 'sellPrice',
              width: '75px',
              className: styles.alignRight,
              render: (text, record) => (record.sellPrice - record.price > 0 ? record.sellPrice : record.price)
            },
            {
              title: 'Disc1(%)',
              dataIndex: 'disc1',
              width: '65px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Disc2(%)',
              dataIndex: 'disc2',
              width: '65px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Disc3(%)',
              dataIndex: 'disc3',
              width: '65px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Disc',
              dataIndex: 'discount',
              width: '75px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'D. Member',
              dataIndex: 'price',
              width: '75px',
              className: styles.alignRight,
              render: (text, record) => ((Math.max(0, record.sellPrice - record.price) || 0) * record.qty).toLocaleString()
            },
            {
              title: 'Total',
              dataIndex: 'total',
              width: '75px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Employee',
              dataIndex: 'employeeName',
              width: '100px',
              render: text => text
            },
            {
              title: 'Promo',
              dataIndex: 'bundleName',
              width: '100px',
              render: text => text
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
          pagination={{ pageSize: 5 }}
          bordered
          size="small"
          scroll={{ x: '1037px', y: '220px' }}
          locale={{
            emptyText: 'Your Payment List'
          }}
          columns={[
            {
              title: 'No',
              dataIndex: 'no',
              width: '41px'
            },
            {
              title: 'Code',
              dataIndex: 'code',
              width: '100px'
            },
            {
              title: 'Product Name',
              dataIndex: 'name',
              width: '160px'
            },
            {
              title: 'Q',
              dataIndex: 'qty',
              width: '40px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Price',
              dataIndex: 'sellPrice',
              width: '75px',
              className: styles.alignRight,
              render: (text, record) => (record.sellPrice - record.price > 0 ? record.sellPrice : record.price)
            },
            {
              title: 'Disc1(%)',
              dataIndex: 'disc1',
              width: '75px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Disc2(%)',
              dataIndex: 'disc2',
              width: '75px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Disc3(%)',
              dataIndex: 'disc3',
              width: '75px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Disc',
              dataIndex: 'discount',
              width: '75px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Total',
              dataIndex: 'total',
              width: '100px',
              className: styles.alignRight,
              render: text => (text || '-').toLocaleString()
            },
            {
              title: 'Employee',
              dataIndex: 'employeeName',
              width: '100px',
              render: text => text
            },
            {
              title: 'Promo',
              dataIndex: 'bundleName',
              width: '121px',
              render: text => text
            }
          ]}
          onRowClick={_record => modalEditService(_record)}
          dataSource={dataService()}
          style={{ marginBottom: 16 }}
        />
      </TabPane>
      <TabPane tab={<Badge count={objectSize('bundle_promo')}>Bundle</Badge>} key="3">
        <Table
          rowKey={(record, key) => key}
          pagination={{ pageSize: 5 }}
          bordered
          size="small"
          scroll={{ x: '1000px', y: '220px' }}
          locale={{
            emptyText: 'Your Bundle List'
          }}
          onRowClick={_record => modalEditBundle(_record)}
          dataSource={dataBundle()}
          style={{ marginBottom: 16 }}
          columns={[
            {
              title: 'No',
              dataIndex: 'no',
              key: 'no',
              width: '41px'
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
    </Tabs>
  )
}

TransactionDetail.propTypes = {
  pos: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default TransactionDetail
