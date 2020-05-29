import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'

const Container = ({
  dispatch,
  balance
}) => {
  const { listBalance } = balance

  const listProps = {
    dispatch,
    listBalance
  }

  return (
    <div className="content-inner">
      <List {...listProps} />
    </div>
  )
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
