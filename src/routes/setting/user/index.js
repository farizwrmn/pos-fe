import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const User = ({ location, dispatch, user, loading, misc, employee, userRole, userStore }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect, activeTab,
    totpChecked, totp
  } = user

  const { listLovEmployee } = employee
  const { listLov }  = misc
  const { roleItem, listUserRole, listUserRoleTarget, listUserRoleChange }  = userRole
  const { storeItem, listAllStores, listUserStores, listCheckedStores }  = userStore
  const { pageSize } = pagination
  
  const listRole = listLov &&
    listLov.hasOwnProperty('userrole') ? listLov.userrole : []

  const modalProps = {
    item: currentItem,
    storeItem,
    roleItem,
    listAllStores,
    listUserStores,
    listCheckedStores,
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    activeTab: activeTab,
    totpChecked,
    totp,
    maskClosable: false,
    confirmLoading: loading.effects['user/query'],
    title: `${modalType === 'add' ? 'Add User' : 'Edit User'}`,
    modalType: modalType,
    wrapClassName: 'vertical-center-modal',
    listLovEmployee: listLovEmployee,
    listRole,
    listUserRole,
    listUserRoleTarget,
    listUserRoleChange,
    onOk (data) {
      dispatch({
        type: `user/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'user/modalHide',
      })
    },
    onChooseItem (data) {
      dispatch({
        type: 'user/chooseEmployee',
        payload: {
          modalType: modalType,
          currentItem: {
            userId: data.employeeId,
            userName: data.employeeName.replace(' ', ''),
            email: data.email,
            fullName: data.employeeName,
          },
        },
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: 'user/modalPopoverVisible',
      })
    },
    modalPopoverClose () {
      dispatch({
        type: 'user/modalPopoverClose',
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: 'user/modalIsEmployeeChange',
        // payload: { disabledUserId: data.disabledUserId }
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: 'user/modalHide' })
    },
    modalButtonSaveClick (userId, data, activeTab) {
      if (activeTab === '3') {                  // tab Role
        dispatch({
          type: `userRole/save`,
          payload: { userId, data, activeTab
          },
        })
      } else if (activeTab === '4' ) {          // tab Store
        dispatch({
          type: 'userStore/saveCheckedStore',
          payload: { userId, data: { store: data } }
        })
      } else if (activeTab === '5' ) {          // tab Security
        dispatch({
          type: `user/edit`,
          payload: { id: userId, data, activeTab
          },
        })
      } else {
        dispatch({
          type: `user/${modalType}`,
          payload: {
            id: userId,
            data: data,
            currentItem: {},
            activeTab
          },
        })
      }
    },
    modalActiveTab (activeTab) {
      dispatch({ type: 'user/activeTab', payload: {activeTab} })
    },
    modalRoleLoad (userId) {
      console.log('modalRoleLoad', userId)
      if (userId) {
        dispatch({
          type: 'userRole/query',
          payload: { userId },
        })
      }
    },
    modalRoleAdd (userRole, userRoleAdd, userRoleDel) {
      dispatch({
        type: 'userRole/updateState',
        payload: {
          listUserRoleTarget: userRole,
          listUserRoleChange: { in: userRoleAdd, out: userRoleDel },
        },
      })
    },
    modalChangeDefaultRole (userId, defaultRole) {
      dispatch({
        type: 'userRole/saveDefaultRole',
        payload: { userId, data: { defaultRole } }
      })
    },
    modalSwitchChange (checked, userId) {
      if (checked) {
        dispatch({ type: 'user/totp',
          payload: { mode: 'generate', id: userId }
        })
        dispatch({
          type: 'user/updateState',
          payload: { totpChecked: true },
        })
      } else {
        dispatch({
          type: 'user/updateState',
          payload: { totpChecked: false },
        })
      }
    },
    modalTotpLoad (userId) {
      dispatch({
        type: 'user/totp',
        payload: { mode: 'load', id: userId },
      })
    },
    modalAllStoresLoad (userId) {
      dispatch({ type: 'userStore/getAllStores', payload: { userId } })
    },
    modalChangeDefaultStore (userId, defaultStore) {
      dispatch({
        type: 'userStore/saveDefaultStore',
        payload: { userId, data: { defaultStore } }
      })
    },
    modalNodeCheckedStore (userId, listCheckedStore) {
      dispatch({
        type: 'userStore/updateCheckedStores',
        payload: { userId, data: { store: listCheckedStore } }
      })
    },
  }

  const browseProps = {
    dataSource: list,
    loading: loading.effects['user/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onAddItem () {
      dispatch({
        type: 'user/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({ type: 'userStore/getAllStores', payload: { userId: item.userId } })
      dispatch({ type: 'userStore/getUserStores', payload: { userId: item.userId } })
      dispatch({
        type: 'user/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'user/delete',
        payload: id,
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'user/deleteBatch',
        payload: {
          userId: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'user/searchShow' }) },
    modalPopoverClose () {
      dispatch({
        type: 'user/modalPopoverClose',
      })
    },
    modalTabChange () {
      dispatch({
        type: 'user/modalTabChange',
      })
    },
    size: 'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    { rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'user/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    } }
  )

  const filterProps = {
    visiblePanel: searchVisible,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/setting/user',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/setting/user',
        }))
    },
    onSearchHide () { dispatch({ type: 'user/searchHide' }) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  userRole: PropTypes.object,
  userStore: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ user, misc, employee, userRole, userStore, loading }) => ({ user, misc, employee, userRole, userStore, loading }))(User)
