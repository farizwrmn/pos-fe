import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
import { connect } from 'dva'
import { lstorage } from 'utils'
import moment from 'moment'
import List from './List'

class Container extends React.Component {
  state = {
    allStore: false
  }

  onChange = () => {
    const { dispatch, balance } = this.props
    const { allStore } = this.state
    const { currentDate } = balance
    const month = moment(currentDate).format('MM')
    const year = moment(currentDate).format('YYYY')
    this.setState({
      allStore: !allStore
    })
    dispatch({
      type: 'balance/query',
      payload: {
        relationship: 1,
        history: 1,
        month,
        year,
        storeId: !allStore ? undefined : lstorage.getCurrentUserStore()
      }
    })
  }

  render () {
    const {
      app,
      dispatch,
      balance
    } = this.props
    const { allStore } = this.state
    const { listBalance } = balance
    const { user } = app
    console.log('user', user)


    const listProps = {
      allStore,
      dispatch,
      listBalance
    }

    return (
      <div className="content-inner">
        {user
          && user.permissions
          && (
            user.permissions.role === 'OWN'
            || user.permissions.role === 'SPR'
            || user.permissions.role === 'ADM'
          )
          && <Checkbox onChange={() => this.onChange()} checked={allStore}>All Store</Checkbox>}
        <List {...listProps} />
      </div>
    )
  }
}

Container.propTypes = {
  balance: PropTypes.object,
  // loading: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(
  ({
    balance,
    loading,
    app
  }) =>
    ({
      balance,
      loading,
      app
    })
)(Container)
