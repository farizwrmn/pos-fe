import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'

const Container = () => {
  return (
    <div className="content-inner">
      <List />
    </div>
  )
}

Container.propTypes = {
  // loading: PropTypes.object,
  // dispatch: PropTypes.func
}

export default connect(
  ({
    loading,
    app
  }) =>
    ({
      loading,
      app
    })
)(Container)
