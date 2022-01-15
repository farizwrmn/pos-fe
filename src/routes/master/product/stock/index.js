import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Row, Col, Icon, Menu, Dropdown, Modal } from 'antd'
import AdvancedForm from './AdvancedForm'
import List from './List'
import Filter from './Filter'
// import Sticker from './Sticker'
// import Shelf from './Shelf'
import PrintPDFSpecification from './PrintPDFSpecification'
import PrintXLSSpecification from './PrintXLSSpecification'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'
import ModalQuantity from './ModalQuantity'

const TabPane = Tabs.TabPane

const ProductStock = ({ shopeeCategory, specification, grabCategory, purchase, store, specificationStock, variant, variantStock, productstock, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list: listShopeeCategory } = shopeeCategory
  const {
    modalSupplierVisible,
    paginationSupplier,
    listSupplier,
    searchTextSupplier,
    tmpSupplierData,
    supplierInformation
  } = purchase
  const { list: listGrabCategory } = grabCategory
  const { listVariantStock } = variantStock
  const { listStoreLov } = store
  const {
    list,
    changed,
    listPrintAllStock,
    showPDFModal,
    mode,
    display,
    isChecked,
    modalType,
    currentItem,
    activeKey,
    disable,
    show,
    pagination,
    stockLoading,
    advancedForm,
    modalVariantVisible,
    modalSpecificationVisible,
    modalProductVisible,
    countStoreList,
    modalQuantityVisible,
    inventoryMode,
    lastTrans,
    listInventory
  } = productstock
  const { listSpecification } = specification
  const { listSpecificationCode } = specificationStock
  const { listVariant } = variant
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    inventoryMode,
    filter: {
      ...location.query
    },
    handleInventory () {
      const { query, pathname } = location
      const { q, ...other } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...other,
          mode: 'inventory',
          page: 1
        }
      }))
    },
    onFilterChange (value) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          searchText: value.q
        }
      })
      const { query, pathname } = location
      const { mode, ...other } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...other,
          ...value,
          page: 1
        }
      }))
    },
    switchIsChecked () {
      dispatch({
        type: 'productstock/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      const { query, pathname } = location
      const { q, createdAt, page, order, mode, ...other } = query

      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          ...other
        }
      }))
      dispatch({
        type: 'productstock/updateState',
        payload: {
          searchText: null
        }
      })
    }
  }

  const modalQuantityProps = {
    count: countStoreList,
    listStoreLov,
    title: 'Other Store Qty',
    loading: loading.effects['productstock/showProductStoreQty'],
    visible: modalQuantityVisible,
    footer: null,
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          countStoreList: [],
          modalQuantityVisible: false
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    pagination,
    dispatch,
    storeInfo,
    listCategory,
    listBrand,
    loadingModel: loading,
    loading: loading.effects['productstock/query'] || loading.effects['productstock/queryInventory'],
    location,
    onChange (page, filters) {
      const { brandId, categoryId } = filters
      const { query, pathname } = location
      if (inventoryMode === 'inventory') {
        return
      }
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
          brandId,
          categoryId
        }
      }))
    },
    editItem (item) {
      dispatch({
        type: 'specificationStock/query',
        payload: {
          productId: item.id,
          categoryId: item.categoryId
        }
      })

      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })

      dispatch({
        type: 'purchase/updateState',
        payload: {
          supplierInformation: {}
        }
      })
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'productstock/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: '',
        listSticker: [],
        listItem: []
      }
    })
    const { query, pathname } = location
    switch (key) {
      case 1:
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            activeKey: key
          }
        }))
        break
      default:
        dispatch(routerRedux.push({
          pathname,
          query: {
            activeKey: key
          }
        }))
    }
  }

  const clickBrowse = () => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        show: !show
      }
    })
  }

  const formProps = {
    listShopeeCategory,
    listInventory,
    listGrabCategory,
    lastTrans,
    listSpecification,
    listSpecificationCode,
    listVariantStock,
    listCategory,
    listBrand,
    listVariant,
    supplierInformation,
    modalType,
    mode,
    item: {
      ...currentItem,
      supplierId: supplierInformation && supplierInformation.id ? supplierInformation.id : currentItem.supplierId,
      supplierCode: supplierInformation && supplierInformation.supplierCode ? supplierInformation.supplierCode : currentItem.supplierCode,
      supplierName: supplierInformation && supplierInformation.supplierName ? supplierInformation.supplierName : currentItem.supplierName
    },
    modalSupplierVisible,
    paginationSupplier,
    listSupplier,
    searchTextSupplier,
    tmpSupplierData,
    loadingButton: loading,
    modalVariantVisible,
    modalSpecificationVisible,
    modalProductVisible,
    dispatch,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Save' : 'Update'}`,
    onSubmit (id, data, reset) {
      dispatch({
        type: `productstock/${modalType}`,
        payload: {
          id,
          data,
          location,
          reset
        }
      })
    },
    onGetSupplier () {
      dispatch({ type: 'purchase/querySupplier' })
    },
    onChooseSupplier (data) {
      dispatch({
        type: 'purchase/onChooseSupplier',
        payload: data
      })
    },
    onSearchSupplierData (data) {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          searchTextSupplier: data.q
        }
      })
      dispatch({
        type: 'purchase/querySupplier',
        payload: {
          ...data
        }
      })
    },
    onChangeDate (e) {
      dispatch({
        type: 'purchase/chooseDate',
        payload: e
      })
    },
    onSearchSupplier (data) {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          searchTextSupplier: data
        }
      })
      dispatch({
        type: 'purchase/querySupplier',
        payload: {
          q: data
        }
      })
    },
    showVariant () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalVariantVisible: true
        }
      })
    },
    editItemProductById (item) {
      dispatch({
        type: 'productstock/queryItemById',
        payload: {
          id: item.productCode
        }
      })
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalType: 'edit',
          modalVariantVisible: false,
          activeKey: '0',
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },
    showVariantId () {
      dispatch({
        type: 'variant/query',
        payload: {
          type: 'all',
          field: 'id,name'
        }
      })
    },
    showSpecification () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalSpecificationVisible: true
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
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'productbrand/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    showBrands () {
      dispatch({
        type: 'productbrand/query'
      })
    },
    showCategories () {
      dispatch({
        type: 'productcategory/query'
      })
    }
  }

  const getAllStock = () => {
    if (mode === 'pdf') {
      dispatch({
        type: 'productstock/checkLengthOfData',
        payload: {
          page: 51,
          pageSize: 10
        }
      })
    } else {
      dispatch({
        type: 'productstock/queryAllStock',
        payload: {
          type: 'all'
        }
      })
    }
  }

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        showPDFModal: true,
        mode
      }
    })
  }

  const PDFModalProps = {
    visible: showPDFModal,
    footer: null,
    width: '600px',
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAllStock: []
        }
      })
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )
  // const onChangeSwitch = (checked) => {
  //   console.log(`switch to ${checked}`)
  //   dispatch({
  //     type: 'productstock/updateState',
  //     payload: {
  //       advancedForm: checked
  //     }
  //   })
  // }

  const printProps = {
    user,
    storeInfo
  }

  let buttonClickPDF = (changed && listPrintAllStock.length) ? (<PrintPDF data={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)
  let buttonClickXLS = (changed && listPrintAllStock.length) ? (<PrintXLS data={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)

  let buttonClickPDFSpecification = (changed && listPrintAllStock.length) ? (<PrintPDFSpecification data={listPrintAllStock} name="Print Specification" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Specification</Button>)
  let buttonClickXLSSpecification = (changed && listPrintAllStock.length) ? (<PrintXLSSpecification data={listPrintAllStock} name="Print Specification" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Specification</Button>)
  let notification = (changed && listPrintAllStock.length) ? "Click 'Print All Stock' to print!" : "Click 'Get All Stock' to get all data!"
  let printmode
  if (mode === 'pdf') {
    printmode = (<Row>
      <Col md={8}>
        {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
      </Col>
      <Col md={8}>
        <PrintPDF data={list} name="Print Current Page" {...printProps} />
      </Col>
      <Col md={8}>
        {buttonClickPDFSpecification}
      </Col>
    </Row>)
  } else {
    printmode = (<Row>
      <Col md={8}>
        {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
      </Col>
      <Col md={8}>
        <PrintXLS data={list} name="Print Current Page" {...printProps} />
      </Col>
      <Col md={8}>
        {buttonClickXLSSpecification}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
      </Col>
    </Row>)
  }

  let moreButtonTab
  switch (activeKey) {
    case '0':
      moreButtonTab = (
        <div>
          {/* <Switch defaultChecked={advancedForm} checkedChildren="New" unCheckedChildren="Old" onChange={onChangeSwitch}>Advanced</Switch> */}
          <Button onClick={() => clickBrowse()}>Browse</Button>
        </div>
      )
      break
    case '1':
      moreButtonTab = (
        <div>
          <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button>
          <Dropdown overlay={menu}>
            <Button style={{ marginLeft: 8 }} icon="printer">
              Print
            </Button>
          </Dropdown>
        </div>
      )
      break
    default:
      break
  }

  return (
    <div className={(activeKey === '0' && !advancedForm) || activeKey === '1' ? 'content-inner' : 'content-inner-no-color'} >
      {modalQuantityVisible && <ModalQuantity {...modalQuantityProps} />}
      {showPDFModal && <Modal {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <AdvancedForm {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div >
  )
}

ProductStock.propTypes = {
  grabCategory: PropTypes.object,
  purchase: PropTypes.object,
  specification: PropTypes.object,
  specificationStock: PropTypes.object,
  productstock: PropTypes.object,
  variantStock: PropTypes.object,
  productcategory: PropTypes.object,
  productbrand: PropTypes.object,
  variant: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchase, shopeeCategory, grabCategory, specification, store, specificationStock, productstock, variantStock, productcategory, productbrand, variant, loading, app }) =>
  ({ purchase, shopeeCategory, grabCategory, specification, store, specificationStock, productstock, variantStock, productcategory, productbrand, variant, loading, app }))(ProductStock)
