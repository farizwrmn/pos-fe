import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Container = ({ balance, shift, dispatch, location }) => {
  const { modalType, currentItem, disable } = balance
  const { listShift } = shift

  const formProps = {
    listShift: listShift || [],
    item: currentItem,
    dispatch,
    modalType,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    onSubmit (data) {
      dispatch({
        type: 'balance/open',
        payload: {
          data
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
        type: 'balance/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {currentItem && currentItem.id ?
        (<Form {...formProps} button="Close" />)
        : (<Form {...formProps} button="Open" />)}
    </div>
  )
}

Container.propTypes = {
  balance: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ balance, shift, loading, app }) => ({ balance, shift, loading, app }))(Container)
