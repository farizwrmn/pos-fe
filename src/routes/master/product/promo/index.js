import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
// import { Link, routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import List from './List'
// import Filter from './Filter'
import AdvancedForm from './AdvancedForm'

const TabPane = Tabs.TabPane


const SubaPromo = ({ subaPromo, dispatch, productstock, app }) => {
  const { user, storeInfo } = app
  const {
    modalProductVisible,
    pagination: paginationProduct,
    listItem,
    searchText: searchTextProduct,
    tmpProductData,
    productInformation
  } = productstock
  const { list, pagination, modalType, currentItem, activeKey, advancedForm } = subaPromo

  const listProps = {
    user,
    storeInfo,
    dataSource: list,
    pagination
  }

  const formProps = {
    modalType,
    modalProductVisible,
    paginationProduct,
    searchTextProduct,
    listItem,
    tmpProductData,
    productInformation,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `subaPromo/${modalType}`,
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
        type: 'subaPromo/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    onSearchProductData (data) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          searchText: data.q
        }
      })
      dispatch({
        type: 'productstock/queryItem',
        payload: {
          ...data
        }
      })
    },
    onSearchProduct (data) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          searchText: data
        }
      })
      dispatch({
        type: 'productstock/queryItem',
        payload: {
          q: data
        }
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'subaPromo/updateState',
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
      type: 'subaPromo/updateState',
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
          Browse
          {/* <Filter {...filterProps} /> */}
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

SubaPromo.propTypes = {
  // form: PropTypes.object.isRequired,
}

SubaPromo.defaultProps = {
  subaPromo: {}
  // addNew: true
}

export default connect(({ productstock, subaPromo, app }) => ({ productstock, subaPromo, app }))(SubaPromo)
