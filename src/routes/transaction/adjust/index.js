import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import AdjustForm from './AdjustForm'
import History from './History'
import { Tabs, Modal, Row, Col } from 'antd'
import AdjustList from './AdjustList'
import AdjustFormEdit from './AdjustFormEdit'

const TabPane = Tabs.TabPane

const Adjust = ({ location, dispatch, adjust, loading }) => {
  const {
    lastTrans, tmpProductList, currentItem, searchText, disableItem, listAdjust, item, itemEmployee, modalEditVisible, popoverVisible, dataBrowse, listProduct, listType, listEmployee, modalVisible, modalProductVisible, modalType, curQty
  } = adjust
  const modalProps = {
    loading: loading.effects['adjust/query'],
    visible: modalVisible,
    maskClosable: false,
    title: 'Add Adjustment',
    confirmLoading: loading.effects['adjust/edit'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `adjust/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'adjust/modalHide',
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
  }

  const editProps = {
    visible: modalEditVisible,
    item,
    onOk(data) {
      dispatch({
        type: 'adjust/adjustEdit',
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'adjust/modalEditHide',
      })
    },
    onChooseitem(data) {
      console.log('data',data)
    },
  }
  const adjustProps = {
    item: currentItem,
    lastTrans,
    disableItem: disableItem,
    location: location,
    loading: loading.effects['adjust/create'],
    listType,
    itemEmployee,
    popoverVisible,
    listEmployee,
    tmpProductList,
    dataSource: listProduct,
    dataBrowse: dataBrowse,
    visible: modalProductVisible,
    maskClosable: false,
    onOk(data) {
      dispatch({
        type: 'adjust/add',
        payload: data,
      })
    },
    onResetAll () {
      dispatch({
        type: 'adjust/resetAll',
      })
    },
    handleBrowseProduct () {
      dispatch({
        type: 'adjust/getProducts',
      })

      dispatch({
        type: 'adjust/showProductModal',
        payload: {
          modalType: 'browseProduct',
        },
      })
    },
    onSearchProduct (data, e) {
      console.log('searchtext', searchText)
      dispatch({
        type: 'adjust/onProductSearch',
        payload: {
          searchText: searchText,
          tmpProductData: e,
        },
      })
    },
    onGetProduct () {
      dispatch({ type: 'adjust/query' })
    },
    onGetEmployee (data) {
      dispatch({ type: 'adjust/queryEmployee', payload: data })
    },
    onChooseProduct () {
      dispatch({ type: 'adjust/queryProductSuccess' })
    },
    onChangeSearch (e) {
      dispatch({
        type: 'adjust/onInputChange',
        payload: {
          searchText: e,
        },
      })
    },
    onHidePopover() {
      dispatch({
        type: 'adjust/hidePopover',
      })
    },
    modalShow (data) {
      dispatch({
        type: 'adjust/modalEditShow',
        payload: {
          data: data,
        },
      })
    },
    onChooseItem (item) {
      const listByCode = (localStorage.getItem('adjust') ? localStorage.getItem('adjust') : [] )
      let arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        'no': arrayProd.length + 1,
        'code': item.productCode,
        'productId': item.id,
        'name': item.productName,
        'In': 0,
        'Out': 0,
        'price': item.sellPrice,
      })
      localStorage.setItem('adjust', JSON.stringify(arrayProd))
      const data = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : null
      dispatch({ type: 'adjust/setDataBrowse', payload: data })
    },
  }

  const historyProps = {
    dataSource: listAdjust,
    onGetAdjust () {
      dispatch({
        type: 'adjust/queryAdjust',
      })
    },
    onEditItem (e) {
      dispatch({
        type: 'adjust/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: e,
        },
      })
    },
  }

  const modalProductProps = {
    location: location,
    loading: loading,
    adjust: adjust,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () { dispatch({ type: 'adjust/hideProductModal' }) },
    onChooseItem (item) {
      const listByCode = (localStorage.getItem('product_detail') ? localStorage.getItem('product_detail') : [] )
      let arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        'no': arrayProd.length + 1,
        'code': item.productCode,
        'name': item.productName,
        'qty': curQty,
        'price': item.costPrice,
        'total': curQty * item.sellPrice
      })
      console.log('arrayProd', arrayProd)
      localStorage.setItem('product_detail', JSON.stringify(arrayProd))
      dispatch({ type: 'adjust/querySuccessByCode', payload: { listByCode: item } })
      dispatch({ type: 'adjust/hideProductModal' })
    },
  }

  return (
    <div className="content-inner">
      <Tabs>
        <TabPane tab="Adjustment" key="1">
          <AdjustForm {...adjustProps} />
          <AdjustList {...editProps} />
        </TabPane>
        <TabPane tab="Archive" key="2">
          <History {...historyProps} />
          <Row>
            <Col xs={8} sm={8} md={18} lg={18} xl={18}>
              <Modal footer={null} {...modalProps} className="content-inner" style={{ float: 'center', display: 'flow-root' }}>
                <AdjustFormEdit {...adjustProps} />
              </Modal>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

Adjust.propTypes = {
  adjust: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ adjust, loading }) => ({ adjust, loading }))(Adjust)
