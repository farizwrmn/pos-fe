import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const Suppliers = ({ city, location, dispatch, suppliers, loading, misc, employee }) => {
  const { listSuppliers, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, visiblePopoverCity, modalType, selectedRowKeys, disableMultiSelect } = suppliers
  const { listCity } = city
  const { listMisc } = misc
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    width: 1000,
    visible: modalVisible,
    visiblePopover,
    visiblePopoverCity,
    listCity,
    disabledItem,
    maskClosable: false,
    confirmLoading: loading.effects['suppliers/update'],
    title: `${modalType === 'add' ? 'Add Suppliers' : 'Edit Suppliers'}`,
    wrapClassName: 'vertical-center-modal',
    listMisc,
    onOk (data) {
      dispatch({
        type: `suppliers/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'suppliers/modalHide',
      })
    },
    onChooseItem (data) {
      dispatch({
        type: 'suppliers/chooseEmployee',
        payload: {
          modalType,
          currentItem: {
            suppliersId: data.employeeId,
            suppliersName: data.employeeName.replace(' ', ''),
            email: data.email,
            fullName: data.employeeName,
          },
        },
      })
    },
    onChooseCity (data) {
      dispatch({
        type: 'suppliers/chooseCity',
        payload: {
          modalType,
          currentItem: {
            city: data.cityName,
            cityId: data.id,
            supplierCode: currentItem.supplierCode,
            supplierName: currentItem.supplierName,
            address01: currentItem.address01,
            address02: currentItem.address02,
            state: currentItem.state,
            zipCode: currentItem.zipCode,
            phoneNumber: currentItem.phoneNumber,
            mobileNumber: currentItem.mobileNumber,
            email: currentItem.email,
            taxId: currentItem.taxId
          },
        },
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: 'suppliers/modalPopoverVisible',
      })
    },
    modalPopoverClose () {
      dispatch({
        type: 'suppliers/modalPopoverClose',
      })
    },
    modalPopoverVisibleCity () {
      dispatch({
        type: 'suppliers/modalPopoverVisibleCity',
      })
    },
    modalButtonCityClick () {
      dispatch({
        type: 'city/query',
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: 'suppliers/modalIsEmployeeChange',
        // payload: { disabledSuppliersId: data.disabledSuppliersId }
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: 'suppliers/modalHide' })
    },
    modalButtonSaveClick (data) {
      dispatch({
        type: `suppliers/${modalType}`,
        payload: data,
      })
    },
  }

  const browseProps = {
    dataSource: listSuppliers,
    loading: loading.effects['suppliers/query'],
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
        type: 'suppliers/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'suppliers/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'suppliers/delete',
        payload: id,
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'suppliers/deleteBatch',
        payload: {
          suppliersId: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'suppliers/searchShow' }) },
    modalPopoverClose () {
      dispatch({
        type: 'suppliers/modalPopoverClose',
      })
    },
    size: 'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    { rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'suppliers/updateState',
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
        pathname: '/master/suppliers',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/master/suppliers',
      }))
    },
    onSearchHide () { dispatch({ type: 'suppliers/searchHide' }) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Suppliers.propTypes = {
  suppliers: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  location: PropTypes.object,
  city: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ city, suppliers, misc, employee, loading }) => ({ city, suppliers, misc, employee, loading }))(Suppliers)
