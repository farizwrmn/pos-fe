import React from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import Dashboard from '../../dashboard'

const Container = () => {
  return (
    <div className="content-inner">
      <Row>
        <Col md={24} lg={12}>
          <Dashboard />
        </Col>
        <Col md={24} lg={12}>
          <Dashboard />
        </Col>
      </Row>
    </div>
  )
}

Container.propTypes = {

}

export default connect(({ balance, loading, app }) => ({ balance, loading, app }))(Container)
