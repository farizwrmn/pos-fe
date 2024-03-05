import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import ModalProduct from './ModalProduct'

const Counter = ({ returnToDc, dispatch, location }) => {
  const { selectedTransfer, listItem, listProduct, modalProductVisible } = returnToDc
  const listItemProps = {
    dataSource: listItem
  }

  const formProps = {
    selectedTransfer,
    listItemProps,
    button: 'Submit',
    onShowProduct () {
      dispatch({
        type: 'returnToDc/updateState',
        payload: {
          modalProductVisible: true
        }
      })
    },
    onSearchTransfer (transNo) {
      dispatch({
        type: 'returnToDc/queryTransferOut',
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

  const listProductProps = {
    dataSource: listProduct,
    onRowClick (item) {
      dispatch({
        type: 'returnToDc/addItem',
        payload: {
          item
        }
      })
    }
  }

  const modalProductProps = {
    listProductProps,
    visible: modalProductVisible,
    listProduct,
    onSearchProduct (text) {
      dispatch({
        type: 'returnToDc/searchTransferOutDetail',
        payload: {
          searchText: text
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnToDc/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {modalProductVisible && <ModalProduct {...modalProductProps} />}
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
