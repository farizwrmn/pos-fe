import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import BrowseGroup from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const Customergroup = ({ sellprice, location, dispatch, customergroup, loading, misc }) => {
  const { listGroup, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect } = customergroup

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
    confirmLoading: loading.effects['customergroup/update'],
    title: `${modalType === 'add' ? 'Add Customergroup' : 'Edit Customergroup'}`,
    wrapClassName: 'vertical-center-modal',
    listMisc: listMisc,
    onOk (data) {
      dispatch({
        type: `customergroup/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'customergroup/modalHide',
      })
    },
    modalDropdownClick() {
      dispatch({
        type: `sellprice/query`,
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: `customergroup/modalPopoverVisible`,
      })
    },
    modalPopoverClose () {
      dispatch({
        type: `customergroup/modalPopoverClose`,
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: `customergroup/modalIsEmployeeChange`,
        // payload: { disabledCustomergroupId: data.disabledCustomergroupId }
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `customergroup/modalHide` })
    },

    modalButtonCategoryClick () {
      dispatch({ type: `sellprice/query` })
    },
    modalButtonSaveClick (data) {
      dispatch({
        type: `customergroup/${modalType}`,
        payload: data,
      })
    },
    modalSellPriceClick (data) {
      dispatch({
        type: 'customergroup/choosePrice',
        payload: {
          modalType,
          currentItem: {
              sellPrice: data.miscName,
              discNominal: currentItem.discNominal,
              discPct01: currentItem.discPct01,
              discPct02: currentItem.discPct02,
              discPct03: currentItem.discPct03,
              groupCode: currentItem.groupCode,
              groupName: currentItem.groupName,
          },
        },
      })
    }
  }

  const browseProps = {
    dataSource: listGroup,
    width: 90,
    loading: loading.effects['customergroup/query'],
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
        type: 'customergroup/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'customergroup/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'customergroup/delete',
        payload: {groupCode: id}
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'customergroup/deleteBatch',
        payload: {
          id: selectedRowKeys,
        },
      })
    },

    onSearchShow () { dispatch({ type: 'customergroup/searchShow' }) },

    modalPopoverClose () {
      dispatch({
        type: `customergroup/modalPopoverClose`,
      })
    },
    size:'small',
  }

  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'customergroup/updateState',
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
          pathname: '/master/customergroup',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/customergroup',
        }))
    },
    onSearchHide () { dispatch({ type: 'customergroup/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <BrowseGroup {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Customergroup.propTypes = {
  customergroup: PropTypes.object,
  sellprice: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ sellprice, customergroup, misc, employee, loading }) => ({ sellprice, customergroup, misc, employee, loading }))(Customergroup)
