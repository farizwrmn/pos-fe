import React from 'react'
import { Card, Col, Row } from 'antd'

const lastCutOff = ({ lastCutOffDate }) => {
  return (
    <Row type="flex" justify="end">
      <Col span={24}>
        <Card
          bordered={false}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.0)', border: 0, margin: '5px 0 5px 0', flex: '0 0 70%' }}
          bodyStyle={{ backgroundColor: 'rgba(249,192,0,255)', border: 0 }}
        >
          Tanggal tutup periode terakhir Sales Cut Off adalah <strong>{lastCutOffDate}</strong>
        </Card>
      </Col>
    </Row>
  )
}

export default lastCutOff
