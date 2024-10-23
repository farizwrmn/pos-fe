import React from 'react'
import PropTypes from 'prop-types'
import {
  Tabs, Modal,
  Row, Col
} from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import AdjustForm from './AdjustForm'
// import History from './History'
import AdjustList from './AdjustList'
import AdjustFormEdit from './AdjustFormEdit'
import Filter from './Filter'
import List from './List'

const TabPane = Tabs.TabPane

const Adjust = ({ adjustNew, app, location, pos, dispatch, accountRule, adjust, productstock, loading }) => {
  const { user, storeInfo } = app
  const {
    activeKey, lastTrans, templistType, pagination, currentItem, searchText, disabledItemOut, disabledItemIn, item, itemEmployee, modalEditVisible, popoverVisible, dataBrowse, listProduct, listType, listEmployee,
    modalVisible, modalType
  } = adjust
  const { list, pagination: paginationNew } = adjustNew
  const { listAccountCode } = accountRule
  const {
    tmpProductList
  } = pos
  const {
    modalProductVisible
  } = productstock
  const modalProps = {
    loading: loading.effects['adjust/query'],
    visible: modalVisible,
    maskClosable: false,
    title: 'Approve Adjustment',
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
    templistType,
    disabledItemIn,
    disabledItemOut,
    onOk (data) {
      data.qty = data.OutQty
      // checkQuantityBeforeEdit
      dispatch({
        type: 'adjust/adjustEdit',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'adjust/modalEditHide'
      })
    },
    onHidePopover () {
      dispatch({
        type: 'adjust/hidePopover'
      })
    },
    changeDisabledItem (e) {
      dispatch({
        type: 'adjust/onChangeDisabledItem',
        payload: e
      })
    },
    onDeleteItem (data) {
      dispatch({
        type: 'adjust/adjustDelete',
        payload: data
      })
    }
  }
  const browseProps = {
    onChange (e) {
      dispatch({
        type: 'adjust/getProducts',
        payload: {
          page: e.current,
          pageSize: e.pageSize,
          q: searchText
        }
      })
    }
  }

  const adjustProps = {
    ...browseProps,
    listAccountCode,
    item: currentItem,
    dispatch,
    lastTrans,
    pagination,
    location,
    loading: loading.effects['adjust/add'],
    loadingButton: loading,
    listType,
    templistType,
    itemEmployee,
    popoverVisible,
    listEmployee,
    tmpProductList,
    dataSource: listProduct,
    dataBrowse,
    modalProductVisible,
    visible: modalProductVisible,
    maskClosable: false,
    onOk (data, reset) {
      dispatch({
        type: 'adjust/add',
        payload: {
          data,
          reset
        }
      })
    },
    onEdit (data, reset) {
      dispatch({
        type: 'adjust/edit',
        payload: {
          data,
          reset
        }
      })
    },
    showProductModal () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalProductVisible: true
        }
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
    onSearchProduct () {
      // dispatch({
      //   type: 'adjust/onProductSearch',
      //   payload: {
      //     searchText,
      //     tmpProductData: e
      //   }
      // })
      dispatch({
        type: 'adjust/getProducts',
        payload: {
          q: searchText,
          page: 1,
          pageSize: pagination.pageSize
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
        const product = {
          no: arrayProd.length + 1,
          code: e.productCode,
          name: e.productName,
          productId: e.id,
          productName: e.productName,
          In: 0,
          Out: 0,
          price: e.costPrice
        }
        arrayProd.push(product)
        localStorage.setItem('adjust', JSON.stringify(arrayProd))
        dispatch({
          type: 'productstock/updateState',
          payload: {
            modalProductVisible: false
          }
        })
        const data = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
        dispatch({ type: 'adjust/setDataBrowse', payload: data })
        console.log('e', e)
        dispatch({
          type: 'adjust/modalEditShow',
          payload: {
            data: {
              In: 0,
              Out: 0,
              code: e.productCode,
              name: e.productName,
              no: product.no,
              price: product.price,
              productId: product.productId,
              productName: product.productName
            }
          }
        })
      } else {
        Modal.warning({
          title: 'Cannot add product',
          content: 'Already Exists in list'
        })
      }
    }
  }

  const onEditItem = (e) => {
    const value = e.transType
    const variable = templistType.filter(x => x.code === value)
    const { miscVariable } = variable[0]
    let disabledItem = {}
    let adjust = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
    if (miscVariable === 'IN') {
      disabledItem.disabledItemOut = true
      disabledItem.disabledItemIn = false
      if (Object.keys(adjust).length > 0) {
        for (let n = 0; n < adjust.length; n += 1) {
          adjust[n].Out = 0
        }
        localStorage.setItem('adjust', JSON.stringify(adjust))
      }
    } else if (miscVariable === 'OUT') {
      disabledItem.disabledItemOut = false
      disabledItem.disabledItemIn = true
      if (Object.keys(adjust).length > 0) {
        for (let n = 0; n < adjust.length; n += 1) {
          adjust[n].In = 0
        }
        localStorage.setItem('adjust', JSON.stringify(adjust))
      }
    }
    dispatch({
      type: 'adjust/onChangeDisabledItem',
      payload: disabledItem
    })
    dispatch({
      type: 'adjust/modalShow',
      payload: {
        modalType: 'edit',
        currentItem: e
      }
    })
  }

  // const historyProps = {
  //   dataSource: listAdjust,
  //   onGetAdjust () {
  //     dispatch({
  //       type: 'adjust/queryAdjust'
  //     })
  //   },
  //   onEditItem (e) {
  //     onEditItem(e)
  //   }
  // }

  const changeTab = (activeKey) => {
    localStorage.removeItem('adjust')
    dispatch(routerRedux.push({
      pathname: location.pathname,
      query: {
        activeKey
      }
    }))
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'adjustNew/query',
        payload: {
          ...value,
          storeId: lstorage.getCurrentUserStore()
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination: paginationNew,
    loading: loading.effects['adjustNew/query'],
    location,
    onEditItem (e) {
      onEditItem(e)
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem () {
      // const { pathname } = location
      // dispatch(routerRedux.push({
      //   pathname,
      //   query: {
      //     activeKey: 0
      //   }
      // }))
      // dispatch({
      //   type: 'adjustNew/editItem',
      //   payload: { item }
      // })
    },
    deleteItem () {
      // dispatch({
      //   type: 'adjustNew/delete',
      //   payload: id
      // })
    }
  }

  return (
    <div className="content-inner">
      <Tabs defaultActiveKey={activeKey} onChange={activeKey => changeTab(activeKey)}>
        <TabPane tab="Waste Input" key="0">
          {activeKey === '0' && <AdjustForm {...adjustProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
              <Row>
                <Col xs={8} sm={8} md={18} lg={18} xl={18}>
                  <Modal footer={null} width="800px" {...modalProps} className="content-inner" style={{ float: 'center', display: 'flow-root' }}>
                    <AdjustFormEdit {...adjustProps} />
                  </Modal>
                </Col>
              </Row>
            </div>
          }
        </TabPane>
        {/* <TabPane tab="Archive" key="2">
          {activeKey === '2' && (
            <div>
              <History {...historyProps} />
              <Row>
                <Col xs={8} sm={8} md={18} lg={18} xl={18}>
                  <Modal footer={null} width="800px" {...modalProps} className="content-inner" style={{ float: 'center', display: 'flow-root' }}>
                    <AdjustFormEdit {...adjustProps} />
                  </Modal>
                </Col>
              </Row>
            </div>
          )}
        </TabPane> */}
      </Tabs>
      {modalEditVisible && <AdjustList {...editProps} />}
    </div>
  )
}

Adjust.propTypes = {
  app: PropTypes.object.isRequired,
  adjustNew: PropTypes.object.isRequired,
  adjust: PropTypes.object.isRequired,
  accountRule: PropTypes.object.isRequired,
  productstock: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ pos, app, adjustNew, adjust, productstock, accountRule, loading }) => ({ pos, app, adjustNew, adjust, productstock, accountRule, loading }))(Adjust)
