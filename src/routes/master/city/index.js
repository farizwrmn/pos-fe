import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import BrowseGroup from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const City = ({ location, dispatch, city, loading, misc }) => {
  const { listCity, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect } = city

  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    maskClosable: false,
    confirmLoading: loading.effects['city/update'],
    title: `${modalType === 'add' ? 'Add city' : 'Edit city'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `city/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'city/modalHide',
      })
    },
    modalDropdownClick() {
      console.log('modalDropdownClick');
      dispatch({
        type: `sellprice/query`,
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: `city/modalPopoverVisible`,
      })
    },
    modalPopoverClose () {
      dispatch({
        type: `city/modalPopoverClose`,
      })
    },
    modalIsEmployeeChange (data) {
      dispatch({
        type: `city/modalIsEmployeeChange`,
        // payload: { disabledcityId: data.disabledcityId }
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `city/modalHide` })
    },

    modalButtonCategoryClick () {
      dispatch({ type: `sellprice/query` })
    },
    modalButtonSaveClick (data) {
      console.log('modalButtonSaveClick',data);
      dispatch({
        type: `city/${modalType}`,
        payload: data,
      })
    },
    modalSellPriceClick (data) {
      dispatch({
        type: 'city/choosePrice',
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
    dataSource: listCity,
    width: 90,
    loading: loading.effects['city/query'],
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
        type: 'city/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'city/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'city/delete',
        payload: {groupCode: id}
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'city/deleteBatch',
        payload: {
          id: selectedRowKeys,
        },
      })
    },

    onSearchShow () { dispatch({ type: 'city/searchShow' }) },

    modalPopoverClose () {
      dispatch({
        type: `city/modalPopoverClose`,
      })
    },
    size:'small',
  }

  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'city/updateState',
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
          pathname: '/master/city',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/city',
        }))
    },
    onSearchHide () { dispatch({ type: 'city/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <BrowseGroup {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

City.propTypes = {
  city: PropTypes.object,
  misc: PropTypes.object,
  employee: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ city, misc, employee, loading }) => ({ city, misc, employee, loading }))(City)
