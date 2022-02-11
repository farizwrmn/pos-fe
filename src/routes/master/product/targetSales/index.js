import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import List from './List'
// import Filter from './Filter'
import AdvancedForm from './AdvancedForm'

const TabPane = Tabs.TabPane

const TargetSales = ({ dispatch, targetSales, app, loading }) => {
  const { user } = app
  const { list, pagination, modalType, currentItem, activeKey, advancedForm } = targetSales

  const listProps = {
    dataSource: list,
    pagination,
    editItem (item) {
      dispatch({
        type: 'targetSales/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'targetSales/delete',
        payload: id
      })
    }
  }

  const formProps = {
    user,
    modalType,
    loadingButton: loading,
    dispatch,
    item: {
      ...currentItem
    },
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data, reset) {
      dispatch({
        type: `targetSales/${modalType}`,
        payload: {
          id,
          data,
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
        type: 'targetSales/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    onGetProduct () {
      dispatch({ type: 'targetSales/query' })
    },
    onSearchProductData (data) {
      dispatch({
        type: 'targetSales/updateState',
        payload: {
          searchText: data.q
        }
      })
      dispatch({
        type: 'targetSales/query',
        payload: {
          ...data
        }
      })
    },
    onSearchProduct (data) {
      dispatch({
        type: 'targetSales/updateState',
        payload: {
          searchText: data
        }
      })
      dispatch({
        type: 'targetSales/query',
        payload: {
          q: data
        }
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'targetSales/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: '',
        list: []
      }
    })
    const { query, pathname } = location
    switch (key) {
      case 1:
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            activeKey: key
          }
        }))
        break
      default:
        dispatch(routerRedux.push({
          pathname,
          query: {
            activeKey: key
          }
        }))
    }
  }

  const clickBrowse = () => {
    dispatch({
      type: 'targetSales/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  return (
    <div className={(activeKey === '0' && !advancedForm) || activeKey === '1' ? 'content-inner' : 'content-inner-no-color'}>
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <AdvancedForm {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {/* <Filter {...filterProps} /> */}
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}


TargetSales.defaultProps = {
  targetSales: {}
}

export default connect(({ targetSales, loading, app }) => ({ targetSales, loading, app }))(TargetSales)
