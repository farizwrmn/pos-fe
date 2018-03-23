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
        <Col span={12}>Date: {date}</Col><Col span={12}>Time: {time}</Col>
        <p>Employee name: {x.employeeName}</p>
        <p>Store name: {x.storeName}</p>
        <p>Store name receiver: {x.storeNameReceiver}</p>
        <Tag color={x.active ? 'blue' : 'red'}>{x.active ? 'Active' : 'Non-Active'}</Tag>
      </Panel>)
    }
    )
  }

  return (
    <div style={{ marginTop: '20px', height: '300px', overflowX: 'hidden' }}>
      <Collapse accordion>
        {panels}
      </Collapse>
    </div>
  )
}

export default StockInTransit
