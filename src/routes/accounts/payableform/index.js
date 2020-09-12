import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
// import { Button, Modal, Tabs } from 'antd'
import Form from './Form'
// import List from './List'
// import Filter from './Filter'

// const TabPane = Tabs.TabPane

const Cash = ({ payableForm, bank, paymentOpts, supplier, loading, dispatch, location, purchase /* , app */ }) => {
  const {
    modalVisible,
    currentItem,
    listItem,
    currentItemList,
    modalType
    // activeKey,
    // list
  } = payableForm
  const { listOpts } = paymentOpts
  const { listBank } = bank
  const { listSupplier } = supplier
  // const { user, storeInfo } = app
  // const filterProps = {
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'payableForm/query',
  //       payload: {
  //         ...value
  //       }
  //     })
  //   }
  // }

  // const listProps = {
  //   dataSource: list,
  //   user,
  //   storeInfo,
  //   loading: loading.effects['payableForm/query'],
  //   location,
  //   editItem (item) {
  //     const { pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         activeKey: 0
  //       }
  //     }))
  //     dispatch({
  //       type: 'payableForm/setEdit',
  //       payload: { item }
  //     })
  //   },
  //   deleteItem (id) {
  //     dispatch({
  //       type: 'payableForm/delete',
  //       payload: id
  //     })
  //   }
  // }

  // const changeTab = (key) => {
  //   if (key !== '0') {
  //     Modal.confirm({
  //       title: 'Reset unsaved process',
  //       content: 'this action will reset your current process',
  //       onOk () {
  //         dispatch({
  //           type: 'payableForm/changeTab',
  //           payload: { key }
  //         })
  //         const { query, pathname } = location
  //         dispatch(routerRedux.push({
  //           pathname,
  //           query: {
  //             ...query,
  //             activeKey: key
  //           }
  //         }))
  //         dispatch({ type: 'payableForm/updateState', payload: { listItem: [] } })
  //       }
  //     })
  //   } else {
  //     dispatch({
  //       type: 'payableForm/changeTab',
  //       payload: { key }
  //     })
  //     const { query, pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         ...query,
  //         activeKey: key
  //       }
  //     }))
  //     dispatch({ type: 'payableForm/updateState', payload: { listItem: [] } })
  //   }
  // }

  // const clickBrowse = () => {
  //   dispatch({
  //     type: 'payableForm/updateState',
  //     payload: {
  //       activeKey: '1'
  //     }
  //   })
  // }

  const modalProps = {
    title: 'Add Detail',
    item: currentItemList,
    visible: modalVisible,
    onCancel () {
      dispatch({
        type: 'payableForm/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    editModalItem (item) {
      dispatch({
        type: 'payableForm/editItem',
        payload: {
          item
        }
      })
    }
  }
  const listDetailProps = {
    dataSource: listItem
  }
  let timeout

  const purchaseProps = {
    purchase,
    loading,
    handleBrowseInvoice () {
      dispatch({
        type: 'purchase/showProductModal',
        payload: {
          modalType: 'browseInvoice'
        }
      })
    },
    onInvoiceHeader (period, supplierId) {
      dispatch({
        type: 'purchase/getInvoiceHeader',
        payload: {
          ...period,
          supplierId
        }
      })
    },
    onChooseInvoice (item) {
      dispatch({
        type: 'payableForm/addItem',
        payload: {
          item
        }
      })
    }
  }
  const formProps = {
    purchaseProps,
    dispatch,
    loading,
    modalType,
    modalVisible,
    modalProps,
    listDetailProps,
    listItem,
    listOpts,
    listBank,
    listSupplier,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, detail, oldValue, reset) {
      dispatch({
        type: `payableForm/${modalType}`,
        payload: {
          data,
          detail,
          oldValue,
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
        type: 'payableForm/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    showLov (models, data) {
      if (!data) {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5
          }
        })
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      timeout = setTimeout(() => {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5,
            ...data
          }
        })
      }, 400)
    },
    updateCurrentItem (data) {
      dispatch({
        type: 'payableForm/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow () { // string
      dispatch({
        type: 'payableForm/updateState',
        payload: {
          modalVisible: true
        }
      })
    },
    modalShowList (record) {
      dispatch({
        type: 'payableForm/updateState',
        payload: {
          modalVisible: true,
          currentItemList: record
        }
      })
    },
    resetListItem () {
      dispatch({
        type: 'payableForm/updateState',
        payload: {
          currentItemList: {},
          listItem: []
        }
      })
    }
  }

  // let moreButtonTab
  // if (activeKey === '0') {
  //   moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  // }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {/* <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab={`Form ${modalType === 'add' ? 'Add' : 'Update'}`} key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs> */}
    </div>
  )
}

Cash.propTypes = {
  payableForm: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  payableForm,
  paymentOpts,
  bank,
  supplier,
  loading,
  purchase,
  app }) =>
  ({
    payableForm,
    paymentOpts,
    bank,
    supplier,
    loading,
    purchase,
    app
  }))(Cash)
