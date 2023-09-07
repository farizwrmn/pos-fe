import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { NumberCard, Sales } from './components'
import SalesDetail from './SalesDetail'
import Product from './Product'

function Dashboard ({ dispatch, loading, dashboard, pos }) {
  const { data, numbers, listPareto } = dashboard
  const { listPosDetail } = pos
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

  const productProps = {
    dataSource: listPareto,
    pagination: false,
    width: 90,
    size: 'small',
    loading: loading.effects['dashboard/queryPareto']
    // footer: () => {
    //   return (
    //     <a target="_blank" href="/stock?activeKey=1">
    //       Go to report
    //     </a>
    //   )
    // }
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
