import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const Employee = ({ location, dispatch, employee, jobposition, city, loading  }) => {
  const { listEmployee, pagination, currentItem, modalVisible, searchVisible, modalType,
    selectedRowKeys, disableItem, visiblePopoverCity, disableMultiSelect } = employee

  const { listLovJobPosition } = jobposition
  const { listCity } = city
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    visiblePopoverCity,
    listCity,
    confirmLoading: loading.effects['employee/update'],
    title: `${modalType === 'add' ? 'Add Employee' : 'Edit Employee'}`,
    disableItem: disableItem,
    wrapClassName: 'vertical-center-modal',
    listJobPosition: listLovJobPosition,
    onOk (data) {
      dispatch({
        type: `employee/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'employee/modalHide',
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `employee/modalHide` })
    },
    modalButtonSaveClick (id, data) {
      dispatch({
        type: `employee/${modalType}`,
        payload: {
          id: id,
          data: data
        },
      })
    },
    modalPopoverVisibleCity () {
      console.log('modalPopoverVisibleCity');
      dispatch({
        type: 'employee/modalPopoverVisibleCity',
      })
    },
    modalButtonCityClick () {
      dispatch({
        type: 'city/query',
      })
    },
    modalPopoverClose () {
      dispatch({
        type: 'employee/modalPopoverClose',
      })
    },
    onChooseCity (data) {
      dispatch({
        type: 'employee/chooseCity',
        payload: {
          modalType,
          currentItem: {
            cityId: data.id,
            cityName: data.cityName,
            employeeId: currentItem.employeeId,
            address01: currentItem.address01,
            address02: currentItem.address02,
            email: currentItem.email,
            employeeName: currentItem.employeeName,
            mobileNumber: currentItem.mobileNumber,
            phoneNumber: currentItem.phoneNumber,
            positionId: currentItem.positionId,
            positionName: currentItem.positionName
          },
        },
      })
    },
  }

  const browseProps = {
    dataSource: listEmployee,
    loading: loading.effects['employee/query'],
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
        type: 'employee/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'employee/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'employee/delete',
        payload: id
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'employee/deleteBatch',
        payload: {
          employeeId: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'employee/searchShow' }) },
    size:'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'employee/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    }}
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
          pathname: '/master/employee',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/employee',
        }))
    },
    onSearchHide () { dispatch({ type: 'employee/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Employee.propTypes = {
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  city: PropTypes.object
}


export default connect(({ employee, jobposition, city, loading }) => ({ employee, jobposition, city, loading }))(Employee)
