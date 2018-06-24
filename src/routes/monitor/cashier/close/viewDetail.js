import React from 'react'
import { Tabs, Table, Row, Col, Icon } from 'antd'
import { connect } from 'dva'
import { formatNumberIndonesia } from 'utils'

const TabPane = Tabs.TabPane

const ViewDetail = ({
  listCashTransSummary,
  listCashTransDetail,
  showDetail,
  dispatch,
  activeTabKeyClose
}) => {
  let summary = { total: { openingCash:0, cashIn:0, cashOut: 0 }}
  if (listCashTransSummary) {
    if (listCashTransSummary.hasOwnProperty('data')) {
      summary.total.cashIn = listCashTransSummary.total[0].cashIn
      summary.total.cashOut = listCashTransSummary.total[0].cashOut
    }
  }
  summary.total.cashOnHand = summary.total.openingCash + summary.total.cashIn - summary.total.cashOut

  let detail = { total: { openingCash:0, cashIn:0, cashOut: 0 }}
  if (listCashTransDetail) {
    if (listCashTransDetail.hasOwnProperty('data')) {
      detail.total.cashIn = listCashTransDetail.total[0].cashIn
      detail.total.cashOut = listCashTransDetail.total[0].cashOut
    }
  }

  const handleView = (record) => {
    showDetail(record)
  }

  const columnsCashSummary = [{
    title: 'Trans Type',
    dataIndex: 'transType',
    key: 'transType',
    width: '60px'
  }, {
    title: 'Cash In',
    dataIndex: 'cashIn',
    key: 'cashIn',
    width: '200px',
    render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
  }, {
    title: 'Cash Out',
    dataIndex: 'cashOut',
    key: 'cashOut',
    width: '200px',
    render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
  }, {
    title: 'Detail',
    dataIndex: 'detail',
    key: 'detail',
    width: '60px',
    render: (text, record) => (
      <span>
        <p style={{ textAlign: 'center' }}>
          <a onClick={() => handleView(record.transType)}> View
            <Icon type="search" style={{paddingLeft: '8px'}}/>
          </a>
        </p>
      </span>
    )
  }]
  const columnsCashDetail = [{
    title: 'Trans No',
    dataIndex: 'transNo',
    key: 'transNo',
    width: '60px'
  }, {
    title: 'Trans Date',
    dataIndex: 'transDate',
    key: 'transDate',
    width: '60px'
  }, {
    title: 'Description',
    dataIndex: 'transDesc',
    key: 'transDesc',
    width: '200px'
  }, {
    title: 'Cash In',
    dataIndex: 'cashIn',
    key: 'cashIn',
    width: '100px',
    render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
  }, {
    title: 'Cash Out',
    dataIndex: 'cashOut',
    key: 'cashOut',
    width: '100px',
    render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
  }]

  const dataCashRegister = (
    <Table bordered pagination
           style={{ margin: '0px 5px', backgroundColor: '#FFF' }}
           columns={columnsCashSummary}
           dataSource={listCashTransSummary.data || []}
           footer={() =>
             <div>
               <Row>
                 <Col span={4}>
                   Opening Cash
                 </Col>
                 <Col offset={18} span={2} style={{ textAlign: 'right' }}>
                   {formatNumberIndonesia(0)}
                 </Col>
               </Row>
               <Row>
                 <Col offset={1} span={4}>
                   Cash-In
                 </Col>
                 <Col offset={17} span={2} style={{ textAlign: 'right' }}>
                   {formatNumberIndonesia(summary.total.cashIn)}
                 </Col>
               </Row>
               <Row>
                 <Col offset={1} span={4}>
                   Cash-Out
                 </Col>
                 <Col offset={17} span={2} style={{ textAlign: 'right' }}>
                   {formatNumberIndonesia(summary.total.cashOut)}
                 </Col>
               </Row>
               <Row>
                 <Col span={4}>
                   Cash-on Hand
                 </Col>
                 <Col offset={18} span={2} style={{ textAlign: 'right' }}>
                   {formatNumberIndonesia(summary.total.cashOnHand)}
                 </Col>
               </Row>
             </div>
           }
    />
  )

  const dataDetail = (
    <Table bordered pagination
           style={{ margin: '0px 5px', backgroundColor: '#FFF' }}
           columns={columnsCashDetail}
           dataSource={listCashTransDetail.data || []}
           footer={() =>
             <div>
               <Row>
                 <Col span={4}>
                   Total
                 </Col>
               </Row>
               <Row>
                 <Col offset={1} span={4}>
                   Cash-In
                 </Col>
                 <Col offset={17} span={2} style={{ textAlign: 'right' }}>
                   {formatNumberIndonesia(detail.total.cashIn)}
                 </Col>
               </Row>
               <Row>
                 <Col offset={1} span={4}>
                   Cash-Out
                 </Col>
                 <Col offset={17} span={2} style={{ textAlign: 'right' }}>
                   {formatNumberIndonesia(detail.total.cashOut)}
                 </Col>
               </Row>
             </div>
           }
    />
  )
  const changeTab = (key) => {
    dispatch({
      type: 'cashier/updateState',
      payload: {
        activeTabKeyClose: (key || '0').toString()
      }
    })
  }

  return (
    <Tabs type="card" activeKey={activeTabKeyClose} onChange={key => changeTab(key)}>
      <TabPane tab="List" key="1">
        <div className="service-reminders">{dataCashRegister}</div>
      </TabPane>
      <TabPane tab="Detail" key="2">
        <div className="service-reminders">{dataDetail}</div>
      </TabPane>
    </Tabs>
  )
}

export default connect(({ cashier }) => ({ cashier }))(ViewDetail)

