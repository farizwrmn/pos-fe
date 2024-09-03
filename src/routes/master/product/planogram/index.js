import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Button } from 'antd'
import AdvancedForm from './AdvancedForm'
import List from './List'

const TabPane = Tabs.TabPane

const Planogram = ({ planogram, userStore, loading, dispatch, location, app }) => {
  const { listAllStores } = userStore
  const {
    list: listPlanogram,
    activeKey,
    currentItem,
    modalType,
    pagination
  } = planogram
  const { user, storeInfo } = app

  const listProps = {
    dataSource: listPlanogram,
    listAllStores,
    user,
    pagination,
    dispatch,
    storeInfo,
    loadingModel: loading,
    loading: loading.effects['planogram/query'] || loading.effects['planogram/edit'] || loading.effects['planogram/editItem'],
    location,
    onChange (page) {
      dispatch(routerRedux.push({
        pathname: '/stock-planogram',
        query: {
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem (item) {
      dispatch({
        type: 'planogram/editItem',
        payload: item
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'planogram/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'planogram/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    })
    dispatch({
      type: 'planogram/query'
    })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'planogram/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  // const onShowHideSearch = () => {
  //   dispatch({
  //     type: 'planogram/updateState',
  //     payload: {
  //       show: !show
  //     }
  //   })
  // }

  const advanceFormProps = {
    listPlanogram,
    listAllStores,
    modalType,
    loadingButton: loading,
    currentItem,
    dispatch,
    button: `${modalType === 'add' ? 'Save' : 'Update'}`,
    modalSwitchChange (checked) {
      if (checked) {
        dispatch({
          type: 'planogram/updateState',
          payload: { checked: true }
        })
      } else {
        dispatch({
          type: 'planogram/updateState',
          payload: { checked: false }
        })
      }
    },
    onClickPlanogram () {
      dispatch({
        type: 'planogram/updateState',
        payload: {
          activeKey: '2'
        }
      })
    },
    onSubmit (id, data, resetFields) {
      dispatch({
        type: `planogram/${modalType}`,
        payload: {
          id,
          location,
          resetFields,
          ...data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'planogram/updateState',
        payload: {
          activeKey: '0',
          modalType: 'add',
          currentItem: {}
        }
      })
    }
  }

  let moreButtonTab
  switch (activeKey) {
    case '0':
      moreButtonTab = (
        <div>
          <Button onClick={() => clickBrowse()}>Browse</Button>
        </div>
      )
      break
    default:
      break
  }

  return (
    <div className={(activeKey === '0') || activeKey === '1' ? 'content-inner' : 'content-inner-no-color'}>
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0">
          {activeKey === '0' && <AdvancedForm {...advanceFormProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1">
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Planogram.propTypes = {
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  planogram: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ planogram, userStore, location, productSource, productDivision, productDepartment, productSubdepartment, stockLocation, expressProductCategory, expressProductBrand, productcountry, stockExtraPriceStore, purchase, grabCategory, specification, store, specificationStock, variantStock, productcategory, productbrand, variant, loading, app }) =>
  ({ planogram, userStore, location, productSource, productDivision, productDepartment, productSubdepartment, stockLocation, expressProductCategory, expressProductBrand, productcountry, stockExtraPriceStore, purchase, grabCategory, specification, store, specificationStock, variantStock, productcategory, productbrand, variant, loading, app }))(Planogram)
