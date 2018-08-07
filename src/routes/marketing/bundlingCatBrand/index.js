import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Modal } from 'antd'
import ModalCancel from './ModalCancel'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Master = ({ bundlingCategory, userStore, loading, dispatch, location, app }) => {
  const { typeModal, pagination, modalCancelVisible, invoiceCancel, listBundling, itemEditListRules, itemEditListReward, modalEditRulesVisible, modalEditRewardVisible, listRules, listReward, modalType, currentItem, activeKey, modalProductVisible } = bundlingCategory
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'bundlingCategory/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listBundling,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['bundlingCategory/query'],
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
      dispatch({
        type: 'bundlingCategory/editItem',
        payload: { item, pathname }
      })
    },
    voidItem (items) {
      dispatch({
        type: 'bundlingCategory/updateState',
        payload: {
          modalCancelVisible: true,
          invoiceCancel: items.code,
          currentItem: items
        }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'bundlingCategory/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    if (key !== '0') {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          dispatch({
            type: 'bundlingCategory/changeTab',
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
          dispatch({
            type: 'bundlingCategory/updateState',
            payload: {
              listBundling: [], listRules: [], listReward: []
            }
          })
        }
      })
    } else {
      dispatch({
        type: 'bundlingCategory/changeTab',
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
      dispatch({
        type: 'bundlingCategory/updateState',
        payload: {
          listBundling: [], listRules: [], listReward: []
        }
      })
    }
  }
  const clickBrowse = () => {
    dispatch({
      type: 'bundlingCategory/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
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
    onSubmit (data, listRules, listReward) {
      if (modalType === 'add') {
        dispatch({
          type: 'bundlingCategory/add',
          payload: {
            data,
            listRules,
            listReward
          }
        })
      } else {
        dispatch({
          type: 'bundlingCategory/edit',
          payload: data
        })
      }
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
        type: 'bundlingCategory/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    getProduct () {
      dispatch({
        type: 'productstock/query'
      })
      dispatch({
        type: 'productstock/updateState',
        payload: {
          list: []
        }
      })
    },
    getService () {
      dispatch({
        type: 'service/query'
      })
      dispatch({
        type: 'service/updateState',
        payload: {
          list: []
        }
      })
    },
    showModal (type) {
      dispatch({
        type: 'bundlingCategory/updateState',
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
        type: 'bundlingCategory/updateState',
        payload: {
          modalProductVisible: false,
          typeModal: null
        }
      })
    },
    updateListRules (data) {
      dispatch({
        type: 'bundlingCategory/updateState',
        payload: {
          listRules: data,
          modalProductVisible: false,
          modalProductEdit: true
        }
      })
    },
    updateListReward (data) {
      dispatch({
        type: 'bundlingCategory/updateState',
        payload: {
          listReward: data,
          modalProductVisible: false,
          modalProductEdit: true
        }
      })
    },
    showModalEdit (item, type) {
      dispatch({
        type: 'bundlingCategory/updateState',
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
        listRules[item.no - 1] = item
        dispatch({
          type: 'bundlingCategory/updateState',
          payload: {
            listRules,
            itemEditListRules: {},
            modalEditRulesVisible: false
          }
        })
      } else if (type === 1) {
        listReward[item.no - 1] = item
        dispatch({
          type: 'bundlingCategory/updateState',
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
          type: 'bundlingCategory/updateState',
          payload: {
            listRules: data,
            itemEditListRules: {},
            modalEditRulesVisible: false
          }
        })
      } else if (type === 1) {
        dispatch({
          type: 'bundlingCategory/updateState',
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
        type: 'bundlingCategory/updateState',
        payload: {
          itemEditListRules: {},
          itemEditListReward: {},
          modalEditRulesVisible: false,
          modalEditRewardVisible: false
        }
      })
    }
  }

  const modalCancelProps = {
    visible: modalCancelVisible,
    loading: loading.effects['pos/queryPosDetail'],
    maskClosable: false,
    invoiceCancel,
    title: 'Cancel the Transaction?',
    confirmLoading: loading.effects['payment/printPayment'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'bundlingCategory/voidTrans',
        payload: {
          id: currentItem.id,
          memo: data.memo
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'bundlingCategory/updateState',
        payload: {
          modalCancelVisible: false,
          invoiceCancel: ''
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
      {modalCancelVisible && <ModalCancel {...modalCancelProps} />}
    </div>
  )
}

Master.propTypes = {
  bundlingCategory: PropTypes.object,
  productstock: PropTypes.object,
  service: PropTypes.object,
  userStore: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ bundlingCategory, productstock, service, userStore, loading, app }) => ({ bundlingCategory, productstock, service, userStore, loading, app }))(Master)
