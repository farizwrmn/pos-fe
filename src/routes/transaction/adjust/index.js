import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Modal, Row, Col } from 'antd'
import { connect } from 'dva'
import AdjustForm from './AdjustForm'
import History from './History'
import AdjustList from './AdjustList'
import AdjustFormEdit from './AdjustFormEdit'

const TabPane = Tabs.TabPane

const Adjust = ({ location, dispatch, adjust, loading }) => {
  const {
    lastTrans, templistType, tmpProductList, currentItem, searchText, disabledItemOut, disabledItemIn, listAdjust, item, itemEmployee, modalEditVisible, popoverVisible, dataBrowse, listProduct, listType, listEmployee, modalVisible, modalProductVisible, modalType
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
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'adjust/modalHide'
      })
    },
    onDeleteUnit (id) {
      dispatch({
        type: 'units/delete',
        payload: {
          id
        }
      })
    }
  }

  const editProps = {
    visible: modalEditVisible,
    item,
    disabledItemIn,
    disabledItemOut,
    onOk (data) {
      dispatch({
        type: 'adjust/adjustEdit',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'adjust/modalEditHide'
      })
    }
  }
  const adjustProps = {
    item: currentItem,
    lastTrans,
    location,
    loading: loading.effects['adjust/add'],
    listType,
    templistType,
    itemEmployee,
    popoverVisible,
    listEmployee,
    tmpProductList,
    dataSource: listProduct,
    dataBrowse,
    visible: modalProductVisible,
    maskClosable: false,
    onOk (data) {
      dispatch({
        type: 'adjust/add',
        payload: data
      })
    },
    onResetAll () {
      dispatch({
        type: 'adjust/resetAll'
      })
    },
    handleBrowseProduct () {
      dispatch({
        type: 'adjust/getProducts'
      })

      dispatch({
        type: 'adjust/showProductModal',
        payload: {
          modalType: 'browseProduct'
        }
      })
    },
    loadData () {
      dispatch({
        type: 'adjust/modalEditHide'
      })
    },
    changeDisabledItem (e) {
      dispatch({
        type: 'adjust/onChangeDisabledItem',
        payload: e
      })
    },
    onSearchProduct (data, e) {
      console.log('searchtext', searchText)
      dispatch({
        type: 'adjust/onProductSearch',
        payload: {
          searchText,
          tmpProductData: e
        }
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
          searchText: e
        }
      })
    },
    onHidePopover () {
      dispatch({
        type: 'adjust/hidePopover'
      })
    },
    modalShow (data) {
      dispatch({
        type: 'adjust/modalEditShow',
        payload: {
          data
        }
      })
    },
    onChooseItem (e) {
      const listByCode = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      const checkExists = listByCode.filter(el => el.code === e.productCode)
      if (checkExists.length === 0) {
        let arrayProd = listByCode
        arrayProd.push({
          no: arrayProd.length + 1,
          code: e.productCode,
          name: e.productName,
          productId: e.id,
          productName: e.productName,
          In: 0,
          Out: 0,
          price: e.sellPrice
        })
        localStorage.setItem('adjust', JSON.stringify(arrayProd))
        const data = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : null
        dispatch({ type: 'adjust/setDataBrowse', payload: data })
      } else {
        Modal.warning({
          title: 'Cannot add product',
          content: 'Already Exists in list'
        })
      }
    }
  }

  const historyProps = {
    dataSource: listAdjust,
    onGetAdjust () {
      dispatch({
        type: 'adjust/queryAdjust'
      })
    },
    onEditItem (e) {
      dispatch({
        type: 'adjust/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: e
        }
      })
    }
  }

  // const modalProductProps = {
  //   location: location,
  //   loading: loading,
  //   adjust: adjust,
  //   visible: modalProductVisible,
  //   maskClosable: false,
  //   wrapClassName: 'vertical-center-modal',
  //   onCancel () { dispatch({ type: 'adjust/hideProductModal' }) },
  //   onChooseItem (e) {
  //     const listByCode = (localStorage.getItem('product_detail') ? localStorage.getItem('product_detail') : [] )
  //     let arrayProd
  //     if (listByCode.length === 0) {
  //       arrayProd = listByCode.slice()
  //     }
  //     arrayProd.push({
  //       no: arrayProd.length + 1,
  //       code: e.productCode,
  //       name: e.productName,
  //       qty: curQty,
  //       price: e.costPrice,
  //       total: curQty * e.sellPrice
  //     })
  //     localStorage.setItem('product_detail', JSON.stringify(arrayProd))
  //     dispatch({ type: 'adjust/querySuccessByCode', payload: { listByCode: item } })
  //     dispatch({ type: 'adjust/hideProductModal' })
  //   },
  // }

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
  loading: PropTypes.object
}


export default connect(({ adjust, loading }) => ({ adjust, loading }))(Adjust)
