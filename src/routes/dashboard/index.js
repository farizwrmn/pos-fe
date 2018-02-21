import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { NumberCard, Sales, Info } from './components'
import { color } from 'utils'
import { format } from 'url'

function Dashboard ({ dashboard }) {
  const { data, numbers } = dashboard
  const numberCards = numbers.map((item, key) => (<Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>))

  return (
    <Row gutter={24}>
      {numberCards}
      <Col lg={18} md={24}>
        <Card bordered={false}
          bodyStyle={{
            padding: '24px 36px 24px 0'
          }}
        >
          <Sales data={data} />
        </Card>
      </Col>
    </Row>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
