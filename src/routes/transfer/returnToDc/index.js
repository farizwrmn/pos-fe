import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Modal } from 'antd'
import Form from './Form'
import ModalProduct from './ModalProduct'
import ModalEditProduct from './ModalEditProduct'

const Counter = ({ loading, returnToDc, dispatch, location }) => {
  const {
    selectedTransfer,
    listItem,
    listProduct,
    modalProductVisible,
    currentItem,
    modalEditProductVisible,
    listReason
  } = returnToDc

  const modalEditProductProps = {
    listReason,
    visible: modalEditProductVisible,
    item: currentItem,
    onOk (item) {
      if (currentItem && currentItem.productId) {
        dispatch({
          type: 'returnToDc/editItem',
          payload: {
            item: {
              ...currentItem,
              description: item.description || 0,
              qty: item.qty || 0
            }
          }
        })
      }
    },
    onDeleteItem () {
      Modal.confirm({
        title: 'Delete this item',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'returnToDc/deleteItem',
            payload: {
              item: currentItem
            }
          })
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnToDc/updateState',
        payload: {
          modalEditProductVisible: false,
          currentItem: {}
        }
      })
    }
  }

  const listItemProps = {
    dataSource: listItem,
    onRowClick (item) {
      dispatch({
        type: 'returnToDc/updateState',
        payload: {
          modalEditProductVisible: true,
          currentItem: item
        }
      })
    }
  }

  const formProps = {
    loading,
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
          detail: listItem,
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
      {modalEditProductVisible && <ModalEditProduct {...modalEditProductProps} />}
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
