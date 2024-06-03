import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const RepackingSpk = ({ userStore, repackingSpk, productstock, loading, dispatch, location, app }) => {
  const { list, pagination, modalMemberTierVisible, modalMemberTierItem, modalMemberTierType, detail, modalType, currentItem, activeKey } = repackingSpk
  const { list: listProduct } = productstock
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'repackingSpk/query',
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
    loading: loading.effects['repackingSpk/query'],
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
        type: 'repackingSpk/editItem',
        payload: { item }
      })
      dispatch({
        type: 'repackingSpk/loadList',
        payload: item
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'repackingSpk/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'repackingSpk/changeTab',
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
    dispatch({ type: 'repackingSpk/updateState', payload: { list: [], detail: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'repackingSpk/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  let timeout
  const modalMemberTierProps = {
    title: `${modalMemberTierType === 'add' ? 'Add' : 'Update'} Product`,
    okText: `${modalMemberTierType === 'add' ? 'Add' : 'Update'}`,
    modalType: modalMemberTierType,
    visible: modalMemberTierVisible,
    item: modalMemberTierItem,
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
    onAdd (item) {
      dispatch({
        type: 'repackingSpk/addRecipe',
        payload: item
      })
    },
    onEdit (item) {
      dispatch({
        type: 'repackingSpk/addRecipe',
        payload: item
      })
    },
    onCancel () {
      dispatch({
        type: 'repackingSpk/updateState',
        payload: {
          modalMemberTierVisible: false
        }
      })
    }
  }

  const formProps = {
    listAllStores,
    modalMemberTierProps,
    detail,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `repackingSpk/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    onOpenModalTier (modalMemberTierType, item) {
      if (modalMemberTierType !== 'add') {
        dispatch({
          type: 'repackingSpk/updateState',
          payload: {
            modalMemberTierItem: item
          }
        })
      }
      dispatch({
        type: 'repackingSpk/updateState',
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
        type: 'repackingSpk/updateState',
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

RepackingSpk.propTypes = {
  repackingSpk: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ userStore, repackingSpk, productstock, loading, app }) => ({ userStore, repackingSpk, productstock, loading, app }))(RepackingSpk)
