import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button, Popconfirm } from 'antd'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'
import Unit from './Unit'

const Customer = ({ location, customergroup, dispatch, customer, loading, misc, employee, unit }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, disableItem, modalType, selectedRowKeys, disableMultiSelect } = customer

  const { listMisc } = misc
  const { listUnit } = unit
  const { listGroup } = customergroup
  const { pageSize } = pagination

  const modalProps = {
    closable: false,
    item: currentItem,
    loading: loading.effects['customer/query'],
    listUnit,
    listGroup,
    width: 950,
    visible: modalVisible,
    visiblePopover,
    disableItem,
    // disabledCustomerId: (disabledCustomerId) ? true : false,
    maskClosable: false,
    confirmLoading: loading.effects['customer/update'],
    title: `${modalType === 'add' ? 'Add Customer' : 'Edit Customer'}`,
    wrapClassName: 'vertical-center-modal',
    listMisc,
    onOk (data) {
      dispatch({
        type: `customer/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'customer/modalHide',
      })
    },
    onDeleteUnit (id) {
      dispatch({
        type: 'units/delete',
        payload: {
          id,
        },
      })
    },
    onChooseItem (data) {
      dispatch({
        type: 'customer/chooseEmployee',
        payload: {
          modalType,
          currentItem: {
            memberGroup: data.id,
            memberCode: currentItem.memberCode,
            idType: currentItem.idType,
            idNo: currentItem.idNo,
            memberName: currentItem.memberName,
            birthDate: currentItem.birthDate,
            address01: currentItem.address01,
            address02: currentItem.address02,
            city: currentItem.city,
            state: currentItem.state,
            zipCode: currentItem.zipCode,
            taxId: currentItem.taxId,
            email: currentItem.email,
            phoneNumber: currentItem.phoneNumber,
            mobileNumber: currentItem.mobileNumber,
          },
        },
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: 'customer/modalPopoverVisible',
      })
    },
    modalPopoverClose () {
      dispatch({
        type: 'customer/modalPopoverClose',
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: 'customer/modalIsEmployeeChange',
        // payload: { disabledCustomerId: data.disabledCustomerId }
      })
    },
    modalButtonTypeClick () {
      dispatch({
        type: 'customergroup/query',
      })
    },
    // modalButtonCancelClick () {
    //   dispatch(
    //     routerRedux.push(
    //     {
    //     pathname: '/master/customer',
    //   }),
    // )
    // },
    modalButtonCancelClick2 () {
      dispatch({ type: 'customer/modalHide' })
    },

    modalButtonSaveClick (id, data) {
      dispatch({
        type: `customer/${modalType}`,
        payload: {
          id,
          data,
        },
      })
    },
    modalButtonEditClick (id, data) {
      dispatch({
        type: 'customer/edit',
        payload: {
          id,
          data,
        },
      })
    },
    modalButtonSaveUnitClick (id, data) {
      dispatch({
        type: 'unit/add',
        payload: {
          id,
          data: {
            memberCode: data.memberCode,
            policeNo: data.policeNo,
            merk: data.merk,
            model: data.model,
            type: data.type,
            year: data.year,
            chassisNo: data.chassisNo,
            machineNo: data.machineNo,
          },
        },
      })
    },
    modalButtonEditUnitClick (id, data) {
      dispatch({
        type: 'unit/edit',
        payload: {
          id,
          data: {
            memberCode: data.memberCode,
            policeNo: data.policeNo,
            merk: data.merk,
            model: data.model,
            type: data.type,
            year: data.year,
            chassisNo: data.chassisNo,
            machineNo: data.machineNo,
          },
        },
      })
    },
    modalButtonDeleteUnitClick (id, data) {
      dispatch({
        type: 'unit/delete',
        payload: {
          id,
          data: data.memberCode,
        },
      })
    },
    onClickRowunit (data) {
      dispatch({
        type: 'customer/chooseUnit',
        payload: {
          modalType: 'query',
          currentItem: {
            memberCode: data.memberCode,
            policeNo: data.policeNo,
            merk: data.merk,
            model: data.model,
            type: data.type,
            year: data.year,
            chassisNo: data.chassisNo,
            machineNo: data.machineNo,
            memberCode: currentItem.memberCode,
            idType: currentItem.idType,
            idNo: currentItem.idNo,
            memberName: currentItem.memberName,
            birthDate: currentItem.birthDate,
            address01: currentItem.address01,
            address02: currentItem.address02,
            city: currentItem.city,
            state: currentItem.state,
            zipCode: currentItem.zipCode,
            taxId: currentItem.taxId,
            email: currentItem.email,
            phoneNumber: currentItem.phoneNumber,
            mobileNumber: currentItem.mobileNumber,
          },
        },
      })
    },

  }

  const browseProps = {
    dataSource: list,
    loading: loading.effects['customer/query'],
    pagination,
    location,
    onChangeUnit (page) {
      const { query, pathname } = location
      dispatch({
        type: 'unit/query',
        payload: {
          id: page.memberCode,
        },
      })
    },
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
        type: 'customer/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'customer/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'customer/delete',
        payload: {
          id,
        },
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'customer/deleteBatch',
        payload: {
          customerId: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'customer/searchShow' }) },
    modalPopoverClose () {
      dispatch({
        type: 'customer/modalPopoverClose',
      })
    },
    size: 'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    { rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'customer/updateState',
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
        pathname: '/master/customer',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/master/customer',
      }))
    },
    onSearchHide () { dispatch({ type: 'customer/searchHide' }) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Customer.propTypes = {
  customer: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  unit: PropTypes.object,
  customergroup: PropTypes.object,
}


export default connect(({ customergroup, customer, misc, employee, loading, unit }) => ({ customergroup, customer, misc, employee, loading, unit }))(Customer)
