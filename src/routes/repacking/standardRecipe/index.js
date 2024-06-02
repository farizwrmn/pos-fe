import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const IncentiveMember = ({ standardRecipe, productstock, loading, dispatch, location, app }) => {
  const { list, pagination, modalMemberTierVisible, modalMemberTierItem, modalMemberTierType, detail, modalType, currentItem, activeKey } = standardRecipe
  const { list: listProduct } = productstock
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'standardRecipe/query',
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
    loading: loading.effects['standardRecipe/query'],
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
        type: 'standardRecipe/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'standardRecipe/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'standardRecipe/changeTab',
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
    dispatch({ type: 'standardRecipe/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'standardRecipe/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalMemberTierProps = {
    title: `${modalMemberTierType === 'add' ? 'Add' : 'Update'} Product`,
    okText: `${modalMemberTierType === 'add' ? 'Add' : 'Update'}`,
    modalType: modalMemberTierType,
    visible: modalMemberTierVisible,
    item: modalMemberTierItem,
    onAdd (item) {
      dispatch({
        type: 'standardRecipe/addRecipe',
        payload: item
      })
    },
    onEdit (item) {
      dispatch({
        type: 'standardRecipe/addRecipe',
        payload: item
      })
    },
    onCancel () {
      dispatch({
        type: 'standardRecipe/updateState',
        payload: {
          modalMemberTierVisible: false
        }
      })
    }
  }

  let timeout
  const formProps = {
    modalMemberTierProps,
    detail,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    listProduct,
    fetching: loading.effects['productstock/query'],
    showLov (models, data) {
      if (!data) {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5
          }
        })
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      timeout = setTimeout(() => {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5,
            ...data
          }
        })
      }, 400)
    },
    onSubmit (data, reset) {
      dispatch({
        type: `standardRecipe/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    onOpenModalTier (modalMemberTierType, item) {
      if (modalMemberTierType !== 'add') {
        dispatch({
          type: 'standardRecipe/updateState',
          payload: {
            modalMemberTierItem: item
          }
        })
      }
      dispatch({
        type: 'standardRecipe/updateState',
        payload: {
          modalMemberTierVisible: true,
          modalMemberTierType
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
        type: 'standardRecipe/updateState',
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

IncentiveMember.propTypes = {
  standardRecipe: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ standardRecipe, productstock, loading, app }) => ({ standardRecipe, productstock, loading, app }))(IncentiveMember)
