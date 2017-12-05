import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import moment from 'moment'
import { NumberCard, Quote, Sales, Info, /*Weather,*/ RecentSales, Comments, Completed, Browser, Cpu, User } from './components'
import styles from './index.less'
import { color } from 'utils'
import { format } from 'url';
import { weekdays } from 'antd/node_modules/moment';

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fffff',
  },
}

function Dashboard({ dashboard }) {
  const { data, service, sales, info, quote, numbers, recentSales, comments, completed, browser, ipAddress, cpu, user } = dashboard

  const numberCards = numbers.map((item, key) => <Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>)

  return (
    <Row gutter={24}>
      {numberCards}
      <Col lg={18} md={24}>
        <Card bordered={false} bodyStyle={{
          padding: '24px 36px 24px 0',
        }}>
          <Sales data={data} />
        </Card>
      </Col>
      <Col lg={24} md={24}>
        <Card bordered={false} >
          <Info ipAddress={ipAddress} />
        </Card>
      </Col>
    </Row>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
