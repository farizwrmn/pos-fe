import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
// import List from './List'
// import Filter from './Filter'

const TabPane = Tabs.TabPane

const Counter = ({
  purchaseSafetyStock,
  // loading,
  dispatch,
  location
  // app
}) => {
  const {
    // list,
    listDistributionCenter,
    listStore,
    // pagination,
    modalType,
    currentItem,
    activeKey
  } = purchaseSafetyStock
  // const { user, storeInfo } = app
  // const filterProps = {
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'purchaseSafetyStock/query',
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
  //   pagination,
  //   loading: loading.effects['purchaseSafetyStock/query'],
  //   location,
  //   onChange (page) {
  //     const { query, pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         ...query,
  //         page: page.current,
  //         pageSize: page.pageSize
  //       }
  //     }))
  //   },
  //   editItem (item) {
  //     const { pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         activeKey: 0
  //       }
  //     }))
  //     dispatch({
  //       type: 'purchaseSafetyStock/editItem',
  //       payload: { item }
  //     })
  //   },
  //   deleteItem (id) {
  //     dispatch({
  //       type: 'purchaseSafetyStock/delete',
  //       payload: id
  //     })
  //   }
  // }

  const changeTab = (key) => {
    dispatch({
      type: 'purchaseSafetyStock/changeTab',
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
    dispatch({ type: 'purchaseSafetyStock/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'purchaseSafetyStock/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    modalType,
    item: currentItem,
    listDistributionCenter,
    listStore,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseSafetyStock/add',
        payload: {
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
        type: 'purchaseSafetyStock/updateState',
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

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        {/* <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane> */}
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  purchaseSafetyStock: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseSafetyStock, loading, app }) => ({ purchaseSafetyStock, loading, app }))(Counter)
