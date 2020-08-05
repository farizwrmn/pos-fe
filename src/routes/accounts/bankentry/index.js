import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Modal, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Cash = ({ bankentry, accountCode, bank, paymentOpts, customer, supplier, loading, dispatch, location, app }) => {
  const { listCash, listItem, modalVisible, inputType, modalType, currentItem, currentItemList, activeKey } = bankentry
  const { listOpts } = paymentOpts
  const { listBank } = bank
  const { listCustomer } = customer
  const { listSupplier } = supplier
  const { listAccountCode } = accountCode
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'bankentry/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listCash,
    user,
    storeInfo,
    loading: loading.effects['bankentry/query'],
    location,
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'bankentry/editItem',
        payload: { item }
      })
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
    title: 'Add Detail',
    item: currentItemList,
    visible: modalVisible,
    listAccountCode,
    onCancel () {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    addModalItem (data) {
      data.no = (listItem || []).length + 1
      listItem.push(data)
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false,
          listItem
        }
      })
    }
  }
  const listDetailProps = {
    dataSource: listItem
  }
  let timeout
  const formProps = {
    modalType,
    modalVisible,
    modalProps,
    inputType,
    listDetailProps,
    listItem,
    listOpts,
    listBank,
    listCustomer,
    listSupplier,
    storeInfo,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, detail, oldValue) {
      dispatch({
        type: `bankentry/${modalType}`,
        payload: {
          data,
          detail,
          oldValue
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
        type: 'bankentry/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow (value) { // string
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: true,
          inputType: value
        }
      })
    },
    resetListItem (value) {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          listItem: [],
          inputType: value
        }
      })
    },
    modalShowList (record) {
      dispatch({
        type: 'accountCode/query',
        payload: {
          pageSize: 5,
          id: record.accountId.key
        }
      })
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: true,
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
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  bankentry,
  accountCode,
  paymentOpts,
  bank,
  customer,
  supplier,
  loading,
  app }) => ({ bankentry, accountCode, paymentOpts, bank, customer, supplier, loading, app }))(Cash)
