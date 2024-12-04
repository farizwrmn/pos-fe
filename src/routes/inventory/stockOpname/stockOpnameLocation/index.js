import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'


const TabPane = Tabs.TabPane

const Counter = ({ stockOpnameLocation, loading, dispatch, location, app }) => {
  const { list, listActive, pagination, modalType, currentItem, activeKey } = stockOpnameLocation
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'stockOpnameLocation/query',
        payload: {
          ...value
        }
      })
    }
  }
  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['stockOpnameLocation/query'],
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
        type: 'stockOpnameLocation/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'stockOpnameLocation/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'stockOpnameLocation/changeTab',
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
    dispatch({ type: 'stockOpnameLocation/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'stockOpnameLocation/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }


  const handlePrintBarcode = () => {
    dispatch(
      routerRedux.push({
        pathname: 'print-barcode',
        query: {
          ...pagination
        }
      })
    )
  }

  const formProps = {
    modalType,
    storeInfo,
    listActive,
    dispatch,
    location,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `stockOpnameLocation/${modalType}`,
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
        type: 'stockOpnameLocation/updateState',
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
        {location.pathname === '/stock-opname-location' && (<TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>

              <Button onClick={handlePrintBarcode} type="primary">Print Barcode</Button>

              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>)}
      </Tabs>

    </div>
  )
}
Counter.propTypes = {
  stockOpnameLocation: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ stockOpnameLocation, loading, app }) => ({ stockOpnameLocation, loading, app }))(Counter)
