import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

const UserProfile = ({ userprofile }) => {
  const { data } = userprofile

  return (
    <div className="content-inner">
      aa
      {data}
    </div>
  )
}

UserProfile.propTypes = {
  userprofile: PropTypes.object
}

export default connect(({ userprofile, loading, app }) => ({ userprofile, loading, app }))(UserProfile)
