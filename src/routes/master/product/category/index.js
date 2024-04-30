import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Menu, Icon, Dropdown } from 'antd'
import Form from './Form'
// import List from './List'
// import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const ProductCategory = ({ productcategory, loading, dispatch, location, app }) => {
  const { listCategory, lastTrans, listCategoryCurrent, expandedTree, modalType, currentItem, activeKey, disable, show
    // display, isChecked
  } = productcategory
  const { storeInfo, user } = app
  // const filterProps = {
  //   display,
  //   isChecked,
  //   show,
  //   filter: {
  //     ...location.query
  //   },
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'productcategory/query',
  //       payload: {
  //         ...value
  //       }
  //     })
  //   },
  //   switchIsChecked () {
  //     dispatch({
  //       type: 'productcategory/switchIsChecked',
  //       payload: `${isChecked ? 'none' : 'block'}`
  //     })
  //   },
  //   onResetClick () {
  //     dispatch({ type: 'productcategory/resetProductCategoryList' })
  //   }
  // }

  // const listProps = {
  //   dataSource: listCategory,
  //   loading: loading.effects['productcategory/query'],
  //   user,
  //   storeInfo,
  //   location,
  //   editItem (item) {
  //     dispatch({
  //       type: 'productcategory/updateState',
  //       payload: {
  //         modalType: 'edit',
  //         activeKey: '0',
  //         currentItem: item,
  //         disable: 'disabled'
  //       }
  //     })
  //     const { pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         activeKey: 0
  //       }
  //     }))
  //     dispatch({
  //       type: 'productcategory/query'
  //     })
  //   },
  //   deleteItem (id) {
  //     dispatch({
  //       type: 'productcategory/delete',
  //       payload: id
  //     })
  //   }
  // }

  const changeTab = (key) => {
    dispatch({
      type: 'productcategory/updateState',
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
    dispatch({ type: 'productcategory/resetProductCategoryList' })
  }
  const clickBrowse = () => {
    dispatch({
      type: 'productcategory/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }
  const onShowHideSearch = () => {
    dispatch({
      type: 'productcategory/updateState',
      payload: {
        show: !show
      }
    })
  }

  const formProps = {
    lastTrans,
    loading,
    listCategory,
    listCategoryCurrent,
    expandedTree,
    item: currentItem,
    modalType,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `productcategory/${modalType}`,
        payload: {
          id,
          data
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
    },
    queryEditItem (categoryCode, id) {
      dispatch({
        type: 'productcategory/updateState',
        payload: {
          currentItem: {}
        }
      })
      dispatch({
        type: 'productcategory/queryEditItem',
        payload: {
          id,
          categoryCode
        }
      })
    },
    showCategoriesParent () {
      dispatch({
        type: 'productcategory/query',
        payload: {
          type: 'lov',
          id: currentItem.id
        }
      })
    }
  }

  const printProps = {
    dataSource: listCategory,
    user,
    storeInfo
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button><Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          <Form {...formProps} />
        </TabPane>
        {/* <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane> */}
      </Tabs >
    </div>
  )
}

ProductCategory.propTypes = {
  productcategory: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productcategory, loading, app }) => ({ productcategory, loading, app }))(ProductCategory)
