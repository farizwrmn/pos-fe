import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Button, Icon, Menu, Dropdown } from 'antd'
import AdvancedForm from './AdvancedForm'
import List from './List'
// import Filter from './Filter'
// Row, Col, Modal
// import PrintPDFSpecification from './PrintPDFSpecification'
// import PrintXLSSpecification from './PrintXLSSpecification'
// import PrintPDF from './PrintPDF'
// import PrintXLS from './PrintXLS'
// import ModalQuantity from './ModalQuantity'

const TabPane = Tabs.TabPane

const Planogram = ({ planogram, userStore, loading, dispatch, location, app }) => {
  const { listAllStores } = userStore
  const {
    list: listPlanogram,
    activeKey,
    currentItem,
    modalType,
    // checked,
    // show,
    // modalVisible,
    pagination
  } = planogram
  const { user, storeInfo } = app
  // const filterProps = {
  //   handleInventory () {
  //     const { query, pathname } = location
  //     const { q, ...other } = query
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         ...other,
  //         mode: 'inventory',
  //         page: 1
  //       }
  //     }))
  //   },
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'planogram/updateState',
  //       payload: {
  //         searchText: value.q
  //       }
  //     })
  //     const { query, pathname } = location
  //     const { mode, ...other } = query
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         ...other,
  //         ...value,
  //         page: 1
  //       }
  //     }))
  //   },
  //   switchIsChecked () {
  //     dispatch({
  //       type: 'planogram/switchIsChecked',
  //       payload: `${checked ? 'none' : 'block'}`
  //     })
  //   },
  //   onResetClick () {
  //     const { query, pathname } = location
  //     const { q, createdAt, page, order, mode, ...other } = query

  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         page: 1,
  //         ...other
  //       }
  //     }))
  //     dispatch({
  //       type: 'planogram/updateState',
  //       payload: {
  //         searchText: null
  //       }
  //     })
  //   }
  // }


  const listProps = {
    dataSource: listPlanogram,
    listAllStores,
    user,
    pagination,
    dispatch,
    storeInfo,
    loadingModel: loading,
    loading: loading.effects['planogram/query'] || loading.effects['planogram/edit'] || loading.effects['planogram/editItem'],
    location,
    onChange (page, filters) {
      const { brandId, categoryId } = filters
      const { query, pathname } = location
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
        type: 'planogram/editItem',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
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
    delete (id) {
      dispatch({
        type: 'planogram/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'planogram/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    })
    dispatch({
      activeKey: key,
      type: 'planogram/query'
    })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'planogram/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  // const onShowHideSearch = () => {
  //   dispatch({
  //     type: 'planogram/updateState',
  //     payload: {
  //       show: !show
  //     }
  //   })
  // }

  const advanceFormProps = {
    listPlanogram,
    listAllStores,
    modalType,
    loadingButton: loading,
    currentItem,
    dispatch,
    disabled: modalType === 'edit' && currentItem.isStaging != null ? !currentItem.isStaging : '',
    button: `${modalType === 'add' ? 'Save' : 'Update'}`,
    modalSwitchChange (checked) {
      if (checked) {
        dispatch({
          type: 'planogram/updateState',
          payload: { checked: true }
        })
      } else {
        dispatch({
          type: 'planogram/updateState',
          payload: { checked: false }
        })
      }
    },
    onClickPlanogram () {
      dispatch({
        type: 'planogram/updateState',
        payload: {
          activeKey: '2'
        }
      })
    },
    onSubmit (id, data, reset) {
      dispatch({
        type: `planogram/${modalType}`,
        payload: {
          id,
          location,
          reset,
          ...data
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
        type: 'planogram/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  // const getAllStock = () => {
  //   if (mode === 'pdf') {
  //     dispatch({
  //       type: 'planogram/checkLengthOfData',
  //       payload: {
  //         page: 51,
  //         pageSize: 10
  //       }
  //     })
  //   } else {
  //     dispatch({
  //       type: 'planogram/queryAllStock',
  //       payload: {
  //         type: 'all'
  //       }
  //     })
  //   }
  // }

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'planogram/updateState',
      payload: {
        showPDFModal: true,
        mode
      }
    })
  }

  // const PDFModalProps = {
  //   visible: showPDFModal,
  //   footer: null,
  //   width: '600px',
  //   title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
  //   onCancel () {
  //     dispatch({
  //       type: 'planogram/updateState',
  //       payload: {
  //         showPDFModal: false,
  //         changed: false,
  //         listPrintAllStock: []
  //       }
  //     })
  //   }
  // }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )
  // const onChangeSwitch = (checked) => {
  //   console.log(`switch to ${checked}`)
  //   dispatch({
  //     type: 'planogram/updateState',
  //     payload: {
  //       advancedForm: checked
  //     }
  //   })
  // }

  // const printProps = {
  //   user,
  //   storeInfo
  // }

  // let buttonClickPDF = (changed && listPrintAllStock.length) ? (<PrintPDF data={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)
  // let buttonClickXLS = (changed && listPrintAllStock.length) ? (<PrintXLS data={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)

  // let buttonClickPDFSpecification = (changed && listPrintAllStock.length) ? (<PrintPDFSpecification data={listPrintAllStock} name="Print Specification" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Specification</Button>)
  // let buttonClickXLSSpecification = (changed && listPrintAllStock.length) ? (<PrintXLSSpecification data={listPrintAllStock} name="Print Specification" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Specification</Button>)
  // let notification = (changed && listPrintAllStock.length) ? "Click 'Print All Stock' to print!" : "Click 'Get All Stock' to get all data!"
  // let printmode
  // if (mode === 'pdf') {
  //   printmode = (<Row>
  //     <Col md={8}>
  //       {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
  //     </Col>
  //     <Col md={8}>
  //       <PrintPDF data={list} name="Print Current Page" {...printProps} />
  //     </Col>
  //     <Col md={8}>
  //       {buttonClickPDFSpecification}
  //     </Col>
  //   </Row>)
  // } else {
  //   printmode = (<Row>
  //     <Col md={8}>
  //       {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
  //     </Col>
  //     <Col md={8}>
  //       <PrintXLS data={list} name="Print Current Page" {...printProps} />
  //     </Col>
  //     <Col md={8}>
  //       {buttonClickXLSSpecification}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
  //     </Col>
  //   </Row>)
  // }

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
          {/* <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button> */}
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
    <div className={(activeKey === '0') || activeKey === '1' ? 'content-inner' : 'content-inner-no-color'}>
      {/* {showPDFModal && (
        <Modal {...PDFModalProps}>
          {printmode}
        </Modal>
      )} */}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0">
          {activeKey === '0' && <AdvancedForm {...advanceFormProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1">
          {/* <Filter {...filterProps} /> */}
          <List {...listProps} />
          {/* {modalVisible && <ModalPrice {...modalPriceProps} />} */}
        </TabPane>
      </Tabs>
    </div>
  )
}

Planogram.propTypes = {
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  planogram: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ planogram, userStore, location, productSource, productDivision, productDepartment, productSubdepartment, stockLocation, expressProductCategory, expressProductBrand, productcountry, stockExtraPriceStore, purchase, grabCategory, specification, store, specificationStock, variantStock, productcategory, productbrand, variant, loading, app }) =>
  ({ planogram, userStore, location, productSource, productDivision, productDepartment, productSubdepartment, stockLocation, expressProductCategory, expressProductBrand, productcountry, stockExtraPriceStore, purchase, grabCategory, specification, store, specificationStock, variantStock, productcategory, productbrand, variant, loading, app }))(Planogram)
