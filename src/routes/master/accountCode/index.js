import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import ModalAccountRule from './ModalAccountRule'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import Setting from './Setting'

const TabPane = Tabs.TabPane

const Counter = ({ accountCode, accountRule, accountCodeDefault, loading, dispatch, location, app }) => {
  const { listAccountCode, listAccountCodeLov, pagination, modalType, currentItem, activeKey } = accountCode
  const { modalAccountRuleVisible, modalAccountRuleItem } = accountRule
  const { listAccountCodeDefaultLov } = accountCodeDefault
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'accountCode/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listAccountCode,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['accountCode/query'],
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
        type: 'accountCode/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'accountCode/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'accountCode/changeTab',
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
    dispatch({ type: 'accountCode/updateState', payload: { listAccountCode: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'accountCode/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const settingProps = {
    listAccountCodeLov,
    listAccountCodeDefaultLov,
    onSubmit (data) {
      dispatch({
        type: 'accountCodeDefault/edit',
        payload: data
      })
    }
  }

  const formProps = {
    modalType,
    item: currentItem,
    listAccountCodeLov,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `accountCode/${modalType}`,
        payload: data
      })
    },
    queryEditItem (item) {
      dispatch({
        type: 'accountRule/updateState',
        payload: {
          modalAccountRuleItem: item,
          modalAccountRuleVisible: true
        }
      })
    },
    showParent () {
      dispatch({
        type: 'accountCode/query',
        payload: {
          type: 'all',
          field: 'id,accountCode,accountName'
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
        type: 'accountCode/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  const modalAccountRuleProps = {
    title: `Edit ${modalAccountRuleItem ? modalAccountRuleItem.accountCode : ''} - ${modalAccountRuleItem ? modalAccountRuleItem.accountName : ''}`,
    visible: modalAccountRuleVisible,
    item: modalAccountRuleItem,
    loading,
    onEdit () {
      dispatch({
        type: 'accountCode/updateState',
        payload: {
          currentItem: {}
        }
      })
      dispatch({
        type: 'accountCode/queryEditItem',
        payload: {
          id: modalAccountRuleItem.id
        }
      })
      dispatch({
        type: 'accountRule/updateState',
        payload: {
          modalAccountRuleVisible: false,
          modalAccountRuleItem: {}
        }
      })
    },
    onEditRole (data) {
      dispatch({
        type: 'accountRule/edit',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'accountRule/updateState',
        payload: {
          modalAccountRuleVisible: false,
          modalAccountRuleItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {modalAccountRuleVisible && <ModalAccountRule {...modalAccountRuleProps} />}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
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
        <TabPane tab="Setting" key="2" >
          {activeKey === '2' &&
            <div>
              <Setting {...settingProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  accountCode: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ accountCode, accountRule, accountCodeDefault, loading, app }) => ({ accountCode, accountRule, accountCodeDefault, loading, app }))(Counter)
