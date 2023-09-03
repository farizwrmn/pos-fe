import React from 'react'
import { Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ListBalance from './ListBalance'
import ListResolve from './ListResolve'
import ListJournal from './ListJournal'

class AddSetoranCashier extends React.Component {
  componentDidMount () {
    const { location, dispatch } = this.props
    const { from, to } = location.query
    if (!from || !to) {
      dispatch(routerRedux.push('/setoran/cashier'))
    }
  }

  render () {
    const listBalanceProps = {

    }

    const listResolveProps = {

    }

    const listGeneratedJournal = {

    }

    return (
      <div className="content-inner">
        <Row>
          <ListBalance {...listBalanceProps} />
        </Row>
        <Row>
          <ListResolve {...listResolveProps} />
        </Row>
        <Row>
          <ListJournal {...listGeneratedJournal} />
        </Row>
      </div>
    )
  }
}

export default connect()(AddSetoranCashier)
