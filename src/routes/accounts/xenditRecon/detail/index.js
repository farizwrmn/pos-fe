import { Row } from 'antd'
import { connect } from 'dva'
import React from 'react'
import ListBalance from './ListBalance'

class Detail extends React.Component {
  render () {
    return (
      <div className="content-inner">
        <Row>
          <ListBalance />
        </Row>
      </div>
    )
  }
}

export default connect(({
  xenditRecon
}) => ({ xenditRecon }))(Detail)
