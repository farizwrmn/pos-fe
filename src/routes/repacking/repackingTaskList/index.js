import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import List from './List'
import Filter from './Filter'
import ModalRepackingFinish from './ModalRepackingFinish'

const RepackingSpk = ({ repackingTaskList, loading, dispatch, location, app }) => {
  const {
    list,
    pagination,
    modalFinishRepackingVisible,
    modalFinishRepackingItem,
    modalMemberTierVisible,
    modalMemberTierItem
  } = repackingTaskList
  const { user, storeInfo } = app

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['repackingTaskList/query']
      || loading.effects['repackingTaskList/openModalFinish'],
    location,
    onOpenModalFinish (record) {
      dispatch({
        type: 'repackingTaskList/openModalFinish',
        payload: {
          id: record.id
        }
      })
    },
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
        type: 'repackingTaskList/editItem',
        payload: { item }
      })
      dispatch({
        type: 'repackingTaskList/loadList',
        payload: item
      })
    }
  }

  const filterProps = {
    listStore: lstorage.getListUserStores(),
    onFilterChange (value) {
      dispatch({
        type: 'repackingTaskList/query',
        payload: {
          ...value
        }
      })
    }
  }

  const modalMemberTierProps = {
    title: 'Update Product',
    okText: 'Update',
    modalType: 'edit',
    visible: modalMemberTierVisible,
    item: modalMemberTierItem,
    loading: loading.effects['repackingTaskList/addRecipe'],
    onEdit (item) {
      dispatch({
        type: 'repackingTaskList/addRecipe',
        payload: item
      })
    },
    onCancel () {
      dispatch({
        type: 'repackingTaskList/updateState',
        payload: {
          modalMemberTierVisible: false
        }
      })
    }
  }

  const formProps = {
    item: modalFinishRepackingItem,
    visible: modalFinishRepackingVisible,
    width: '80%',
    listAllStores: lstorage.getListUserStores(),
    modalMemberTierProps,
    detail: modalFinishRepackingItem && modalFinishRepackingItem.detail && modalFinishRepackingItem.detail.length > 0
      ? modalFinishRepackingItem.detail : [],
    material: modalFinishRepackingItem && modalFinishRepackingItem.material && modalFinishRepackingItem.material.length > 0
      ? modalFinishRepackingItem.material : [],
    modalType: 'edit',
    button: 'Update',
    footer: null,
    onCancel () {
      console.log('onCancel')
      dispatch({
        type: 'repackingTaskList/updateState',
        payload: {
          modalFinishRepackingItem: {},
          modalFinishRepackingVisible: false
        }
      })
    },
    onSubmit (data, reset) {
      data.header.storeId = lstorage.getCurrentUserStore()
      dispatch({
        type: 'repackingTaskList/add',
        payload: {
          data,
          reset
        }
      })
    },
    onOpenModalTier (modalMemberTierType, item) {
      if (modalMemberTierType !== 'add') {
        dispatch({
          type: 'repackingTaskList/updateState',
          payload: {
            modalMemberTierItem: item
          }
        })
      }
      dispatch({
        type: 'repackingTaskList/updateState',
        payload: {
          modalMemberTierVisible: true,
          modalMemberTierType
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {modalFinishRepackingVisible && <ModalRepackingFinish {...formProps} />}
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

RepackingSpk.propTypes = {
  repackingTaskList: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ userStore, repackingTaskList, loading, app }) => ({ userStore, repackingTaskList, loading, app }))(RepackingSpk)
