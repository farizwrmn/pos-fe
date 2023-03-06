import React from 'react'
import { Card, Col, Row } from 'antd'
import { numberFormat } from 'utils'

const Profit = ({ summary }) => {
  const cardColumns = {
    xs: 24,
    sm: 24,
    md: 16,
    lg: 8,
    xl: 8
  }

  const itemColumns = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12
  }

  return (
    <Col span={24}>
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
    </Col>
  )
}

export default Profit
