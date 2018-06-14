import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Tabs } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { lstorage } from 'utils'
import Form from './Form'
import ModalItem from './Modal'
import ListTransfer from './ListTransferOut'
import FilterTransfer from './FilterTransferOut'

const TabPane = Tabs.TabPane

const Transfer = ({ location, transferOut, pos, employee, app, dispatch, loading }) => {
  const { listTransferOut, modalInvoiceVisible, listInvoice, tmpInvoiceList, isChecked, listProducts, listTransOut, period, listTrans, listItem, listStore, currentItem, currentItemList, modalVisible, modalConfirmVisible, formType, display, activeKey, pagination, disable, filter, sort, showPrintModal } = transferOut
  const { modalProductVisible, listProduct } = pos
  const { list } = employee
  let listEmployee = list
  const { user, storeInfo } = app
  const filterProps = {
    display,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'transferOut/query',
        payload: {
          userName: value.cityName,
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'transferOut/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    }
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
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'transferOut/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'transferOut/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'transferOut/delete',
        payload: id
      })
    }
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
          disable: ''
        }
      })
      if (key === '1') {
        dispatch({
          type: 'transferOut/query'
        })
      }
    }
  }

  function getQueueQuantity () {
    const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
    // const listQueue = _.get(queue, `queue${curQueue}`) ? _.get(queue, `queue${curQueue}`) : []
    let tempQueue = []
    let tempTrans = []
    for (let n = 0; n < 10; n += 1) {
      tempQueue = _.get(queue, `queue${n}`) ? _.get(queue, `queue${n}`) : []
      if (tempQueue.length > 0) {
        tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
      }
    }
    if (tempTrans.length > 0) {
      return tempTrans
    }
    console.log('queue is empty, nothing to check')
    return []
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
    arrData.push({ ...data })
    const totalData = arrData.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const totalLocal = (Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)) + Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const Quantity = (arrData.concat(Queue)).concat(Cashier)
    const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const tempListProduct = listProduct.filter(el => el.productId === data.productId)
    const totalListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
    if (totalQty > totalListProduct) {
      Modal.warning({
        title: 'No available stock',
        content: `Your input: ${totalData}, Local : ${totalLocal} Available: ${totalListProduct}`
      })
      return false
    }
    return true
  }
  const modalProductProps = {
    location,
    loading,
    pos,
    listInvoice,
    tmpInvoiceList,
    modalProductVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'pos/hideProductModal'
      })
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalInvoiceVisible: false
        }
      })
    },
    handleProductBrowse () {
      dispatch({
        type: 'pos/getProducts',
        payload: {
          outOfStock: 0
        }
      })
      dispatch({
        type: 'pos/showProductModal',
        payload: {
          modalType: 'browseProductFree'
        }
      })
    },
    handleInvoiceBrowse () {
      dispatch({
        type: 'transferOut/getInvoice'
      })
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalInvoiceVisible: true
        }
      })
    },
    onChooseItem (item) {
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
        }
        arrayProd.push({ ...data })

        dispatch({
          type: 'transferOut/updateState',
          payload: {
            listItem: arrayProd,
            currentItemList: data,
            modalVisible: true
          }
        })
        dispatch({
          type: 'pos/updateState',
          payload: {
            modalProductVisible: false
          }
        })
      } else {
        Modal.warning({
          title: 'Cannot add product',
          content: 'Already Exists in list'
        })
      }
    },
    onInvoiceHeader (period) {
      dispatch({
        type: 'transferOut/getInvoice',
        payload: {
          ...period
        }
      })
    },
    onChooseInvoice (item) {
      dispatch({
        type: 'transferOut/getInvoiceDetailPurchase',
        payload: item
      })
    }
  }

  const formEditProps = {
    visible: modalVisible,
    currentItemList,
    onOkList (item) {
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
      }
      listItem[item.no - 1] = item

      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false,
          listItem
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
          no,
          listItem
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
    onShowModal () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
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
    modalInvoiceVisible,
    modalVisible,
    loading: loading.effects['transferOut/querySequence'],
    disabled: `${formType === 'edit' ? disable : ''}`,
    button: `${formType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, list) {
      dispatch({
        type: `transferOut/${formType}`,
        payload: {
          storeId: data.storeId,
          data,
          detail: list
        }
      })
    },
    getEmployee () {
      dispatch({
        type: 'employee/query',
        payload: {}
      })
    },
    hideEmployee () {
      dispatch({
        type: 'employee/updateState',
        payload: {
          listEmployee: {}
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'pos/queryProducts',
        payload: {
          outOfStock: 0
        }
      })
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
          currentItemList: {}
        }
      })
    },
    showCities () {
      dispatch({
        type: 'transferOut/query'
      })
    }
  }

  const listTransferProps = {
    dataSource: listTransferOut,
    listTransferOut,
    listProducts,
    listTransOut,
    loading: loading.effects['transferOut/queryTransferOut'],
    location,
    filter,
    sort,
    storeInfo,
    showPrintModal,
    user,
    updateFilter (filters, sorts) {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          filter: filters,
          sort: sorts
        }
      })
    },
    getProducts (transNo) {
      dispatch({
        type: 'transferOut/queryProducts',
        payload: {
          transNo,
          storeId: lstorage.getCurrentUserStore()
        }
      })
    },
    getTrans (transNo, storeId) {
      dispatch({
        type: 'transferOut/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    },
    onShowPrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: true
        }
      })
    },
    onClosePrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: false
        }
      })
    }
  }

  const filterTransferProps = {
    period,
    filter: {
      ...location.query
    },
    filterChange (date) {
      dispatch({
        type: 'transferOut/queryTransferOut',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          period: date
        }
      })
    },
    filterTransNo (date, no) {
      dispatch({
        type: 'transferOut/queryTransferOut',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
          transNo: no
        }
      })
    }
  }

  let activeTabKey = '0'
  const changeTab = (key) => {
    activeTabKey = key
    if (activeTabKey === '1') {
      dispatch({
        type: 'transferOut/queryTransferOut',
        payload: {
          start: moment(period, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs type="card" defaultActiveKey={activeTabKey} onChange={key => changeTab(key)}>
        <TabPane tab="Add" key="0">
          <Form {...formProps} />
          {modalVisible && <ModalItem {...formEditProps} />}
        </TabPane>
        <TabPane tab="Archieve" key="1">
          <FilterTransfer {...filterTransferProps} />
          <ListTransfer {...listTransferProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Transfer.propTypes = {
  transferOut: PropTypes.object,
  pos: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ transferOut, pos, employee, app, loading }) => ({ transferOut, pos, employee, app, loading }))(Transfer)
