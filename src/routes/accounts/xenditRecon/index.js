import { Col, Row, Tabs } from 'antd'
import { connect } from 'dva'
import React from 'react'
import Transaction from './transaction'
import Balance from './balance'
import ErrorLog from './errorLog'

const TabPane = Tabs.TabPane

const transactionColumnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12
}

class XenditRecon extends React.Component {
  render () {
    const { xenditRecon } = this.props
    const { activeKey } = xenditRecon
    return (
      <div className="content-inner">
        <Tabs activeKey={activeKey} type="card" tabBarExtraContent>
          <TabPane key="0" tab="Reconciliation">
            <Row>
              <Col {...transactionColumnProps}>
                <Transaction />
              </Col>
              <Col {...transactionColumnProps}>
                <Balance />
              </Col>
            </Row>
            <Row>
              <ErrorLog />
            </Row>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default connect(({
  xenditRecon
}) => ({ xenditRecon }))(XenditRecon)
