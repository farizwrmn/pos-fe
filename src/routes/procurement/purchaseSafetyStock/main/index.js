import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({
  purchaseSafetyStock,
  loading,
  dispatch,
  location
}) => {
  const {
    listDistributionCenter,
    listStore,
    modalType,
    currentItem
  } = purchaseSafetyStock

  const formProps = {
    modalType,
    item: currentItem,
    listDistributionCenter,
    listStore,
    loading,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseSafetyStock/add',
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
        type: 'purchaseSafetyStock/updateState',
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
  purchaseSafetyStock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseSafetyStock, loading, app }) => ({ purchaseSafetyStock, loading, app }))(Counter)
