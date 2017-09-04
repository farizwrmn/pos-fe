import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import BrowseGroup from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const Service = ({ location, dispatch, loading, service, servicetype, misc }) => {
  const { listService, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect } = service

  const { pageSize } = pagination
  const { listServType } = servicetype
  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    listServType,
    pagination,
    maskClosable: false,
    confirmLoading: loading.effects['service/update'],
    title: `${modalType === 'add' ? 'Add service' : 'Edit service'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `service/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'service/modalHide',
      })
    },
    modalDropdownClick() {
      console.log('modalDropdownClick');
      dispatch({
        type: `sellprice/query`,
      })
    },
    modalPopoverVisible () {
      console.log('modalPopoverVisible');
      dispatch({
        type: `service/modalPopoverVisible`,
      })
    },
    modalPopoverClose () {
      dispatch({
        type: `service/modalPopoverClose`,
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: `service/modalIsEmployeeChange`,
        // payload: { disabledserviceId: data.disabledserviceId }
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `service/modalHide` })
    },

    modalButtonCategoryClick () {
      dispatch({ type: `sellprice/query` })
    },
    modalButtonSaveClick (data) {
      console.log('modalButtonSaveClick',data);
      dispatch({
        type: `service/${modalType}`,
        payload: data,
      })
    },
    onChooseItem (data) {
      dispatch({
        type: 'service/choosePrice',
        payload: {
          modalType,
          currentItem: {
              serviceCode: currentItem.serviceCode,
              serviceName: currentItem.serviceName,
              cost: currentItem.cost,
              serviceCost: currentItem.serviceCost,
              serviceTypeId: data.miscName
          },
        },
      })
    }
  }


  const browseProps = {
    dataSource: listService,
    width: 90,
    loading: loading.effects['service/query'],
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
        type: 'service/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'service/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'service/delete',
        payload: {groupCode: id}
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'service/deleteBatch',
        payload: {
          id: selectedRowKeys,
        },
      })
    },

    onSearchShow () { dispatch({ type: 'service/searchShow' }) },

    modalPopoverClose () {
      dispatch({
        type: `service/modalPopoverClose`,
      })
    },
    size:'small',
  }

  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'service/updateState',
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
          pathname: '/master/service',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/service',
        }))
    },
    onSearchHide () { dispatch({ type: 'service/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <BrowseGroup {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Service.propTypes = {
  servicetype: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ servicetype, service, misc, employee, loading }) => ({ servicetype, service, misc, employee, loading }))(Service)
