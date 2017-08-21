import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Modal from './Modal'

const Purchase = ({ location, purchasegroup, dispatch, purchase, loading, unit }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible,
     modalType, selectedRowKeys, disableMultiSelect } = purchase

  const { pageSize } = pagination

  const modalProps = {
    closable: false,
    item: currentItem,
    loading: loading.effects['payment/query'],
    width: 950,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['purchase/edit'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `purchase/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'purchase/modalHide',
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
        type: 'purchase/chooseEmployee',
      })
    },
  }

  const browseProps = {
    dataSource: list,
    loading: loading.effects['purchase/query'],
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
        type: 'purchase/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'purchase/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'purchase/delete',
        payload: {
          id,
        },
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'purchase/deleteBatch',
        payload: {
          purchaseId: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'purchase/searchShow' }) },
    modalPopoverClose () {
      dispatch({
        type: 'purchase/modalPopoverClose',
      })
    },
    size: 'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    { rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'purchase/updateState',
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
        pathname: '/master/purchase',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/master/purchase',
      }))
    },
    onSearchHide () { dispatch({ type: 'purchase/searchHide' }) },
  }

  return (
    <div className="content-inner">
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Purchase.propTypes = {
  purchase: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ purchase, loading, unit }) => ({ purchase, loading, unit }))(Purchase)
