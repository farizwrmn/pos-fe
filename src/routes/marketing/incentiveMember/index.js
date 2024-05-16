import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const IncentiveMember = ({ incentiveMember, userStore, loading, dispatch, location, app }) => {
  const { list, pagination, modalMemberTierVisible, modalMemberTierItem, modalMemberTierType, listTier, modalType, currentItem, activeKey } = incentiveMember
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'incentiveMember/query',
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
    loading: loading.effects['incentiveMember/query'],
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
        type: 'incentiveMember/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'incentiveMember/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'incentiveMember/changeTab',
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
    dispatch({ type: 'incentiveMember/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'incentiveMember/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalMemberTierProps = {
    title: `${modalMemberTierType === 'add' ? 'Add' : 'Update'} Tier`,
    okText: `${modalMemberTierType === 'add' ? 'Add' : 'Update'}`,
    modalType: modalMemberTierType,
    visible: modalMemberTierVisible,
    item: modalMemberTierItem,
    onAdd (item) {
      dispatch({
        type: 'incentiveMember/updateState',
        payload: {
          modalMemberTierVisible: false,
          listTier: listTier.concat({
            tierNumber: item.tierNumber,
            tierReward: item.tierReward,
            minNewMember: item.minNewMember,
            maxNewMember: item.maxNewMember
          }).sort((a, b) => a.tierNumber - b.tierNumber)
        }
      })
    },
    onEdit (item) {
      dispatch({
        type: 'incentiveMember/updateState',
        payload: {
          modalMemberTierVisible: false,
          listTier: listTier
            .filter(filtered => filtered.tierNumber !== item.tierNumber)
            .concat({
              tierNumber: item.tierNumber,
              tierReward: item.tierReward,
              minNewMember: item.minNewMember,
              maxNewMember: item.maxNewMember
            }).sort((a, b) => a.tierNumber - b.tierNumber)
        }
      })
    }
  }

  const formProps = {
    modalMemberTierProps,
    listTier,
    listAllStores,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `incentiveMember/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    onOpenModalTier (modalMemberTierType, item) {
      if (modalMemberTierType !== 'add') {
        dispatch({
          type: 'incentiveMember/updateState',
          payload: {
            modalMemberTierItem: item
          }
        })
      }
      dispatch({
        type: 'incentiveMember/updateState',
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
        type: 'incentiveMember/updateState',
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
  incentiveMember: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ incentiveMember, userStore, loading, app }) => ({ incentiveMember, userStore, loading, app }))(IncentiveMember)
