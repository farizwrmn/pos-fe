import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const ProductCategory = ({ location, dispatch, productCategory, loading }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible, modalType,
    selectedRowKeys, disableItem, disableMultiSelect } = productCategory
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'add' ? {} : currentItem,
    visible: modalVisible,
    confirmLoading: loading.effects['productCategory/update'],
    title: `${modalType === 'add' ? 'Add Category' : 'Edit Category'}`,
    disableItem: disableItem,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `productCategory/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'productCategory/modalHide',
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `productCategory/modalHide` })
    },
    modalButtonSaveClick (id, data) {
      dispatch({
        type: `productCategory/${modalType}`,
        payload: {
          id: id,
          data: data
        },
      })
    }
  }

  const browseProps = {
    dataSource: list,
    loading: loading.effects['productCategory/query'],
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
        type: 'productCategory/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'productCategory/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'productCategory/delete',
        payload: {
          id : id
        }
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'productCategory/deleteBatch',
        payload: {
          categoryCode: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'productCategory/searchShow' }) },
    size:'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'productCategory/updateState',
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
          pathname: '/master/product/category',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/product/category',
        }))
    },
    onSearchHide () { dispatch({ type: 'productCategory/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

ProductCategory.propTypes = {
  productCategory: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ productCategory, loading }) => ({ productCategory, loading }))(ProductCategory)
