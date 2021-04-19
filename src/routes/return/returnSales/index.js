import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
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

const ReturnSales = ({ location, returnSales, pos, app, dispatch, loading }) => {
  const {
    list: listReturnSales,
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
    // formType,
    // display,
    // activeKey,
    currentItemList
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
    pagination: false,
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
    onModalVisible (record) {
      dispatch({
        type: 'returnSales/updateState',
        payload: {
          currentItemList: record,
          modalEditItemVisible: true
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
    }
  }

  const modalProductProps = {
    location,
    loading,
    pos,
    returnSales,
    modalProductVisible,
    modalInvoiceVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (/* event */) { },
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
    onChooseItem (item) {
      dispatch({
        type: 'returnSales/addItem',
        payload: {
          item
        }
      })
    },
    onInvoiceHeader (period) {
      dispatch({
        type: 'pos/queryHistory',
        payload: {
          ...period,
          type: 'return'
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
      type: 'returnSales/updateState',
      payload: {
        modalProductVisible: true
      }
    })
  }

  const formEditProps = {
    visible: modalEditItemVisible,
    item: currentItem,
    listStore: lstorage.getListUserStores(),
    currentItemList,
    modalProductProps,
    handleProductBrowse,
    onOkList (item) {
      dispatch({
        type: 'returnSales/editItem',
        payload: {
          item
        }
      })
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
    onDeleteItem (item) {
      dispatch({
        type: 'returnSales/deleteItem',
        payload: {
          item
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
    listStore: lstorage.getListUserStores(),
    item: currentItem,
    modalProductVisible,
    modalInvoiceVisible,
    loadingButton: loading,
    pos,
    loading: loading.effects['returnSales/querySequence'],
    disabled: false,
    button: 'Add',
    onSubmit (data, listItem, resetFields) {
      dispatch({
        type: 'returnSales/add',
        payload: {
          data,
          detail: listItem,
          resetFields
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
          endPeriod: moment().endOf('month').format('YYYY-MM-DD'),
          type: 'return'
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

  const browseProps = {
    dataSource: listReturnSales,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['returnSales/query'],
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
        type: 'returnSales/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'returnSales/delete',
        payload: id
      })
    },
    approveItem (id) {
      dispatch({
        type: 'returnSales/approve',
        payload: {
          id
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'returnSales/query',
        payload: {
          ...value
        }
      })
    }
  }


  const clickBrowse = () => {
    dispatch({
      type: 'returnSales/updateState',
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
      type: 'returnSales/changeTab',
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
    dispatch({ type: 'returnSales/updateState', payload: { listAccountCode: [] } })
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
  returnSales: PropTypes.object,
  pos: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ returnSales, pos, app, loading }) => ({ returnSales, pos, app, loading }))(ReturnSales)
