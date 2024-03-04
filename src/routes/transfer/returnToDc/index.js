import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ returnToDc, dispatch, location }) => {
  const { selectedTransfer, currentItem } = returnToDc
  const formProps = {
    selectedTransfer,
    item: currentItem,
    button: 'Submit',
    onSearchTransfer (transNo) {
      dispatch({
        type: 'returnToDc/searchTransferOut',
        payload: {
          transNo
        }
      })
    },
    onSubmit (data, reset) {
      dispatch({
        type: 'returnToDc/add',
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'returnToDc/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Counter.propTypes = {
  returnToDc: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ returnToDc, loading, app }) => ({ returnToDc, loading, app }))(Counter)
