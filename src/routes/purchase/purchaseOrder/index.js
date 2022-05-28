import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Tabs } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import Form from './Form'
import Browse from './Browse'
import ModalItem from './Modal'
import List from './List'
import Filter from './Filter'

// const { getCashierTrans } = lstorage
const { TabPane } = Tabs

const ReturnSales = ({ location, purchaseOrder, purchase, app, dispatch, loading }) => {
  const {
    list: listReturnPurchase,
    pagination,
    // listInvoice,
    // tmpInvoiceList,
    // isChecked,
    // listProducts,
    // listTransOut,
    activeKey,
    modalInvoiceVisible,
    modalProductVisible,
    listItem,
    currentItem,
    // currentItemList,
    modalEditItemVisible,
    modalConfirmVisible,
    reference,
    referenceNo,
    // formType,
    // display,
    // activeKey,
    currentItemList
    // filter,
    // sort,
    // showPrintModal
  } = purchaseOrder
  const {
    listPurchaseLatestDetail,
    listSupplier
  } = purchase
  const { user, storeInfo } = app
  // const filterProps = {
  //   display,
  //   filter: {
  //     ...location.query
  //   },
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'purchaseOrder/query',
  //       payload: {
  //         userName: value.cityName,
  //         ...value
  //       }
  //     })
  //   },
  //   switchIsChecked () {
  //     dispatch({
  //       type: 'purchaseOrder/switchIsChecked',
  //       payload: `${isChecked ? 'none' : 'block'}`
  //     })
  //   }
  // }

  const listProps = {
    dataSource: listItem,
    listItem,
    loading: loading.effects['purchaseOrder/query'],
    pagination: false,
    location,
    onChange (page) {
      dispatch({
        type: 'purchaseOrder/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          currentItemList: record,
          modalEditItemVisible: true
        }
      })
      dispatch({
        type: 'purchase/getPurchaseLatestDetail',
        payload: {
          productId: record.id
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'purchaseOrder/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'purchaseOrder/query'
      })
    }
  }

  console.log('listItem', listItem)

  const modalProductProps = {
    location,
    dispatch,
    loading,
    purchase,
    purchaseOrder,
    modalProductVisible,
    modalInvoiceVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (/* event */) { },
    showProductQty (data) {
      dispatch({
        type: 'purchase/showProductQty',
        payload: {
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchase/hideProductModal'
      })
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalInvoiceVisible: false,
          modalProductVisible: false
        }
      })
    },
    onChooseItem (item) {
      if (!item.productId) {
        item.productId = item.id
      }
      dispatch({
        type: 'purchaseOrder/addItem',
        payload: {
          item
        }
      })
    },
    onInvoiceHeader () {
      dispatch({
        type: 'purchase/getInvoicePayable',
        payload: {
          order: 'transDate'
        }
      })
    },
    onChooseInvoice (item) {
      dispatch({
        type: 'purchaseOrder/getInvoiceDetailPurchase',
        payload: item
      })
    }
  }

  const handleProductBrowse = (reset, query, checked) => {
    if (reset) {
      if (query) {
        dispatch({
          type: 'purchaseOrder/updateState',
          payload: {
            modalProductVisible: true
          }
        })
        dispatch({
          type: 'purchaseOrder/queryProduct'
        })
      } else if (!checked || checked === undefined) {
        dispatch({
          type: 'purchaseOrder/updateState',
          payload: {
            listProduct: [],
            listItem: [],
            pagination: {
              total: 0,
              current: 0,
              pageSize: 0
            }
          }
        })
        dispatch({
          type: 'purchaseOrder/queryProduct'
        })
      }
    } else {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalProductVisible: true,
          pagination: {
            total: 0,
            current: 0,
            pageSize: 0
          }
        }
      })
    }
  }

  const formEditProps = {
    visible: modalEditItemVisible,
    reference,
    listPurchaseLatestDetail,
    loadingPurchaseLatest: loading.effects['purchase/getPurchaseLatestDetail'],
    referenceNo,
    item: currentItem,
    listStore: lstorage.getListUserStores(),
    currentItemList,
    modalProductProps,
    handleProductBrowse,
    onOkList (item) {
      dispatch({
        type: 'purchaseOrder/editItem',
        payload: {
          item
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          currentItemList: {},
          modalEditItemVisible: false
        }
      })
    },
    onDeleteItem (item) {
      dispatch({
        type: 'purchaseOrder/deleteItem',
        payload: {
          item
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseOrder/updateState',
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
        type: 'purchaseOrder/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
    reference,
    referenceNo,
    listProps,
    listSupplier,
    formConfirmProps,
    modalConfirmVisible,
    listTrans: listReturnPurchase,
    listItem,
    listStore: lstorage.getListUserStores(),
    item: currentItem,
    modalProductVisible,
    modalInvoiceVisible,
    loadingButton: loading,
    purchase,
    loading: loading.effects['purchaseOrder/querySequence'],
    disabled: false,
    button: 'Add',
    onSubmit (data, listItem, resetFields) {
      dispatch({
        type: 'purchaseOrder/add',
        payload: {
          data,
          detail: listItem,
          resetFields
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          reference: null,
          referenceNo: null,
          formType: 'add',
          currentItem: {},
          currentItemList: {}
        }
      })
    },
    resetListItem () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          reference: null,
          referenceNo: null,
          formType: 'add',
          listItem: [],
          currentItemList: {}
        }
      })
    },
    handleProductBrowse
  }

  const browseProps = {
    dataSource: listReturnPurchase,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['purchaseOrder/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'purchaseOrder/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'purchaseOrder/delete',
        payload: id
      })
    },
    approveItem (id) {
      dispatch({
        type: 'purchaseOrder/approve',
        payload: {
          id
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'purchaseOrder/query',
        payload: {
          ...value
        }
      })
    }
  }


  const clickBrowse = () => {
    dispatch({
      type: 'purchaseOrder/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  const changeTab = (key) => {
    dispatch({
      type: 'purchaseOrder/changeTab',
      payload: { key }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({ type: 'purchaseOrder/updateState', payload: { listAccountCode: [] } })
  }

  return (
    <div className="content-inner">
      <Tabs type="card" activeKey={activeKey} tabBarExtraContent={moreButtonTab} onChange={key => changeTab(key)}>
        <TabPane tab="Form" key="0">
          <Form {...formProps} />
        </TabPane>
        <TabPane tab="Browse" key="1">
          <Filter {...filterProps} />
          <List {...browseProps} />
        </TabPane>
      </Tabs>
      {modalEditItemVisible && <ModalItem {...formEditProps} />}
      {modalProductVisible && <Browse {...modalProductProps} />}
      {modalInvoiceVisible && <Browse {...modalProductProps} />}
    </div>
  )
}

ReturnSales.propTypes = {
  purchaseOrder: PropTypes.object,
  purchase: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ purchaseOrder, purchase, app, loading }) => ({ purchaseOrder, purchase, app, loading }))(ReturnSales)
