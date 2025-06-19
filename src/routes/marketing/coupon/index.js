import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Counter = ({ coupon, userStore, loading, dispatch, location, app }) => {
  const { list, typeModal, pagination, itemEditListRules, itemEditListReward, modalEditRulesVisible, modalEditRewardVisible, listRules, listReward, modalType, currentItem, activeKey, modalProductVisible } = coupon
  const { user, storeInfo } = app
  const { listAllStores } = userStore
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'coupon/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    listAllStores,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['coupon/query'],
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
        type: 'coupon/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'coupon/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'coupon/changeTab',
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
    dispatch({ type: 'coupon/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'coupon/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    mode: '',
    modalType,
    typeModal,
    listAllStores,
    listRules,
    listReward,
    itemEditListRules,
    itemEditListReward,
    modalEditRulesVisible,
    modalEditRewardVisible,
    item: currentItem,
    modalProductVisible,
    loading,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset, listReward = []) {
      dispatch({
        type: `coupon/${modalType}`,
        payload: {
          data,
          reset,
          listReward
        }
      })
    },
    showModal (type) {
      dispatch({
        type: 'coupon/updateState',
        payload: {
          modalProductVisible: true,
          typeModal: type
        }
      })
      dispatch({
        type: 'productstock/updateState',
        payload: {
          listProduct: []
        }
      })
      dispatch({
        type: 'productstock/query'
      })
    },
    hideModal () {
      dispatch({
        type: 'coupon/updateState',
        payload: {
          modalProductVisible: false,
          typeModal: null
        }
      })
    },
    updateListRules (data) {
      dispatch({
        type: 'coupon/updateState',
        payload: {
          listRules: data,
          modalProductVisible: false,
          modalProductEdit: true
        }
      })
    },
    updateListReward (data) {
      dispatch({
        type: 'coupon/updateState',
        payload: {
          listReward: data,
          modalProductVisible: false,
          modalProductEdit: true
        }
      })
    },
    showModalEdit (item, type) {
      dispatch({
        type: 'coupon/updateState',
        payload: {
          itemEditListRules: type === 0 ? item : {},
          itemEditListReward: type === 1 ? item : {},
          modalEditRulesVisible: type === 0,
          modalEditRewardVisible: type === 1
        }
      })
    },
    confirmEditModal (item, type) {
      if (type === 0) {
        const { listRules } = coupon
        listRules[item.no - 1] = item
        dispatch({
          type: 'coupon/updateState',
          payload: {
            listRules,
            itemEditListRules: {},
            modalEditRulesVisible: false
          }
        })
      } else if (type === 1) {
        const { listReward } = coupon
        listReward[item.no - 1] = item
        dispatch({
          type: 'coupon/updateState',
          payload: {
            listReward,
            itemEditListReward: {},
            modalEditRewardVisible: false
          }
        })
      }
    },
    deleteList (data, type) {
      if (type === 0) {
        dispatch({
          type: 'coupon/updateState',
          payload: {
            listRules: data,
            itemEditListRules: {},
            modalEditRulesVisible: false
          }
        })
      } else if (type === 1) {
        dispatch({
          type: 'coupon/updateState',
          payload: {
            listReward: data,
            itemEditListReward: {},
            modalEditRewardVisible: false
          }
        })
      }
    },
    hideEditModal () {
      dispatch({
        type: 'coupon/updateState',
        payload: {
          itemEditListRules: {},
          itemEditListReward: {},
          modalEditRulesVisible: false,
          modalEditRewardVisible: false
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
        type: 'coupon/updateState',
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

Counter.propTypes = {
  coupon: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ coupon, userStore, loading, app }) => ({ coupon, userStore, loading, app }))(Counter)
