import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'

const Container = () => {
  return (
    <div className="content-inner">
      History
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
