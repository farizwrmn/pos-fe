import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import List from './List'
// import Filter from './Filter'
import AdvancedForm from './AdvancedForm'

const TabPane = Tabs.TabPane


const SubaPromo = ({ subaPromo, dispatch, productstock, loading, app }) => {
  const { user, storeInfo } = app
  const {
    modalProductVisible,
    pagination: paginationProduct,
    listItem,
    searchText,
    tmpProductData,
    productInformation
  } = productstock
  const { list, pagination, modalType, currentItem, activeKey, advancedForm } = subaPromo

  const listProps = {
    user,
    storeInfo,
    dataSource: list,
    pagination,
    editItem (item) {
      dispatch({
        type: 'subaPromo/updateState',
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
        type: 'subaPromo/delete',
        payload: id
      })
    }
  }
  console.log('currentItem', currentItem)

  const formProps = {
    modalType,
    modalProductVisible,
    paginationProduct,
    searchText,
    listItem,
    tmpProductData,
    loadingButton: loading,
    dispatch,
    item: {
      ...currentItem,
      productId: productInformation && productInformation.id ? productInformation.id : currentItem.product && currentItem.product.id ? currentItem.product.id : currentItem.id,
      productCode: productInformation && productInformation.productCode ? productInformation.productCode : currentItem.product && currentItem.product.productCode ? currentItem.product.productCode : currentItem.productCode,
      productName: productInformation && productInformation.productName ? productInformation.productName : currentItem.product && currentItem.product.productName ? currentItem.product.productName : currentItem.productName
    },
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data, reset) {
      dispatch({
        type: `subaPromo/${modalType}`,
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
        type: 'productstock/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    onGetProduct () {
      dispatch({ type: 'productstock/queryItem' })
    },
    onChooseProduct (data) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          productInformation: data
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
          {/* <Filter {...filterProps} /> */}
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}


SubaPromo.defaultProps = {
  subaPromo: {}
}

export default connect(({ productstock, subaPromo, loading, app }) => ({ productstock, subaPromo, loading, app }))(SubaPromo)
