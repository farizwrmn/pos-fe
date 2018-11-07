import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Row, Col, Icon, Menu, Dropdown, Modal } from 'antd'
import Form from './Form'
import AdvancedForm from './AdvancedForm'
import List from './List'
import Filter from './Filter'
// import Sticker from './Sticker'
// import Shelf from './Shelf'
import PrintPDF from './PrintPDF'
import PrintShelf from './PrintShelf'
import PrintSticker from './PrintSticker'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const ProductStock = ({ specification, specificationStock, variant, variantStock, productstock, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { listVariantStock } = variantStock
  const { list,
    // listItem, update,
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
    // showModalProduct, modalProductType, period,
    listSticker,
    // selectedSticker,
    pagination,
    stockLoading,
    advancedForm,
    modalVariantVisible,
    modalSpecificationVisible,
    modalProductVisible
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
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          searchText: value.q
        }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
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
      const { q, createdAt, page, ...other } = query

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

  const listProps = {
    dataSource: list,
    user,
    pagination,
    storeInfo,
    loading: loading.effects['productstock/query'],
    location,
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
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
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
    listSpecification,
    listSpecificationCode,
    listVariantStock,
    listCategory,
    listBrand,
    listVariant,
    modalType,
    mode,
    item: currentItem,
    loadingButton: loading,
    modalVariantVisible,
    modalSpecificationVisible,
    modalProductVisible,
    dispatch,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `productstock/${modalType}`,
        payload: {
          id,
          data
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
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
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
  let notification = (changed && listPrintAllStock.length) ? "Click 'Print All Stock' to print!" : "Click 'Get All Stock' to get all data!"
  let printmode
  if (mode === 'pdf') {
    printmode = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    printmode = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={list} name="Print Current Page" {...printProps} /></Col></Row>)
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
    case '2':
      moreButtonTab = (<PrintSticker stickers={listSticker} {...printProps} />)
      break
    case '3':
      moreButtonTab = (<PrintShelf stickers={listSticker} {...printProps} />)
      break
    default:
      break
  }

  // const stickerProps = {
  //   showModalProduct,
  //   listItem,
  //   update,
  //   period,
  //   listSticker,
  //   modalProductType,
  //   selectedSticker,
  //   onShowModalProduct (key) {
  //     dispatch({
  //       type: 'productstock/updateState',
  //       payload: {
  //         showModalProduct: true,
  //         modalProductType: key,
  //         selectedSticker: {}
  //       }
  //     })
  //   },
  //   onSelectSticker (sticker) {
  //     dispatch({
  //       type: 'productstock/updateState',
  //       payload: {
  //         update: true,
  //         selectedSticker: sticker
  //       }
  //     })
  //   },
  //   onCloseModalProduct () {
  //     dispatch({
  //       type: 'productstock/updateState',
  //       payload: {
  //         update: false,
  //         showModalProduct: false,
  //         modalProductType: '',
  //         listItem: [],
  //         period: []
  //       }
  //     })
  //   },
  //   onAutoSearch (value) {
  //     if (value.length < 1) {
  //       dispatch({
  //         type: 'productstock/updateState',
  //         payload: {
  //           listItem: []
  //         }
  //       })
  //     } else if (value.length > 0) {
  //       dispatch({
  //         type: 'productstock/queryItem',
  //         payload: {
  //           q: value
  //         }
  //       })
  //     }
  //   },
  //   addSticker (sticker) {
  //     dispatch({
  //       type: 'productstock/addSticker',
  //       payload: {
  //         sticker
  //       }
  //     })
  //   },
  //   deleteSticker (sticker) {
  //     dispatch({
  //       type: 'productstock/deleteSticker',
  //       payload: {
  //         sticker
  //       }
  //     })
  //   },
  //   updateSticker (selectedRecord, changedRecord) {
  //     dispatch({
  //       type: 'productstock/updateSticker',
  //       payload: {
  //         selectedRecord, changedRecord
  //       }
  //     })
  //   },
  //   onSearchUpdateSticker (value) {
  //     if (value.updatedAt.length !== 0) {
  //       dispatch({
  //         type: 'productstock/queryItem',
  //         payload: {
  //           ...value
  //         }
  //       })
  //     } else {
  //       dispatch({
  //         type: 'productstock/updateState',
  //         payload: {
  //           listItem: []
  //         }
  //       })
  //     }
  //     dispatch({
  //       type: 'productstock/updateState',
  //       payload: {
  //         period: value.updatedAt
  //       }
  //     })
  //   }
  // }

  return (
    <div className={(activeKey === '0' && !advancedForm) || activeKey === '1' ? 'content-inner' : 'content-inner-no-color'} >
      {showPDFModal && <Modal footer={[]} {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {advancedForm ? <AdvancedForm {...formProps} /> : <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
        {/* <TabPane tab="Sticker" key="2" >
          <Sticker {...stickerProps} />
        </TabPane>
        <TabPane tab="Shelf" key="3" >
          <Shelf {...stickerProps} />
        </TabPane> */}
      </Tabs>
    </div >
  )
}

ProductStock.propTypes = {
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

export default connect(({ specification, specificationStock, productstock, variantStock, productcategory, productbrand, variant, loading, app }) => ({ specification, specificationStock, productstock, variantStock, productcategory, productbrand, variant, loading, app }))(ProductStock)
