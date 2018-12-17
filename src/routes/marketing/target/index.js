import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import ModalTarget from './ModalTarget'

const TabPane = Tabs.TabPane

const Target = ({ target, loading, productbrand, productcategory, dispatch, location, app }) => {
  const { listTarget, modalTargetVisible, pagination, modalType, currentItem, currentModal, activeKey } = target
  const { listBrand } = productbrand
  const { listCategory } = productcategory
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'target/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listTarget,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['target/query'],
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
        type: 'target/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'target/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'target/changeTab',
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
    dispatch({ type: 'target/updateState', payload: { listTarget: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'target/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const months = [
    {
      month: 'January'
    },
    {
      month: 'February'
    },
    {
      month: 'March'
    },
    {
      month: 'April'
    },
    {
      month: 'May'
    },
    {
      month: 'June'
    },
    {
      month: 'July'
    },
    {
      month: 'August'
    },
    {
      month: 'September'
    },
    {
      month: 'October'
    },
    {
      month: 'November'
    },
    {
      month: 'December'
    }
  ]

  const formProps = {
    dispatch,
    months,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `target/${modalType}`,
        payload: data
      })
    },
    clickRow (data, index) {
      dispatch({
        type: 'target/updateState',
        payload: {
          modalTargetVisible: true,
          currentModal: index
        }
      })
    },
    updateItem (items) {
      dispatch({
        type: 'target/updateState',
        payload: {
          currentItem: items
        }
      })
    },
    updateActiveKeyCategory (key) {
      dispatch({
        type: 'target/updateState',
        payload: {
          activeKeyCategory: key
        }
      })
    },
    updateActiveKeyBrand (key) {
      dispatch({
        type: 'target/updateState',
        payload: {
          activeKeyBrand: key
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
        type: 'target/updateState',
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

  const modalTargetProps = {
    width: '500px',
    okText: 'Save',
    listCategory,
    listBrand,
    currentModal,
    item: currentItem,
    title: (months[currentModal] || {}).month ? `Target ${months[currentModal].month}` : 'Target',
    visible: modalTargetVisible,
    onCancel () {
      dispatch({
        type: 'target/updateState',
        payload: {
          modalTargetVisible: false,
          currentModal: null
        }
      })
    },
    onSubmit (data) {
      const currentBrand = data.brand.filter(x => x.targetSales !== null && x.targetSalesQty !== null && x.targetSales !== '' && x.targetSalesQty !== '')
      const currentCategory = data.category.filter(x => x.targetSales !== null && x.targetSalesQty !== null && x.targetSales !== '' && x.targetSalesQty !== '')
      data.id = currentItem.id
      data.brand = currentBrand.concat((currentItem.brand || []).filter(x => x.month !== currentModal + 1))
      data.category = currentCategory.concat((currentItem.category || []).filter(x => x.month !== currentModal + 1))
      dispatch({
        type: 'target/updateState',
        payload: {
          currentItem: data,
          modalTargetVisible: false
        }
      })
    }
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
      {modalTargetVisible && <ModalTarget {...modalTargetProps} />}
    </div>
  )
}

Target.propTypes = {
  target: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ target, productbrand, productcategory, loading, app }) => ({ target, productbrand, productcategory, loading, app }))(Target)
