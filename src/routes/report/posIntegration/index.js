import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Filter from './Filter'

const Counter = ({ reportPosIntegration, loading, dispatch }) => {
  const { iframeUrl } = reportPosIntegration
  const filterProps = {
    loading: loading.effects['reportPosIntegration/queryEmbeddedUrl'],
    onFilterChange (value) {
      dispatch({
        type: 'reportPosIntegration/queryEmbeddedUrl',
        payload: {
          ...value
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <iframe
        title="Report"
        src={iframeUrl}
        frameBorder="0"
        width="100%"
        height="600"
        allowTransparency
      />
    </div>
  )
}

Counter.propTypes = {
  reportPosIntegration: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ reportPosIntegration, loading, app }) => ({ reportPosIntegration, loading, app }))(Counter)
