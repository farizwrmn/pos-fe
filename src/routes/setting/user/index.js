import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const User = ({ location, dispatch, user, loading, misc, employee }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect } = user

  const { listLovEmployee } = employee
  const { listLov }  = misc
  const { pageSize } = pagination

  const listUserRole = listLov &&
    listLov.hasOwnProperty('userrole') ? listLov.userrole : []

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    maskClosable: false,
    confirmLoading: loading.effects['user/update'],
    title: `${modalType === 'add' ? 'Add User' : 'Edit User'}`,
    wrapClassName: 'vertical-center-modal',
    listLovEmployee: listLovEmployee,
    listUserRole: listUserRole,
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
    modalButtonSaveClick (id, data) {
      dispatch({
        type: `user/${modalType}`,
        payload: {
          id: id,
          data: data
        },
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
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ user, misc, employee, loading }) => ({ user, misc, employee, loading }))(User)
