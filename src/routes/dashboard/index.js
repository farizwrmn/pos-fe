import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { NumberCard, Sales } from './components'
import SalesDetail from './SalesDetail'
import Profit from './Profit'
import Product from './Product'

function Dashboard ({ dispatch, loading, fifoReport, dashboard, pos }) {
  const { data, numbers } = dashboard
  const { listPosDetail } = pos
  const { listRekap } = fifoReport
  const numberCards = numbers.map((item, key) => (<Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>))

  const salesDetailProps = {
    dispatch,
    dataSource: listPosDetail,
    pagination: false,
    width: 90,
    size: 'small',
    loading: loading.effects['pos/queryDashboard'],
    footer: () => {
      return (
        <a target="_blank" href="/report/pos/summary?activeKey=4">
          Go to report
        </a>
      )
    }
  }

  const sales = listRekap.reduce((prev, next) => prev + parseFloat(next.posPrice), 0)
  const value = listRekap.reduce((prev, next) => prev + parseFloat(next.valuePrice), 0)

  const profitProps = {
    dataSource: [
      {
        title: 'Sales Total',
        value
      },
      {
        title: 'Cost',
        value: sales
      }
    ],
    pagination: false,
    width: 90,
    size: 'small',
    loading: loading.effects['fifo/queryFifoValues'],
    footer: () => {
      return (
        <a target="_blank" href="/report/fifo/value">
          Go to report
        </a>
      )
    }
  }

  const productProps = {
    dataSource: listRekap && listRekap.length > 0 ? listRekap.sort((a, b) => b.count - a.count).slice(0, 15) : [],
    pagination: false,
    width: 90,
    size: 'small',
    loading: loading.effects['fifo/queryFifoValues'],
    footer: () => {
      return (
        <a target="_blank" href="/stock?activeKey=1">
          Go to report
        </a>
      )
    }
  }

  return (
    <div>
      <Row gutter={24}>
        {numberCards}
        <Col lg={24} md={24}>
          <Card bordered={false}
            bodyStyle={{
              padding: '24px 36px 24px 0'
            }}
          >
            <Sales data={data} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        {numberCards}
        <Col lg={16} md={24}>
          <Product {...productProps} />
        </Col>
        <Col lg={2} md={24} />
        <Col lg={6} md={24}>
          <SalesDetail {...salesDetailProps} />
          <Profit {...profitProps} />
        </Col>
      </Row>
    </div>
  )
}

Dashboard.propTypes = {
  loading: PropTypes.object,
  pos: PropTypes.object,
  dashboard: PropTypes.object
}

export default connect(({ loading, dashboard, fifoReport, pos }) => ({ loading, dashboard, fifoReport, pos }))(Dashboard)
