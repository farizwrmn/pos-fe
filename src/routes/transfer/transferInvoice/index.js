import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, message, Modal, Tabs } from 'antd'
import { lstorage } from 'utils'
import Form from './Form'
import List from './List'
import PaymentList from './PaymentList'
import Filter from './Filter'
import PaymentModal from './PaymentModal'

const TabPane = Tabs.TabPane

const TransferInvoice = ({ transferInvoice, accountCode, transferOut, loading, dispatch, location, app }) => {
  const { list, listStore, listItem, listLovVisible, modalPaymentVisible, pagination, modalVisible, modalType, modalItemType, currentItem, currentItemList, activeKey } = transferInvoice
  const { listTrans: listTransfer } = transferOut
  const { listAccountCode } = accountCode
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value, forPayment) {
      dispatch({
        type: 'transferInvoice/query',
        payload: {
          forPayment,
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    pagination,
    storeInfo,
    loading: loading.effects['transferInvoice/query'],
    location,
    onPayment (currentItem) {
      console.log('currentItem', currentItem)
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          currentItem,
          modalPaymentVisible: true
        }
      })
    },
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
          activeKey: 0,
          edit: item.id
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'transferInvoice/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    if (key !== '0') {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          dispatch({
            type: 'transferInvoice/changeTab',
            payload: { key }
          })
          const { query, pathname } = location
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              edit: null,
              activeKey: key
            }
          }))
          dispatch({ type: 'transferInvoice/updateState', payload: { list: [], listItem: [] } })
        }
      })
    } else {
      dispatch({
        type: 'transferInvoice/changeTab',
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
      dispatch({ type: 'transferInvoice/updateState', payload: { list: [], listItem: [] } })
    }
  }
  const clickBrowse = () => {
    dispatch({
      type: 'transferInvoice/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalProps = {
    title: modalItemType === 'add' ? 'Add Detail' : 'Edit Detail',
    item: currentItemList,
    visible: modalVisible,
    listTransfer,
    modalItemType,
    modalType,
    onCancel () {
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    addModalItem (data) {
      const { listItem } = transferInvoice
      data.no = (listItem || []).length + 1
      listItem.push(data)
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success add item')
    },
    editModalItem (data) {
      const { listItem } = transferInvoice
      listItem[data.no - 1] = data
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success edit item')
    },
    deleteModalItem (no) {
      const { listItem } = transferInvoice
      const newItemList = listItem
        .filter(filtered => filtered.no !== no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }))
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem: newItemList,
          currentItemList: {}
        }
      })
      message.success('success delete item')
    }
  }
  const listDetailProps = {
    dataSource: listItem,
    modalType
  }

  const modalLovProps = {
    title: 'Add Detail',
    visible: listLovVisible,
    width: '85%',
    footer: null,
    onCancel () {
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          listLovVisible: false
        }
      })
    }
  }

  const listLovProps = {
    modalProps: modalLovProps,
    dataSource: listTransfer,
    visible: listLovVisible,
    user,
    storeInfo,
    pagination: false,
    loading: loading.effects['transferOut/queryLov'],
    location,
    // onChange (page) {
    //   dispatch({
    //     type: 'transferOut/query',
    //     payload: {
    //       page: page.current,
    //       pageSize: page.pageSize,
    //       listLovVisible: false,
    //       storeId: lstorage.getCurrentUserStore(),
    //       storeIdReceiver: currentItem.storeIdReceiver,
    //       status: 1
    //     }
    //   })
    // },
    changePeriod (storeIdReceiver) {
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          currentItem: {
            ...currentItem,
            storeIdReceiver
          },
          listLovVisible: true,
          modalItemType: 'add'
        }
      })
      dispatch({
        type: 'transferOut/queryLov',
        payload: {
          // start,
          // end,
          posting: 1,
          storeId: lstorage.getCurrentUserStore(),
          storeIdReceiver,
          status: 1
        }
      })
    },
    addModalItem (data) {
      const filtered = listItem.filter(filtered => filtered.id === data.id)
      if (filtered && filtered[0]) {
        message.warning('item already exists')
        return
      }
      dispatch({
        type: 'transferInvoice/addItem',
        payload: {
          data
        }
      })
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
        type: 'transferInvoice/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'transferInvoice/delete',
        payload: id
      })
    }
  }

  let timeout
  const formProps = {
    user,
    storeInfo,
    listStore,
    listLovProps,
    dispatch,
    modalType,
    modalItemType,
    modalVisible,
    modalProps,
    listDetailProps,
    listItem,
    item: currentItem,
    loading: loading.effects['transferInvoice/add'] || loading.effects['transferInvoice/edit'] || loading.effects['transferInvoice/setEdit'],
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, detail, oldValue, reset) {
      dispatch({
        type: `transferInvoice/${modalType}`,
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
        type: 'transferInvoice/updateState',
        payload: {
          modalType: 'add',
          currentItem: {},
          listItem: []
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
        type: 'transferInvoice/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow (storeIdReceiver) { // string
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          currentItem: {
            ...currentItem,
            storeIdReceiver
          },
          listLovVisible: true,
          modalItemType: 'add'
        }
      })
      dispatch({
        type: 'transferOut/queryLov',
        payload: {
          // start,
          // end,
          posting: 1,
          storeId: lstorage.getCurrentUserStore(),
          storeIdReceiver,
          status: 1
        }
      })
    },
    resetListItem () {
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          listItem: []
        }
      })
    },
    modalShowList (record) {
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          modalVisible: true,
          modalItemType: 'edit',
          currentItemList: record
        }
      })
    }
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  const modalPaymentOpts = {
    title: 'Add Payment',
    item: currentItem,
    listAccountCode,
    visible: modalPaymentVisible,
    onCancel () {
      dispatch({
        type: 'transferInvoice/updateState',
        payload: {
          modalPaymentVisible: false
        }
      })
    },
    onSubmit (data, detail, oldValue, reset) {
      dispatch({
        type: 'transferInvoice/edit',
        payload: {
          data,
          detail,
          oldValue,
          reset,
          forPayment: 1
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
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
        <TabPane tab="Payment" key="2" >
          {activeKey === '2' &&
            <div>
              <Filter forPayment={1} {...filterProps} />
              <PaymentList {...listProps} />
              {modalPaymentVisible && currentItem && currentItem.id && <PaymentModal {...modalPaymentOpts} />}
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

TransferInvoice.propTypes = {
  transferInvoice: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  transferInvoice,
  accountCode,
  transferOut,
  loading,
  app
}) => ({
  transferInvoice,
  accountCode,
  transferOut,
  loading,
  app
}))(TransferInvoice)
