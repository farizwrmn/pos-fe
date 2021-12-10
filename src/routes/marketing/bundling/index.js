import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Modal, message } from 'antd'
import { IMAGEURL } from 'utils/config.company'
import ModalCancel from './ModalCancel'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Master = ({ bundling, bank, paymentOpts, grabCategory, userStore, loading, dispatch, location, app }) => {
  const { typeModal, pagination, modalCancelVisible, invoiceCancel, listBundling, itemEditListRules, itemEditListReward, modalEditRulesVisible, modalEditRewardVisible, listRules, listReward, modalType, currentItem, activeKey, modalProductVisible } = bundling
  const { listAllStores } = userStore
  const { list: listGrabCategory } = grabCategory
  const { listOpts } = paymentOpts
  const { listBank } = bank
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      // dispatch({
      //   type: 'bundling/query',
      //   payload: {
      //     ...value
      //   }
      // })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value
        }
      }))
    }
  }

  const listProps = {
    dataSource: listBundling,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['bundling/query'],
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
      item.productImageUrl = item.productImage
        && item.productImage != null
        && item.productImage !== '["no_image.png"]'
        && item.productImage !== '"no_image.png"'
        && item.productImage !== 'no_image.png' ?
        JSON.parse(item.productImage).map((detail, index) => {
          return ({
            uid: index + 1,
            name: detail,
            status: 'done',
            url: `${IMAGEURL}/${detail}`,
            thumbUrl: `${IMAGEURL}/${detail}`
          })
        })
        : []
      dispatch({
        type: 'bundling/editItem',
        payload: { item, pathname }
      })
    },
    voidItem (items) {
      dispatch({
        type: 'bundling/updateState',
        payload: {
          modalCancelVisible: true,
          invoiceCancel: items.code,
          currentItem: items
        }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'bundling/delete',
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
            type: 'bundling/changeTab',
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
            type: 'bundling/updateState',
            payload: {
              listBundling: [], listRules: [], listReward: []
            }
          })
        }
      })
    } else {
      dispatch({
        type: 'bundling/changeTab',
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
        type: 'bundling/updateState',
        payload: {
          listBundling: [], listRules: [], listReward: []
        }
      })
    }
  }
  const clickBrowse = () => {
    dispatch({
      type: 'bundling/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    listPaymentOption: listOpts,
    listBank,
    mode: '',
    modalType,
    typeModal,
    listGrabCategory,
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
    onSubmit (data, listRules, listReward, reset) {
      if (modalType === 'add') {
        let haveReplace = false
        for (let key in listReward) {
          const item = listReward[key]
          if (item.replaceable) {
            haveReplace = true
            break
          }
        }
        if (data.buildComponent && !data.haveTargetPrice) {
          message.error('Required: Have Target Price')
          return
        }
        if (data.buildComponent) {
          listReward = []
          if (data.applyMultiple) {
            message.error('Required: Build Component Only For 1 Each Transaction')
            return
          }
        }
        if (haveReplace) {
          if (data && !data.haveTargetPrice) {
            message.error('Required: Target Price')
            return
          }
          const totalReward = listReward.reduce((prev, next) => prev + (next.qty * next.sellPrice), 0)
          if (totalReward > data.targetCostPrice) {
            message.error('Required: Reward Total exceed Cost Price')
            return
          }
        }
        dispatch({
          type: 'bundling/add',
          payload: {
            data,
            listRules,
            listReward,
            reset,
            location
          }
        })
      } else {
        dispatch({
          type: 'bundling/edit',
          payload: { ...data, location, reset }
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
        type: 'bundling/updateState',
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
        type: 'bundling/updateState',
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
        type: 'bundling/updateState',
        payload: {
          modalProductVisible: false,
          typeModal: null
        }
      })
    },
    updateListRules (data) {
      dispatch({
        type: 'bundling/updateState',
        payload: {
          listRules: data,
          modalProductVisible: false,
          modalProductEdit: true
        }
      })
    },
    updateListReward (data) {
      dispatch({
        type: 'bundling/updateState',
        payload: {
          listReward: data,
          modalProductVisible: false,
          modalProductEdit: true
        }
      })
    },
    showModalEdit (item, type) {
      dispatch({
        type: 'bundling/updateState',
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
        const { listRules } = bundling
        listRules[item.no - 1] = item
        dispatch({
          type: 'bundling/updateState',
          payload: {
            listRules,
            itemEditListRules: {},
            modalEditRulesVisible: false
          }
        })
      } else if (type === 1) {
        const { listReward } = bundling
        listReward[item.no - 1] = item
        dispatch({
          type: 'bundling/updateState',
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
          type: 'bundling/updateState',
          payload: {
            listRules: data,
            itemEditListRules: {},
            modalEditRulesVisible: false
          }
        })
      } else if (type === 1) {
        dispatch({
          type: 'bundling/updateState',
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
        type: 'bundling/updateState',
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
        type: 'bundling/voidTrans',
        payload: {
          id: currentItem.id,
          memo: data.memo
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'bundling/updateState',
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
  grabCategory: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  bundling: PropTypes.object,
  productstock: PropTypes.object,
  service: PropTypes.object,
  userStore: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ bundling, bank, paymentOpts, grabCategory, productstock, service, userStore, loading, app }) => ({ bundling, bank, paymentOpts, grabCategory, productstock, service, userStore, loading, app }))(Master)
