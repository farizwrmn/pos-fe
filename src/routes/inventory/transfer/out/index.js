import React from 'react'
import PropTypes, { array } from 'prop-types'
import { Modal } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import ModalItem from './Modal'

const Transfer = ({ location, transferOut, pos, employee, app, dispatch, loading, misc }) => {
  const { listTrans, listItem, listStore, currentItem, currentItemList, modalVisible, modalConfirmVisible, formType, display, activeKey, searchVisible, pagination, disable } = transferOut
  const { modalProductVisible, listProduct } = pos
  const { listEmployee } = employee
  const { user, storeInfo } = app
  const filterProps = {
    display,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'transferOut/query',
        payload: {
          userName: value.cityName,
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'transferOut/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: listItem,
    loading: loading.effects['transferOut/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'transferOut/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'transferOut/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
      dispatch({
        type: 'transferOut/query',
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'transferOut/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'transferOut/changeTab',
        payload: {
          activeKey: key,
          formType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'transferOut/query',
        })
      }
    },
  }

  function getQueueQuantity(productId) {
    const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
    // const listQueue = _.get(queue, `queue${curQueue}`) ? _.get(queue, `queue${curQueue}`) : []
    let tempQueue = []
    let tempTrans = []
    const listQueue = _.get(queue, `queue1`) ? _.get(queue, `queue1`) : []
    for (let n = 0; n < 10; n += 1) {
      tempQueue = _.get(queue, `queue${n}`) ? _.get(queue, `queue${n}`) : []
      if (tempQueue.length > 0) {
        tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
      }
    }
    if (tempTrans.length > 0) {
      return tempTrans
    } else {
      console.log('queue is empty, nothing to check')
      return []
    }
  }

  const getCashierQuantity = () => {
    const cashier = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
    return cashier
  }

  const checkQuantityNewProduct = (e) => {
    const { data } = e
    const tempQueue = getQueueQuantity()
    const tempCashier = getCashierQuantity()
    const Cashier = tempCashier.filter(el => el.productId === data.productId)
    const Queue = tempQueue.filter(el => el.productId === data.productId)
    // const item = listItem.filter(el => el.productId === data.productId)
    let arrData = []
    arrData.push({...data})
    const totalData = arrData.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const totalLocal = (Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)) + Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const Quantity = (arrData.concat(Queue)).concat(Cashier)
    const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const tempListProduct = listProduct.filter(el => el.productId === data.productId)
    const totalListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
    if (totalQty > totalListProduct) {
      Modal.warning({
        title: 'No available stock',
        content: `Your input: ${totalData}, Local : ${totalLocal} Available: ${totalListProduct}`,
      })
      return false
    } else {
      return true
    }
  }
  const modalProductProps = {
    location: location,
    loading: loading,
    pos: pos,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel() { dispatch({ type: 'pos/hideProductModal' }) },
    handleProductBrowse() {
      dispatch({
        type: 'pos/getProducts',
        payload: {
          outOfStock: 0
        }
      })
    },
    onChooseItem(item) {
        let arrayProd = []
        const listByCode = listItem
        const checkExists = listByCode.filter(el => el.productCode === item.productCode)
        if (checkExists.length === 0) {
          arrayProd = listByCode
          const data = {
            no: arrayProd.length + 1,
            productCode: item.productCode,
            productId: item.id,
            transType: 'MUOUT',
            productName: item.productName,
            qty: 1,
            description: null
          }
          const check = {
            data
          }
          const checkQuantity = checkQuantityNewProduct(check)
          if (!checkQuantity) {
            return
          } else {
            arrayProd.push({...data})
          }
          dispatch({
            type: 'transferOut/updateState',
            payload: {
              listItem: arrayProd,
            }
          })
          dispatch({
            type: 'pos/updateState',
            payload: {
              modalProductVisible: false,
            }
          })
        } else {
          Modal.warning({
            title: 'Cannot add product',
            content: 'Already Exists in list'
          })
        }
    }
  }

  const formEditProps = {
    visible: modalVisible,
    currentItemList,
    onOkList(item) {
      const check = {
        data: item
      }
      // checkQuantityBeforeEdit
      dispatch({
        type: 'pos/queryProducts',
        payload: {
          outOfStock: 0
        }
      })
      const checkQuantity = checkQuantityNewProduct(check)
      if (!checkQuantity) {
        return
      } else {
        listItem[item.no - 1] = item        
      }
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false,
          listItem: listItem
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false
        }
      })
    },
    onDeleteItem (no) {
      dispatch({
        type: 'transferOut/deleteListState',
        payload: {
          no: no,
          listItem: listItem
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false
        }
      })
    }
  }
  const formConfirmProps = {
    visible: modalConfirmVisible,
    modalConfirmVisible,
    itemPrint: currentItem,
    user,
    storeInfo,
    onShowModal(item) {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint(item) {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
      // const check = {
      //   data: item
      // }
      // // checkQuantityBeforeEdit
      // dispatch({
      //   type: 'pos/queryProducts',
      //   payload: {
      //     outOfStock: 0
      //   }
      // })
      // const checkQuantity = checkQuantityNewProduct(check)
      // if (!checkQuantity) {
      //   return
      // } else {
      //   listItem[item.no - 1] = item        
      // }
      // dispatch({
      //   type: 'transferOut/updateState',
      //   payload: {
      //     currentItemList: {},
      //     modalVisible: false,
      //     listItem: listItem
      //   }
      // })
    },
    onCancel () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    ...formEditProps,
    ...formConfirmProps,
    listTrans,
    listItem,
    listStore,
    listEmployee,
    item: currentItem,
    modalProductProps,
    modalProductVisible,
    modalVisible,
    loading: loading.effects['transferOut/querySequence'],
    disabled: `${formType === 'edit' ? disable : ''}`,
    button: `${formType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, list) {
      dispatch({
        type: `transferOut/${formType}`,
        payload: {
          storeId: data.storeId,
          data: data,
          detail: list
        },
      })
    },
    getEmployee() {
      dispatch({
        type: 'employee/query',
        payload: {}
      })
    },
    hideEmployee() {
      dispatch({
        type: 'employee/updateState',
        payload: {
          listEmployee: {}
        }
      })
    },
    onModalVisible(record) {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: record,
          modalVisible: true
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          formType: 'add',
          currentItem: {},
          currentItemList: {},
        },
      })
    },
    showCities () {
      dispatch({
        type: 'transferOut/query',
      })
    },
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {modalVisible && <ModalItem {...formEditProps}/>}
    </div>
  )
}

Transfer.propTypes = {
  transferOut: PropTypes.object,
  pos: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ transferOut, pos, employee, app, loading }) => ({ transferOut, pos, employee, app, loading }))(Transfer)
