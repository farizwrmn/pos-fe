import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Specification = ({ specification, productcategory, loading, dispatch, location, app }) => {
  const { listSpecification, pagination, modalType, currentItem, activeKey } = specification
  const { listCategory } = productcategory
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'specification/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listSpecification,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['specification/query'],
    location,
    onChange (page, pageSize) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current || page,
          pageSize: page.pageSize || pageSize
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
        type: 'specification/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'specification/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'specification/changeTab',
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
    dispatch({ type: 'specification/updateState', payload: { listSpecification: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'specification/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    modalType,
    listCategory,
    listProps,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `specification/${modalType}`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'specification/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
    },
    getItemById (id) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'specification/queryById',
        payload: {
          id
        }
      })
    },
    showCategories () {
      dispatch({
        type: 'productcategory/query'
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
      </Tabs>
    </div>
  )
}

Specification.propTypes = {
  specification: PropTypes.object,
  productcategory: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ specification, productcategory, loading, app }) => ({ specification, productcategory, loading, app }))(Specification)
