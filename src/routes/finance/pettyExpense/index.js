import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { /* Button */ Tabs } from 'antd'
import { lstorage } from 'utils'
import Form from './Form'
// import List from './List'
// import Filter from './Filter'

const TabPane = Tabs.TabPane

const Counter = ({ pettyExpense, pettyCashDetail, userStore, accountRule, loading, dispatch, location }) => {
  const { list, modalCashRegisterVisible, modalEditNotesItem, modalEditNotesVisible, currentItemCancel, modalCancelVisible, activeKey, currentItemExpense, modalExpenseVisible } = pettyExpense
  const { listEmployee } = pettyCashDetail
  const { listAccountCode, listAccountCodeExpense } = accountRule
  const { listAllTargetStores } = userStore
  // const { user, storeInfo } = app
  // const filterProps = {
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'pettyExpense/query',
  //       payload: {
  //         ...value
  //       }
  //     })
  //   }
  // }

  // const listProps = {
  //   dataSource: list,
  //   user,
  //   storeInfo,
  //   pagination,
  //   loading: loading.effects['pettyExpense/query'],
  //   location,
  //   onChange (page) {
  //     const { query, pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         ...query,
  //         page: page.current,
  //         pageSize: page.pageSize
  //       }
  //     }))
  //   },
  //   editItem (item) {
  //     const { pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         activeKey: 0
  //       }
  //     }))
  //     dispatch({
  //       type: 'pettyExpense/editItem',
  //       payload: { item }
  //     })
  //   },
  //   deleteItem (id) {
  //     dispatch({
  //       type: 'pettyExpense/delete',
  //       payload: id
  //     })
  //   }
  // }

  const changeTab = (key) => {
    dispatch({
      type: 'pettyExpense/changeTab',
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
    dispatch({ type: 'pettyExpense/updateState', payload: { list: [] } })
  }

  // const clickBrowse = () => {
  //   dispatch({
  //     type: 'pettyExpense/updateState',
  //     payload: {
  //       activeKey: '1'
  //     }
  //   })
  // }

  const modalCancelProps = {
    title: 'Cancel Expense',
    item: currentItemCancel,
    visible: modalCancelVisible,
    loading: loading.effects['pettyExpense/deleteExpenseRequest'],
    onOk (item, reset) {
      dispatch({
        type: 'pettyExpense/deleteExpenseRequest',
        payload: {
          item,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          currentItemCancel: {},
          modalCancelVisible: false
        }
      })
    }
  }

  const modalCashRegisterProps = {
    modalCashRegisterVisible,
    listAccountCode,
    listAllStores: listAllTargetStores.map(item => ({ value: item.id, label: item.storeName })),
    listEmployee,
    loading: loading.effects['pettyCashDetail/insertExpense'],
    visible: modalCashRegisterVisible,
    dispatch,
    onOk (item, reset) {
      dispatch({
        type: 'pettyCashDetail/insertExpense',
        payload: {
          item,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalCashRegisterVisible: false
        }
      })
    }
  }

  const modalExpenseProps = {
    item: currentItemExpense,
    visible: modalExpenseVisible,
    listAccountCode: listAccountCodeExpense,
    loading: loading.effects['pettyExpense/generateExpense'] || loading.effects['pettyExpense/deleteExpenseRequest'],
    onOk (item, reset) {
      dispatch({
        type: 'pettyExpense/generateExpense',
        payload: {
          item,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalExpenseVisible: false,
          currentItemExpense: {}
        }
      })
    }
  }

  const modalEditNotesProps = {
    item: modalEditNotesItem,
    visible: modalEditNotesVisible,
    loading: loading.effects['pettyExpense/editExpense'],
    onOk (data, reset) {
      if (modalEditNotesItem && modalEditNotesItem.id) {
        dispatch({
          type: 'pettyExpense/editExpense',
          payload: {
            id: modalEditNotesItem.id,
            data,
            reset
          }
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalEditNotesVisible: false,
          modalEditNotesItem: {}
        }
      })
    }
  }

  const formProps = {
    list,
    loading: loading.effects['pettyExpense/generateExpense'],
    loadingExpense: loading.effects['pettyExpense/queryActive'],
    modalExpenseProps,
    modalCancelProps,
    modalEditNotesProps,
    modalCashRegisterProps,
    onRefresh () {
      dispatch({
        type: 'pettyExpense/queryActive'
      })
    },
    onClickNotes (item) {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalEditNotesVisible: true,
          modalEditNotesItem: item
        }
      })
    },
    addNewBalance () {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalCashRegisterVisible: true
        }
      })
      dispatch({
        type: 'pettyCashDetail/queryEmployee',
        payload: {
          storeId: lstorage.getCurrentUserStore()
        }
      })
    },
    handleClick (item) {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalExpenseVisible: true,
          currentItemExpense: item
        }
      })
    },
    onDelete (item) {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          currentItemCancel: item,
          modalCancelVisible: true
        }
      })
    }
  }

  // let moreButtonTab
  // if (activeKey === '0') {
  //   moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  // }

  return (
    <div className="content-inner">
      <Tabs
        activeKey={activeKey}
        onChange={key => changeTab(key)}
        // tabBarExtraContent={moreButtonTab}
        type="card"
      >
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        {/* <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane> */}
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  accountRule: PropTypes.object,
  pettyExpense: PropTypes.object,
  pettyCashDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pettyExpense, pettyCashDetail, userStore, accountRule, loading, app }) => ({ pettyExpense, pettyCashDetail, userStore, accountRule, loading, app }))(Counter)
