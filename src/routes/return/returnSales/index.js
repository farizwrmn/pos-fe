import React from 'react'
import PropTypes from 'prop-types'
import {
  // Modal,
  Tabs
} from 'antd'
import { connect } from 'dva'
import moment from 'moment'
// import { lstorage } from 'utils'
import Form from './Form'
import Browse from './Browse'
import ModalItem from './Modal'
// import ListTransfer from './ListTransferOut'
// import FilterTransfer from './FilterTransferOut'

// const { getCashierTrans } = lstorage
const TabPane = Tabs.TabPane

const ReturnSales = ({ location, returnSales, pos, app, dispatch, loading }) => {
  const {
    list: listReturnSales,
    // listInvoice,
    // tmpInvoiceList,
    // isChecked,
    // listProducts,
    // listTransOut,
    modalInvoiceVisible,
    modalProductVisible,
    period,
    listItem,
    currentItem,
    // currentItemList,
    modalEditItemVisible,
    modalConfirmVisible,
    // formType,
    // display,
    // activeKey,
    pagination
    // filter,
    // sort,
    // showPrintModal
  } = returnSales
  // const { modalProductVisible, listProductData, searchText } = pos
  const { user, storeInfo } = app
  // const filterProps = {
  //   display,
  //   filter: {
  //     ...location.query
  //   },
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'returnSales/query',
  //       payload: {
  //         userName: value.cityName,
  //         ...value
  //       }
  //     })
  //   },
  //   switchIsChecked () {
  //     dispatch({
  //       type: 'returnSales/switchIsChecked',
  //       payload: `${isChecked ? 'none' : 'block'}`
  //     })
  //   }
  // }

  const listProps = {
    dataSource: listItem,
    loading: loading.effects['returnSales/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'returnSales/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'returnSales/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'returnSales/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'returnSales/delete',
        payload: id
      })
    }
  }

  // const tabProps = {
  //   activeKey,
  //   changeTab (key) {
  //     dispatch({
  //       type: 'returnSales/changeTab',
  //       payload: {
  //         activeKey: key,
  //         formType: 'add',
  //         currentItem: {},
  //         disable: ''
  //       }
  //     })
  //     if (key === '1') {
  //       dispatch({
  //         type: 'returnSales/query'
  //       })
  //     }
  //   }
  // }

  // function getQueueQuantity () {
  //   const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
  //   // const listQueue = _.get(queue, `queue${curQueue}`) ? _.get(queue, `queue${curQueue}`) : []
  //   let tempQueue = []
  //   let tempTrans = []
  //   for (let n = 0; n < 10; n += 1) {
  //     tempQueue = _.get(queue, `queue${n}`) ? _.get(queue, `queue${n}`) : []
  //     if (tempQueue.length > 0) {
  //       tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
  //     }
  //   }
  //   if (tempTrans.length > 0) {
  //     return tempTrans
  //   }
  //   console.log('queue is empty, nothing to check')
  //   return []
  // }


  // const checkQuantityNewProduct = (e) => {
  //   const { data } = e
  //   const tempQueue = getQueueQuantity()
  //   const tempCashier = getCashierTrans()
  //   const Cashier = tempCashier.filter(el => el.productId === data.productId)
  //   const Queue = tempQueue.filter(el => el.productId === data.productId)
  //   // const item = listItem.filter(el => el.productId === data.productId)
  //   let arrData = []
  //   arrData.push({ ...data })
  //   const totalData = arrData.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  //   const totalLocal = (Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)) + Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  //   const Quantity = (arrData.concat(Queue)).concat(Cashier)
  //   const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  //   const listProduct = listProductData
  //   const tempListProduct = listProduct.filter(el => el.productId === data.productId)
  //   const totalListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
  //   if (totalQty > totalListProduct) {
  //     Modal.warning({
  //       title: 'No available stock',
  //       content: `Your input: ${totalData}, Local : ${totalLocal} Available: ${totalListProduct}`
  //     })
  //     return false
  //   }
  //   return true
  // }
  const modalProductProps = {
    location,
    loading,
    pos,
    // listInvoice,
    // tmpInvoiceList,
    // searchText,
    modalProductVisible,
    modalInvoiceVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (/* event */) {
      // dispatch({
      //   type: 'pos/getProducts',
      //   payload: {
      //     q: searchText === '' ? null : searchText,
      //     active: 1,
      //     page: Number(event.current),
      //     pageSize: Number(event.pageSize)
      //   }
      // })
    },
    showProductQty (data) {
      dispatch({
        type: 'pos/showProductQty',
        payload: {
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/hideProductModal'
      })
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          modalInvoiceVisible: false,
          modalProductVisible: false
        }
      })
    },
    onChooseItem (/* item */) {
      // let arrayProd = []
      // const listByCode = listItem
      // const checkExists = listByCode.filter(el => el.productCode === item.productCode)
      // if (checkExists.length === 0) {
      //   arrayProd = listByCode
      //   const data = {
      //     no: arrayProd.length + 1,
      //     productCode: item.productCode,
      //     productId: item.id,
      //     transType: 'MUOUT',
      //     productName: item.productName,
      //     qty: 1,
      //     description: null
      //   }
      //   const check = {
      //     data
      //   }
      //   const checkQuantity = checkQuantityNewProduct(check)
      //   if (!checkQuantity) {
      //     return
      //   }
      //   arrayProd.push({ ...data })

      //   dispatch({
      //     type: 'returnSales/updateState',
      //     payload: {
      //       listItem: arrayProd,
      //       currentItemList: data,
      //       modalEditItemVisible: true
      //     }
      //   })
      //   dispatch({
      //     type: 'pos/updateState',
      //     payload: {
      //       modalProductVisible: false
      //     }
      //   })
      // } else {
      //   Modal.warning({
      //     title: 'Cannot add product',
      //     content: 'Already Exists in list'
      //   })
      // }
    },
    onInvoiceHeader (period) {
      dispatch({
        type: 'pos/queryHistory',
        payload: {
          ...period
        }
      })
    },
    onChooseInvoice (item) {
      dispatch({
        type: 'returnSales/getInvoiceDetailPurchase',
        payload: item
      })
    }
  }

  const handleProductBrowse = () => {
    dispatch({
      type: 'pos/getProducts',
      payload: {
        active: 1
      }
    })
    dispatch({
      type: 'pos/getListProductData'
    })
    dispatch({
      type: 'pos/showProductModal',
      payload: {
        modalType: 'browseProductFree'
      }
    })
    dispatch({
      type: 'returnSales/updateState',
      payload: {
        modalProductVisible: true
      }
    })
  }

  const formEditProps = {
    visible: modalEditItemVisible,
    item: currentItem,
    modalProductProps,
    handleProductBrowse,
    onOkList (
      // item
    ) {
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
      // }
      // listItem[item.no - 1] = item

      // dispatch({
      //   type: 'returnSales/updateState',
      //   payload: {
      //     currentItemList: {},
      //     modalEditItemVisible: false,
      //     listItem
      //   }
      // })
    },
    onCancelList () {
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          currentItemList: {},
          modalEditItemVisible: false
        }
      })
    },
    onDeleteItem (no) {
      dispatch({
        type: 'returnSales/deleteListState',
        payload: {
          no,
          listItem
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          currentItemList: {},
          modalEditItemVisible: false
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
        type: 'returnSales/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
    listProps,
    formConfirmProps,
    modalConfirmVisible,
    listTrans: listReturnSales,
    listItem,
    item: currentItem,
    modalProductVisible,
    modalInvoiceVisible,
    loadingButton: loading,
    pos,
    loading: loading.effects['returnSales/querySequence'],
    disabled: false,
    button: 'Add',
    onSubmit (data, list) {
      dispatch({
        type: 'returnSales/add',
        payload: {
          storeId: data.storeId,
          data,
          detail: list
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'pos/queryProducts',
        payload: {
          active: 1
        }
      })
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          currentItemList: record,
          modalEditItemVisible: true
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          formType: 'add',
          currentItem: {},
          currentItemList: {}
        }
      })
    },
    handleProductBrowse,
    handleInvoiceBrowse () {
      dispatch({
        type: 'pos/queryHistory',
        payload: {
          startPeriod: moment().startOf('month').format('YYYY-MM-DD'),
          endPeriod: moment().endOf('month').format('YYYY-MM-DD')
        }
      })
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalType: 'modalInvoice'
        }
      })
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          modalInvoiceVisible: true
        }
      })
    }
  }

  // const listTransferProps = {
  //   dataSource: listReturnSales,
  //   listReturnSales,
  //   listProducts,
  //   listTransOut,
  //   loading: loading.effects['returnSales/queryTransferOut'],
  //   location,
  //   filter,
  //   sort,
  //   storeInfo,
  //   showPrintModal,
  //   user,
  //   updateFilter (filters, sorts) {
  //     dispatch({
  //       type: 'returnSales/updateState',
  //       payload: {
  //         filter: filters,
  //         sort: sorts
  //       }
  //     })
  //   },
  //   getProducts (transNo) {
  //     dispatch({
  //       type: 'returnSales/queryProducts',
  //       payload: {
  //         transNo,
  //         storeId: lstorage.getCurrentUserStore()
  //       }
  //     })
  //   },
  //   getTrans (transNo, storeId) {
  //     dispatch({
  //       type: 'returnSales/queryByTrans',
  //       payload: {
  //         transNo,
  //         storeId
  //       }
  //     })
  //   },
  //   onShowPrint () {
  //     dispatch({
  //       type: 'returnSales/updateState',
  //       payload: {
  //         showPrintModal: true
  //       }
  //     })
  //   },
  //   onClosePrint () {
  //     dispatch({
  //       type: 'returnSales/updateState',
  //       payload: {
  //         showPrintModal: false
  //       }
  //     })
  //   }
  // }

  // const filterTransferProps = {
  //   period,
  //   filter: {
  //     ...location.query
  //   },
  //   filterChange (date) {
  //     dispatch({
  //       type: 'returnSales/queryTransferOut',
  //       payload: {
  //         start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
  //         end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
  //       }
  //     })
  //     dispatch({
  //       type: 'returnSales/updateState',
  //       payload: {
  //         period: date
  //       }
  //     })
  //   },
  //   filterTransNo (date, no) {
  //     dispatch({
  //       type: 'returnSales/queryTransferOut',
  //       payload: {
  //         start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
  //         end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
  //         transNo: no
  //       }
  //     })
  //   }
  // }

  let activeTabKey = '0'
  const changeTab = (key) => {
    activeTabKey = key
    if (activeTabKey === '1') {
      dispatch({
        type: 'returnSales/queryTransferOut',
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
        {activeTabKey === '0' && (
          <TabPane tab="Add" key="0">
            <Form {...formProps} />
            {modalEditItemVisible && <ModalItem {...formEditProps} />}
            {modalProductVisible && <Browse {...modalProductProps} />}
            {modalInvoiceVisible && <Browse {...modalProductProps} />}
          </TabPane>
        )}
        <TabPane tab="Archieve" key="1">
          {/* <FilterTransfer {...filterTransferProps} />
          <ListTransfer {...listTransferProps} /> */}
        </TabPane>
      </Tabs>
    </div>
  )
}

ReturnSales.propTypes = {
  returnSales: PropTypes.object,
  pos: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ returnSales, pos, app, loading }) => ({ returnSales, pos, app, loading }))(ReturnSales)
