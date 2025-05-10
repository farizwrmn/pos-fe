import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'


const Counter = ({ autoReplenish, userStore, productstock, loading, dispatch, location }) => {
  const { modalType, currentItem } = autoReplenish
  const { listAllStores } = userStore
  const { listPickingLine } = productstock

  const formProps = {
    modalType,
    loading,
    listStore: listAllStores.map(item => ({ id: item.value, label: item.storeName })),
    listPickingLine,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: 'autoReplenish/add',
        payload: {
          data,
          reset
        }
      })
    },
    onSubmitPkm (data, reset) {
      dispatch({
        type: 'autoReplenish/addPkm',
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
        type: 'autoReplenish/updateState',
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
  transferOut: PropTypes.object,
  autoReplenish: PropTypes.object,
  productstock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ autoReplenish, productstock, transferOut, loading, app }) => ({ autoReplenish, productstock, transferOut, loading, app }))(Counter)
