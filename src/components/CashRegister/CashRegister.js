import React from 'react'
import { Tabs, Table } from 'antd'
import { connect } from 'dva'
import { numberFormat } from 'utils'
import styles from '../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const TabPane = Tabs.TabPane

const CashRegister = ({
  listCashRegister
}) => {
  const columnsCashRegister = [{
    title: 'Period',
    dataIndex: 'period',
    key: 'Period',
    width: '100px'
  }, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '60px'
  }, {
    title: 'Shift',
    dataIndex: 'shiftName',
    key: 'shiftName',
    width: '150px'
  }, {
    title: 'Counter',
    dataIndex: 'counterName',
    key: 'counterName',
    width: '150px'
  }, {
    title: 'Opening',
    dataIndex: 'openingBalance',
    key: 'openingBalance',
    width: '150px',
    className: styles.alignRight,
    render: text => formatNumberIndonesia(text)
  }, {
    title: 'Cash-In',
    dataIndex: 'cashIn',
    key: 'cashIn',
    width: '150px',
    className: styles.alignRight,
    render: text => formatNumberIndonesia(text)
  }, {
    title: 'Cash-Out',
    dataIndex: 'cashOut',
    key: 'cashOut',
    width: '150px',
    className: styles.alignRight,
    render: text => formatNumberIndonesia(text)
  }, {
    title: 'Closing',
    dataIndex: 'closingBalance',
    key: 'closingBalance',
    width: '150px',
    className: styles.alignRight,
    render: text => formatNumberIndonesia(text)
  }]

  const dataCashRegister = (
    <Table bordered
      pagination={false}
      scroll={{ x: '840px', y: 350 }}
      style={{ margin: '0px 5px', backgroundColor: '#FFF', maxHeight: '180px' }}
      columns={columnsCashRegister}
      dataSource={listCashRegister || []}
    />
  )
  const dataDetail = (
    <Table bordered
      pagination={false}
      style={{ margin: '0px 5px', backgroundColor: '#FFF' }}
    />
  )
  return (
    <Tabs type="card">
      <TabPane tab="List" key="1">
        <div className="service-reminders">{dataCashRegister}</div>
      </TabPane>
      <TabPane tab="Detail" key="2">
        <div className="service-reminders">{dataDetail}</div>
      </TabPane>
    </Tabs>
  )
}

export default connect(({ cashier }) => ({ cashier }))(CashRegister)

