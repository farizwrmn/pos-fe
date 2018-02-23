import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'

const UserProfile = ({ userprofile/* , loading, dispatch, location, app */ }) => {
  const { data } = userprofile
  // const { user, storeInfo } = app


  return (
    <div className="content-inner">
      aa
      {data}
    </div>
  )
}

UserProfile.propTypes = {
  userprofile: PropTypes.object
  // ,
  // loading: PropTypes.object,
  // location: PropTypes.object,
  // app: PropTypes.object,
  // dispatch: PropTypes.func
}

export default connect(({ userprofile, loading, app }) => ({ userprofile, loading, app }))(UserProfile)
