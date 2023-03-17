import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, message, Modal, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Cash = ({ bankentry, accountRule, customer, supplier, loading, dispatch, location, app }) => {
  const { listCash, listItem, pagination, modalVisible, modalType, modalItemType, currentItem, currentItemList, activeKey } = bankentry

  const { listCustomer } = customer
  const { listSupplier } = supplier
  const { listAccountCode, listAccountCodeExpense } = accountRule
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value,
          page: pagination.current,
          pageSize: pagination.pageSize
        }
      }))
    }
  }

  const listProps = {
    dataSource: listCash,
    user,
    pagination,
    storeInfo,
    loading: loading.effects['bankentry/query'],
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
          activeKey: 0,
          edit: item.id
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'bankentry/delete',
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
            type: 'bankentry/changeTab',
            payload: { key }
          })
          const { pathname } = location
          dispatch(routerRedux.push({
            pathname,
            query: {
              edit: null,
              activeKey: key
            }
          }))
          dispatch({ type: 'bankentry/updateState', payload: { listCash: [], listItem: [] } })
        }
      })
    } else {
      dispatch({
        type: 'bankentry/changeTab',
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
      dispatch({ type: 'bankentry/updateState', payload: { listCash: [], listItem: [] } })
    }
  }
  const clickBrowse = () => {
    dispatch({
      type: 'bankentry/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalProps = {
    title: modalItemType === 'add' ? 'Add Detail' : 'Edit Detail',
    item: currentItemList,
    visible: modalVisible,
    modalItemType,
    modalType,
    listAccountCode: listAccountCodeExpense,
    onCancel () {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    addModalItem (data) {
      const { listItem } = bankentry
      data.no = (listItem || []).length + 1
      listItem.push(data)
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success add item')
    },
    onDelete (no) {
      let { listItem } = bankentry
      Modal.confirm({
        title: 'Delete This Item',
        content: 'Are your sure to delete this item ?',
        onOk () {
          listItem = listItem
            .filter(filtered => filtered.no !== no)
            .map((item, index) => ({ ...item, no: index + 1 }))
          dispatch({
            type: 'bankentry/updateState',
            payload: {
              modalVisible: false,
              modalItemType: 'add',
              listItem,
              currentItemList: {}
            }
          })
          message.success('success delete item')
        }
      })
    },
    editModalItem (data) {
      const { listItem } = bankentry
      listItem[data.no - 1] = data
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success edit item')
    }
  }
  const listDetailProps = {
    dataSource: listItem
  }
  let timeout
  const formProps = {
    dispatch,
    listAccountCode,
    listAccountCodeExpense,
    modalType,
    modalItemType,
    modalVisible,
    modalProps,
    listDetailProps,
    listItem,
    listCustomer,
    listSupplier,
    storeInfo,
    item: currentItem,
    loading: loading.effects['bankentry/add'] || loading.effects['bankentry/edit'] || loading.effects['bankentry/setEdit'],
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, detail, oldValue, reset) {
      dispatch({
        type: `bankentry/${modalType}`,
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
        type: 'bankentry/updateState',
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
        type: 'bankentry/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow () { // string
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: true,
          modalItemType: 'add'
        }
      })
    },
    resetListItem () {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          listItem: []
        }
      })
    },
    modalShowList (record) {
      dispatch({
        type: 'bankentry/updateState',
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
      </Tabs>
    </div>
  )
}

Cash.propTypes = {
  bankentry: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  pos: PropTypes.object.isRequired,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  bankentry,
  accountRule,
  customer,
  supplier,
  loading,
  pos,
  app }) => ({ bankentry, accountRule, customer, supplier, loading, pos, app }))(Cash)
