import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Shift = ({ shift, loading, dispatch, location, app }) => {
  const { listShift, modalType, currentItem, activeKey } = shift
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'shift/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listShift,
    user,
    storeInfo,
    loading: loading.effects['shift/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'shift/editItem',
        payload: { item }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'shift/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'shift/changeTab',
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
    dispatch({ type: 'shift/updateState', payload: { listShift: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'shift/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    listShift,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `shift/${modalType}`,
        payload: data
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
        type: 'shift/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    searchSequence () {
      dispatch({ type: 'shift/query' })
    }
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Shift.propTypes = {
  shift: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ shift, loading, app }) => ({ shift, loading, app }))(Shift)
