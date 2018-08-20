import React from 'react'
import { Tabs, Table } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { numberFormat } from 'utils'
import styles from '../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const TabPane = Tabs.TabPane

const CashRegister = ({
  listCashRegister,
  onRowDoubleClick,
  changeTab,
  activeKey,
  listCashRegisterDetails
}) => {
  const columnsCashRegister = [{
    title: 'Period',
    dataIndex: 'period',
    key: 'period',
    width: '100px',
    render: text => moment(text).format('LL')
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

  const columnsCashRegisterDetails = [{
    title: 'Trans No',
    dataIndex: 'transNo',
    key: 'transNo',
    width: '130px'
  }, {
    title: 'Trans Date',
    dataIndex: 'transDate',
    key: 'transDate',
    width: '100px',
    render: text => moment(text).format('LL')
  }, {
    title: 'Problem',
    dataIndex: 'problemDesc',
    key: 'problemDesc',
    width: '200px'
  }, {
    title: 'Action',
    dataIndex: 'actionDesc',
    key: 'actionDesc',
    width: '200px'
  }, {
    title: 'Created',
    children: [
      {
        title: 'By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '100px'
      },
      {
        title: 'Time',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '150px',
        render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
      }
    ]
  },
  {
    title: 'Updated',
    children: [
      {
        title: 'By',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        width: '100px'
      },
      {
        title: 'Time',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: '150px',
        render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
      }
    ]
  }]

  const dataCashRegister = (
    <Table bordered
      pagination={false}
      scroll={{ x: '840px', y: 350 }}
      style={{ margin: '0px 5px', backgroundColor: '#FFF' }}
      columns={columnsCashRegister}
      dataSource={listCashRegister || []}
      onRowDoubleClick={record => onRowDoubleClick(record)}
    />
  )
  const dataDetail = (
    <Table bordered
      style={{ margin: '0px 5px', backgroundColor: '#FFF' }}
      columns={columnsCashRegisterDetails}
      scroll={{ x: 1100 }}
      dataSource={listCashRegisterDetails || []}
    />
  )
  return (
    <Tabs type="card" activeKey={activeKey} onChange={key => changeTab(key)}>
      <TabPane tab="List" key="0">
        <div className="service-reminders">{dataCashRegister}</div>
      </TabPane>
      <TabPane tab="Detail" key="1" disabled={!listCashRegisterDetails.length}>
        {activeKey === '1' && <div className="service-reminders">{dataDetail}</div>}
      </TabPane>
    </Tabs>
  )
}

export default connect(({ cashier }) => ({ cashier }))(CashRegister)

