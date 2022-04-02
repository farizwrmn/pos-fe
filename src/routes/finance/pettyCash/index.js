import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import Setting from './Setting'

const TabPane = Tabs.TabPane

const PettyCash = ({ pettyCash, accountCode, userStore, loading, dispatch, location, app }) => {
  const { list, listItem, listOption, pagination, modalType, currentItem, activeKey, sequence, modalItemVisible, currentListItem, modalItemType } = pettyCash
  const { listAccountCode } = accountCode
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'pettyCash/query',
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
    loading: loading.effects['pettyCash/query'],
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
        type: 'pettyCash/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'pettyCash/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'pettyCash/changeTab',
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
    dispatch({ type: 'pettyCash/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'pettyCash/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const listItemProps = {
    dataSource: listItem,
    onEditItem (item) {
      dispatch({
        type: 'pettyCash/updateState',
        payload: {
          modalItemVisible: true,
          modalItemType: 'edit',
          currentListItem: item
        }
      })
    }
  }

  const modalItemProps = {
    listAllStores,
    modalItemVisible,
    listItem,
    visible: modalItemVisible,
    item: currentListItem,
    modalType: modalItemType,
    onAddItem (item) {
      const { listItem } = pettyCash
      const listNewItem = [
        ...listItem
      ]
      if (item && item.storeId && item.storeId.length > 0) {
        for (let key = 0; key < item.storeId.length; key += 1) {
          const data = item.storeId[key]
          const exists = listItem.filter(filtered => parseFloat(filtered.storeId) === parseFloat(data))
          if (exists && exists.length === 0) {
            const storeName = listAllStores.filter(filtered => parseFloat(filtered.id) === parseFloat(data))
            if (storeName && storeName.length > 0) {
              listNewItem.push({
                ...item,
                storeId: parseFloat(data),
                no: listItem.length + key + 1,
                storeName: storeName[0].storeName
              })
            }
          }
        }
        dispatch({
          type: 'pettyCash/updateState',
          payload: {
            listItem: listNewItem.map((item, index) => ({ ...item, no: index + 1 })),
            currentListItem: {},
            modalItemVisible: false,
            modalItemType: 'add'
          }
        })
      }
    },
    onEditItem (item) {
      const { listItem } = pettyCash
      const listNewItem = listItem.map((data, index) => {
        if (parseFloat(data.no) === parseFloat(item.no)) {
          const storeName = listAllStores.filter(filtered => parseFloat(filtered.id) === parseFloat(item.storeId))
          if (storeName && storeName[0]) {
            item.storeName = storeName[0].storeName
            return ({
              ...item,
              no: index + 1
            })
          }
          return data
        }
        return data
      })
      dispatch({
        type: 'pettyCash/updateState',
        payload: {
          listItem: listNewItem,
          currentListItem: {},
          modalItemVisible: false,
          modalItemType: 'add'
        }
      })
    },
    onDeleteItem (item) {
      const { listItem } = pettyCash
      dispatch({
        type: 'pettyCash/updateState',
        payload: {
          listItem: listItem
            .filter(filtered => parseFloat(filtered.no) !== parseFloat(item.no))
            .map((item, index) => ({ ...item, no: index + 1 })),
          currentListItem: {},
          modalItemVisible: false,
          modalItemType: 'add'
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pettyCash/updateState',
        payload: {
          currentListItem: {},
          modalItemVisible: false,
          modalItemType: 'add'
        }
      })
    }
  }

  const formProps = {
    listItemProps,
    listAccountCode,
    listAllStores,
    modalItemProps,
    modalType,
    sequence,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: 'pettyCash/add',
        payload: {
          data: {
            data,
            listItem
          },
          reset
        }
      })
    },
    onAddItem () {
      dispatch({
        type: 'pettyCash/updateState',
        payload: {
          modalItemVisible: true,
          modalItemType: 'add'
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
        type: 'pettyCash/updateState',
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

  const settingProps = {
    listAccountCodeLov: listAccountCode,
    listAllStores,
    listOption,
    onSubmit (data) {
      dispatch({
        type: 'pettyCash/editOption',
        payload: { listData: data }
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
        <TabPane tab="Setting" key="2" >
          {activeKey === '2' &&
            <div>
              <Setting {...settingProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

PettyCash.propTypes = {
  pettyCash: PropTypes.object,
  accountCode: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  userStore: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pettyCash, accountCode, userStore, loading, app }) => ({ pettyCash, accountCode, userStore, loading, app }))(PettyCash)
