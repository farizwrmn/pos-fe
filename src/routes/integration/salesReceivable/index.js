import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import List from './List'
// import Filter from './Filter'
import AdvancedForm from './AdvancedForm'

const TabPane = Tabs.TabPane

const PiutangMarketing = ({ dispatch, salesReceivable, app, loading }) => {
  const { user } = app
  const { list, pagination, modalType, currentItem, activeKey, advancedForm } = salesReceivable

  const listProps = {
    loading: loading.effects['salesReceivable/query'],
    user,
    dataSource: list,
    pagination,
    editItem (item) {
      dispatch({
        type: 'salesReceivable/updateState',
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
        type: 'salesReceivable/delete',
        payload: id
      })
    }
  }

  const formProps = {
    modalType,
    loadingButton: loading,
    dispatch,
    item: {
      ...currentItem
    },
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data, reset) {
      dispatch({
        type: `salesReceivable/${modalType}`,
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
        type: 'salesReceivable/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    onGetProduct () {
      dispatch({ type: 'salesReceivable/query' })
    },
    onSearchProductData (data) {
      dispatch({
        type: 'salesReceivable/updateState',
        payload: {
          searchText: data.q
        }
      })
      dispatch({
        type: 'salesReceivable/query',
        payload: {
          ...data
        }
      })
    },
    onSearchProduct (data) {
      dispatch({
        type: 'salesReceivable/updateState',
        payload: {
          searchText: data
        }
      })
      dispatch({
        type: 'salesReceivable/query',
        payload: {
          q: data
        }
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'salesReceivable/updateState',
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
      type: 'salesReceivable/updateState',
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


PiutangMarketing.defaultProps = {
  salesReceivable: {}
}

export default connect(({ salesReceivable, loading, app }) => ({ salesReceivable, loading, app }))(PiutangMarketing)
