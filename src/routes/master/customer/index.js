import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button, Popconfirm } from 'antd'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'
import Unit from './Unit'

const Customer = ({ location, customergroup, customertype, dispatch, customer, loading, employee, city,unit }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, disableItem, modalType, selectedRowKeys, disableMultiSelect,
  visiblePopoverType, visiblePopoverCity } = customer

  const { listCity } = city
  const { listUnit } = unit
  const { listGroup } = customergroup
  const { pageSize } = pagination
  const { listType } = customertype

  const modalProps = {
    closable: false,
    item: currentItem,
    loading: loading.effects['customer/query'],
    listUnit,
    listCity,
    listGroup,
    listType,
    width: 950,
    visible: modalVisible,
    visiblePopover,
    visiblePopoverType,
    visiblePopoverCity,
    disableItem,
    // disabledCustomerId: (disabledCustomerId) ? true : false,
    maskClosable: false,
    confirmLoading: loading.effects['customer/update'],
    title: `${modalType === 'add' ? 'Add Customer' : 'Edit Customer'}`,
    wrapClassName: 'vertical-center-modal',
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
      console.log('onChooseItem', data, 'currentItem', currentItem)
      dispatch({
        type: 'customer/chooseEmployee',
        payload: {
          modalType,
          currentItem: {
            memberGroupId: data.id,
            memberGroupName: data.groupName,
            memberCode: currentItem.memberCode,
            memberTypeName: currentItem.memberTypeName,
            memberTypeId: currentItem.memberTypeId,
            idType: currentItem.idType,
            idNo: currentItem.idNo,
            cityId: currentItem.cityId,
            memberName: currentItem.memberName,
            birthDate: currentItem.birthDate,
            address01: currentItem.address01,
            address02: currentItem.address02,
            cityName: currentItem.cityName,
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
    onChooseCity (data) {
      console.log('onChooseCity', data, 'currentItem', currentItem)
      dispatch({
        type: 'customer/chooseCity',
        payload: {
          modalType,
          currentItem: {
            cityId: data.id,
            memberGroupName: currentItem.memberGroupName,
            memberGroupId: currentItem.memberGroupId,
            memberTypeId: currentItem.memberTypeId,
            memberCode: currentItem.memberCode,
            memberTypeName: currentItem.memberTypeName,
            idType: currentItem.idType,
            idNo: currentItem.idNo,
            memberName: currentItem.memberName,
            birthDate: currentItem.birthDate,
            address01: currentItem.address01,
            address02: currentItem.address02,
            cityName: data.cityName,
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
    onChooseType (data) {
      console.log('onChooseItem', data, 'currentItem', currentItem)
      dispatch({
        type: 'customer/chooseType',
        payload: {
          modalType,
          currentItem: {
            memberGroupId: currentItem.memberGroupId,
            memberGroupName: currentItem.memberGroupName,
            memberTypeName: data.typeName,
            memberTypeId: data.id,
            memberCode: currentItem.memberCode,
            idType: currentItem.idType,
            idNo: currentItem.idNo,
            cityId: currentItem.cityId,
            memberName: currentItem.memberName,
            birthDate: currentItem.birthDate,
            address01: currentItem.address01,
            address02: currentItem.address02,
            cityName: currentItem.cityName,
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
    modalPopoverVisibleCity () {
      dispatch({
        type: 'customer/modalPopoverVisibleCity',
      })
    },
    modalPopoverVisibleType () {
      dispatch({
        type: 'customer/modalPopoverVisibleType',
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
        type: 'customertype/query',
      })
    },

    modalButtonGroupClick () {
      dispatch({
        type: 'customergroup/query',
      })
    },
    modalButtonCityClick () {
      dispatch({
        type: 'city/query',
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
      console.log('modalButtonSaveClick data:', data);
      dispatch({
        type: `customer/${modalType}`,
        payload: {
          id,
          data: {
            address01: data.address01,
            address02: data.address02,
            birthDate: data.birthDate,
            cityId: data.cityId,
            cityName: data.cityName,
            email: data.email,
            idNo: data.idNo,
            idType: data.idType,
            gender: data.gender,
            memberCode: data.memberCode,
            memberGroupId: data.memberGroupId,
            memberGroupName: data.memberGroupName,
            memberName: data.memberName,
            memberTypeId: data.memberTypeId,
            memberTypeName: data.memberTypeName,
            mobileNumber: data.mobileNumber,
            phoneNumber: data.phoneNumber,
            state: data.state,
            taxId: data.taxId,
            zipCode: data.zipCode,
          },
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
            memberGroupId: currentItem.memberGroupId,
            memberGroupName: currentItem.memberGroupName,
            memberTypeId: currentItem.memberTypeId,
            memberTypeName: currentItem.memberTypeName,
            cityId: currentItem.cityId,
            cityName: currentItem.cityName,
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
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  unit: PropTypes.object,
  city: PropTypes.object,
  customergroup: PropTypes.object,
  customertype: PropTypes.object,
}

export default connect(({ customertype, city, customergroup, customer, employee, loading, unit }) => ({ customertype, city,customergroup, customer, employee, loading, unit }))(Customer)
