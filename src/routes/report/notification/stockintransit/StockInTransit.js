import React from 'react'
import moment from 'moment'
import { Collapse, Tag, Col } from 'antd'

const Panel = Collapse.Panel

const StockInTransit = ({ data }) => {
  let panels = []
  if (data.length > 0) {
    panels = data.map((x) => {
      let date = moment(x.transDate).format('DD-MMM-YYYY')
      let time = moment(x.transDate).format('HH:mm a')
      return (<Panel header={x.transNo} key={x.id}>
        <Col span={18}>
          <Col span={8}>Date</Col><Col span={1}>:</Col><Col span={15}>{date}</Col>
          <Col span={8}>Employee name</Col><Col span={1}>:</Col><Col span={15}>{x.employeeName}</Col>
          <Col span={8}>Store name</Col><Col span={1}>:</Col><Col span={15}>{x.storeName}</Col>
          <Col span={8}>Store name receiver</Col><Col span={1}>:</Col><Col span={15}>{x.storeNameReceiver}</Col>
        </Col>
        <Col span={6}>
          <Col span={8}>Time</Col><Col span={1}>:</Col><Col span={15}>{time}</Col>
          <Tag style={{ float: 'right', marginTop: 25 }} color={x.active ? 'blue' : 'red'}>{x.active ? 'Active' : 'Non-Active'}</Tag>
        </Col>
      </Panel>)
    }
    )
  }

  return (
    <div style={{ height: '300px', overflowX: 'hidden' }}>
      <Collapse accordion>
        {panels}
      </Collapse>
    </div>
  )
}

export default StockInTransit
