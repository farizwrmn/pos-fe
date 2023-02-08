import React from 'react'
import { Card, Col, Row } from 'antd'
import { numberFormat } from 'utils'

const Profit = ({ summary }) => {
  const cardColumns = {
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 8 },
    xl: { span: 8 }
  }

  const itemColumns = {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 12 }
  }

  return (
    <Row>
      <Col {...cardColumns}>
        <Card
          title={
            <div style={{ fontWeight: 'bolder' }}>
              LAPORAN LABA RUGI
            </div>
          }
          style={{
            fontSize: '13px'
          }}
        >
          <Row type="flex" justify="space-between" style={{ borderWidth: '0 0 1px 0', borderStyle: 'solid', paddingBottom: '15px' }}>
            <Col {...itemColumns}>
              Total Penjualan
            </Col>
            <Col {...itemColumns} style={{ textAlign: 'end' }}>
              Rp {numberFormat.numberFormatter(summary.total)}
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style={{ borderWidth: '0 0 1px 0', borderStyle: 'solid', padding: '15px 0' }}>
            <Col {...itemColumns}>
              Modal
            </Col>
            <Col {...itemColumns} style={{ textAlign: 'end' }}>
              Rp {numberFormat.numberFormatter(summary.capital)}
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style={{ borderWidth: '0 0 1px 0', borderStyle: 'solid', padding: '15px 0' }}>
            <Col {...itemColumns}>
              Payment Charge
            </Col>
            <Col {...itemColumns} style={{ textAlign: 'end' }}>
              Rp {numberFormat.numberFormatter(summary.charge)}
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style={{ borderWidth: '0 0 1px 0', borderStyle: 'solid', padding: '15px 0' }}>
            <Col {...itemColumns}>
              Komisi
            </Col>
            <Col {...itemColumns} style={{ textAlign: 'end' }}>
              Rp {numberFormat.numberFormatter(summary.commission)}
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style={{ paddingTop: '15px' }}>
            <Col {...itemColumns}>
              LABA KOTOR
            </Col>
            <Col {...itemColumns} style={{ textAlign: 'end' }}>
              Rp {numberFormat.numberFormatter(summary.profit)}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Profit
