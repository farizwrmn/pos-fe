import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const ProductBookmard = ({ productBookmarkGroup, userStore, loading, dispatch, location }) => {
  const { list, display, isChecked, modalType, currentItem, activeKey, show } = productBookmarkGroup
  const { listAllStores } = userStore
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'productBookmarkGroup/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productBookmarkGroup/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({ type: 'productBookmarkGroup/resetProductBrandList' })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['productBookmarkGroup/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'productBookmarkGroup/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'productBookmarkGroup/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'productBookmarkGroup/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'productBookmarkGroup/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: ''
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({ type: 'productBookmarkGroup/resetProductBrandList' })
  }

  const formProps = {
    listAllStores,
    modalType,
    item: currentItem,
    disabled: loading.effects[`productBookmarkGroup/${modalType}`],
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data, reset) {
      dispatch({
        type: `productBookmarkGroup/${modalType}`,
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
        type: 'productBookmarkGroup/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
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

ProductBookmard.propTypes = {
  productBookmarkGroup: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productBookmarkGroup, userStore, loading }) => ({ productBookmarkGroup, userStore, loading }))(ProductBookmard)
