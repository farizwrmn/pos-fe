import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const Stock = ({ productBrand, productCategory, location, dispatch, stock, loading }) => {
  const { listStock, pagination, currentItem, modalVisible, searchVisible, modalType,
    selectedRowKeys, visiblePopover, visiblePopoverBrand, disableItem, disableMultiSelect } = stock

  const { list } = productCategory
  const { pageSize } = pagination
  const { listBrand } = productBrand

  const modalProps = {
    width: 1400,
    item: currentItem,
    visible: modalVisible,
    list,
    listBrand,
    visiblePopover,
    visiblePopoverBrand,
    confirmLoading: loading.effects['stock/update'],
    title: `${modalType === 'add' ? 'Add Product' : 'Edit Product'}`,
    disableItem: disableItem,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `stock/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'stock/modalHide',
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: `stock/modalHide` })
    },
    modalButtonSaveClick (id, data) {
      console.log('modalButtonSaveClick', id, data);
      dispatch({
        type: `stock/${modalType}`,
        payload: {
          id: id,
          data: data
        },
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: 'stock/modalPopoverVisible',
      })
    },
    modalPopoverVisibleBrand () {
      dispatch({
        type: 'stock/modalPopoverVisibleBrand',
      })
    },
    modalButtonCategoryClick () {
      dispatch({
        type: 'productCategory/query',
      })
    },
    modalButtonBrandClick () {
      dispatch({
        type: 'productBrand/query',
      })
    },
    modalPopoverClose () {
      dispatch({
        type: 'stock/modalPopoverClose',
      })
    },
    onChooseItem (data) {
      console.log('data:',data, 'currentItem', currentItem);
      dispatch({
        type: 'stock/chooseEmployee',
        payload: {
          modalType,
          currentItem: {
            active: currentItem.active,
            barCode01: currentItem.barCode01,
            barCode02: currentItem.barCode02,
            productCode: currentItem.productCode,
            productName: currentItem.productName,
            categoryId: data.id,
            categoryName: data.categoryName,
            brandCode: currentItem.brandCode,
            brandName: currentItem.brandName,
            otherName01: currentItem.otherName01,
            otherName02: currentItem.otherName02,
            costPrice: currentItem.costPrice,
            sellPrice: currentItem.sellPrice,
            sellPricePre: currentItem.sellPricePre,
            distPrice01: currentItem.distPrice01,
            distPrice02: currentItem.distPrice02,
            trackQty: currentItem.trackQty,
            alertQty: currentItem.alertQty,
            productImage: currentItem.productImage,
            dummyCode: currentItem.dummyCode,
            dummyName: currentItem.dummyName,
            location01: currentItem.location01,
            location02: currentItem.location02,
            exception01: currentItem.exception01,
          },
        },
      })
    },
    onChooseBrand (data) {
      console.log('data:',data, 'currentItem', currentItem);
      dispatch({
        type: 'stock/chooseEmployee',
        payload: {
          modalType,
          currentItem: {
            active: currentItem.active,
            barCode01: currentItem.barCode01,
            barCode02: currentItem.barCode02,
            productCode: currentItem.productCode,
            productName: currentItem.productName,
            categoryId: currentItem.categoryId,
            categoryName: currentItem.categoryName,
            brandName: data.brandName,
            brandCode: data.brandCode,
            otherName01: currentItem.otherName01,
            otherName02: currentItem.otherName02,
            costPrice: currentItem.costPrice,
            sellPrice: currentItem.sellPrice,
            sellPricePre: currentItem.sellPricePre,
            distPrice01: currentItem.distPrice01,
            distPrice02: currentItem.distPrice02,
            trackQty: currentItem.trackQty,
            alertQty: currentItem.alertQty,
            productImage: currentItem.productImage,
            dummyCode: currentItem.dummyCode,
            dummyName: currentItem.dummyName,
            location01: currentItem.location01,
            location02: currentItem.location02,
            exception01: currentItem.exception01,
          },
        },
      })
    },
  }

  const browseProps = {
    dataSource: listStock,
    loading: loading.effects['stock/query'],
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
        type: 'stock/modalShow',
        payload: {
          modalType: 'add',
        },
      })
    },
    onEditItem (item) {
      console.log('onEditItem item, ',item);
      dispatch({
        type: 'stock/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onDeleteItem (id) {
      console.log('onDeleteItem:', id);
      dispatch({
        type: 'stock/delete',
        payload: {
          id : id
        }
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'stock/deleteBatch',
        payload: {
          categoryCode: selectedRowKeys,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'stock/searchShow' }) },
    size:'small',
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    {rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'stock/updateState',
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
          pathname: '/master/product/stock',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/master/product/stock',
        }))
    },
    onSearchHide () { dispatch({ type: 'stock/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Stock.propTypes = {
  stock: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  productCategory: PropTypes.object,
  productBrand: PropTypes.object,
}

export default connect(({ productBrand, productCategory, stock, loading }) => ({ productBrand, productCategory, stock, loading }))(Stock)
