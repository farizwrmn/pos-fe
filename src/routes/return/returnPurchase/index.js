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

const ReturnSales = ({ location, returnPurchase, purchase, app, dispatch, loading }) => {
  const {
    list: listReturnPurchase,
    pagination,
    activeKey,
    modalInvoiceVisible,
    modalProductVisible,
    listItem,
    currentItem,
    modalEditItemVisible,
    modalConfirmVisible,
    currentItemList
  } = returnPurchase
  const {
    listPurchaseLatestDetail,
    listSupplier
  } = purchase
  const { user, storeInfo } = app

  const listProps = {
    dataSource: listItem,
    listItem,
    loading: loading.effects['returnPurchase/query'],
    pagination: false,
    location,
    onChange (page) {
      dispatch({
        type: 'returnPurchase/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'returnPurchase/updateState',
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
        type: 'returnPurchase/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'returnPurchase/query'
      })
    }
  }

  const modalProductProps = {
    location,
    dispatch,
    loading,
    purchase,
    returnPurchase,
    modalProductVisible,
    modalInvoiceVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
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
        type: 'returnPurchase/updateState',
        payload: {
          modalInvoiceVisible: false,
          modalProductVisible: false
        }
      })
    },
    onChooseItem (item) {
      if (!item.productId) {
        item.productId = item.id
        item.id = undefined
      }
      dispatch({
        type: 'returnPurchase/addItem',
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
        type: 'returnPurchase/getInvoiceDetailPurchase',
        payload: item
      })
    }
  }

  const handleProductBrowse = (reset, query, checked) => {
    if (reset) {
      if (query) {
        dispatch({
          type: 'returnPurchase/updateState',
          payload: {
            modalProductVisible: true
          }
        })
        dispatch({
          type: 'returnPurchase/queryProduct'
        })
      } else if (!checked || checked === undefined) {
        dispatch({
          type: 'returnPurchase/updateState',
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
          type: 'returnPurchase/queryProduct'
        })
      }
    } else {
      dispatch({
        type: 'returnPurchase/updateState',
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
    listPurchaseLatestDetail,
    loadingPurchaseLatest: loading.effects['purchase/getPurchaseLatestDetail'],
    item: currentItem,
    listStore: lstorage.getListUserStores(),
    currentItemList,
    modalProductProps,
    handleProductBrowse,
    onOkList (item) {
      dispatch({
        type: 'returnPurchase/editItem',
        payload: {
          item
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          currentItemList: {},
          modalEditItemVisible: false
        }
      })
    },
    onDeleteItem (item) {
      dispatch({
        type: 'returnPurchase/deleteItem',
        payload: {
          item
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnPurchase/updateState',
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
        type: 'returnPurchase/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
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
    loading: loading.effects['returnPurchase/querySequence'],
    disabled: false,
    button: 'Add',
    onSubmit (data, listItem, resetFields) {
      dispatch({
        type: 'returnPurchase/add',
        payload: {
          data,
          detail: listItem,
          resetFields
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'returnPurchase/updateState',
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
        type: 'returnPurchase/updateState',
        payload: {
          reference: null,
          referenceNo: null,
          formType: 'add',
          listItem: [],
          currentItemList: {}
        }
      })
    },
    handleProductBrowse,
    handleInvoiceBrowse (data) {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          modalType: 'modalInvoice'
        }
      })
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalInvoiceVisible: true
        }
      })
      dispatch({
        type: 'purchase/getInvoicePayable',
        payload: data
      })
    }
  }

  const browseProps = {
    dataSource: listReturnPurchase,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['returnPurchase/query'],
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
        type: 'returnPurchase/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'returnPurchase/delete',
        payload: id
      })
    },
    approveItem (id) {
      dispatch({
        type: 'returnPurchase/approve',
        payload: {
          id
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'returnPurchase/query',
        payload: {
          ...value
        }
      })
    }
  }


  const clickBrowse = () => {
    dispatch({
      type: 'returnPurchase/updateState',
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
      type: 'returnPurchase/changeTab',
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
    dispatch({ type: 'returnPurchase/updateState', payload: { listAccountCode: [] } })
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
  returnPurchase: PropTypes.object,
  purchase: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ returnPurchase, purchase, app, loading }) => ({ returnPurchase, purchase, app, loading }))(ReturnSales)
