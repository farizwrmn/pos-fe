import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const ProductBrand = ({ location, dispatch, productBrand, loading }) => {
  const { listBrand, pagination, currentItem, modalVisible, searchVisible, modalType,
    selectedRowKeys, disableItem, disableMultiSelect } = productBrand
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'add' ? {} : currentItem,
    visible: modalVisible,
    confirmLoading: loading.effects['productBrand/update'],
    title: `${modalType === 'add' ? 'Add Brand' : 'Edit Brand'}`,
    disableItem: disableItem,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `productBrand/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'productBrand/modalHide',
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `productBrand/modalHide` })
    },
    modalButtonSaveClick (id, data) {
      dispatch({
        type: `productBrand/${modalType}`,
        payload: {
          id: id,
          data: data
        },
      })
    }
  }

  const browseProps = {
    dataSource: listBrand,
    loading: loading.effects['productBrand/query'],
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
        type: 'productBrand/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'productBrand/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id, name) {
      dispatch({
        type: 'productBrand/delete',
        payload: {
          id : id,
          name : name
        }
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'productBrand/deleteBatch',
        payload: {
          brandCode: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'productBrand/searchShow' }) },
    size:'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'productBrand/updateState',
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
          pathname: '/master/product/brand',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/product/brand',
        }))
    },
    onSearchHide () { dispatch({ type: 'productBrand/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

ProductBrand.propTypes = {
  productBrand: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ productBrand, loading }) => ({ productBrand, loading }))(ProductBrand)
