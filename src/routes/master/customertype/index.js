import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import BrowseGroup from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const CustomerType = ({ sellprice, location, dispatch, customertype, loading, misc }) => {
  const { listType, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect } = customertype

  const { pageSize } = pagination
  const { listMisc } = misc
  const { listSellPrice } = sellprice

  const modalProps = {
    item: currentItem,
    listSellPrice,
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    maskClosable: false,
    confirmLoading: loading.effects['customertype/update'],
    title: `${modalType === 'add' ? 'Add Type' : 'Edit Type'}`,
    wrapClassName: 'vertical-center-modal',
    listMisc: listMisc,
    onOk (data) {
      dispatch({
        type: `customertype/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'customertype/modalHide',
      })
    },
    modalDropdownClick() {
      dispatch({
        type: `sellprice/query`,
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: `customertype/modalPopoverVisible`,
      })
    },
    modalPopoverClose () {
      dispatch({
        type: `customertype/modalPopoverClose`,
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: `customertype/modalIsEmployeeChange`,
        // payload: { disabledcustomertypeId: data.disabledcustomertypeId }
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `customertype/modalHide` })
    },
    modalButtonSaveClick (data) {
      dispatch({
        type: `customertype/${modalType}`,
        payload: data,
      })
    },
    modalSellPriceClick (data) {
      dispatch({
        type: 'customertype/choosePrice',
        payload: {
          modalType,
          currentItem: {
              sellPrice: data.miscName,
              discNominal: currentItem.discNominal,
              discPct01: currentItem.discPct01,
              discPct02: currentItem.discPct02,
              discPct03: currentItem.discPct03,
              typeCode: currentItem.typeCode,
              typeName: currentItem.typeName,
          },
        },
      })
    }
  }

  const browseProps = {
    dataSource: listType,
    loading: loading.effects['customertype/query'],
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
        type: 'customertype/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'customertype/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'customertype/delete',
        payload: id
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'customertype/deleteBatch',
        payload: {
          id: selectedRowKeys,
        },
      })
    },

    onSearchShow () { dispatch({ type: 'customertype/searchShow' }) },

    modalPopoverClose () {
      dispatch({
        type: `customertype/modalPopoverClose`,
      })
    },
    size:'small',
  }

  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'customertype/updateState',
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
          pathname: '/master/customertype',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/customertype',
        }))
    },
    onSearchHide () { dispatch({ type: 'customertype/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <BrowseGroup {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

CustomerType.propTypes = {
  customertype: PropTypes.object,
  sellprice: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ sellprice, customertype, misc, employee, loading }) => ({ sellprice, customertype, misc, employee, loading }))(CustomerType)
