import React from 'react'
import { connect } from 'dva'
import { Tabs, Button, Icon, Dropdown, Row, Col, Menu, Modal } from 'antd'
import { DataTable } from './../components'
import FormModel from './Form'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Model = ({ car, app, loading, dispatch }) => {
  const { listModel, listBrand, activeKey, pagination, currentItem, formType, printType,
    changed, showPrintModal, listPrintAllModels, queryLoading } = car
  const { user, storeInfo } = app

  const changeTab = (key) => {
    dispatch({
      type: 'car/updateState',
      payload: {
        activeKey: key,
        currentItem: {},
        formType: 'add'
      }
    })
    dispatch({ type: 'car/queryModelsOfCars' })
  }

  const formProps = {
    item: currentItem,
    listBrand,
    formType,
    callBrand (q) {
      dispatch({
        type: 'car/queryModelsOfCars',
        payload: { q }
      })
    },
    onSubmit (data) {
      let id = currentItem.id
      if (id) {
        dispatch({ type: 'car/updateModelOfCars', payload: { id, ...data } })
      } else {
        dispatch({ type: 'car/addModelOfCars', payload: data })
      }
    },
    onCancel () {
      dispatch({
        type: 'car/updateState',
        payload: {
          activeKey: '1',
          currentItem: {}
        }
      })
    }
  }

  const listProps = {
    dataSource: listModel,
    pagination,
    loading: loading.effects['car/queryModelsOfCars'],
    headers: [{ title: 'Name', key: 'modelName' }],
    module: 'model',
    onChange (page) {
      dispatch({
        type: 'car/queryModelsOfCars',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'car/updateState',
        payload: {
          activeKey: '0',
          currentItem: item,
          formType: 'edit'
        }
      })
      dispatch({ type: 'car/queryModelsOfCars' })
    },
    deleteItem (id) {
      dispatch({
        type: 'car/deleteModelOfCars',
        payload: { id }
      })
    }
  }

  const filterProps = {
    onSearchByKeyword (q) {
      dispatch({
        type: 'car/queryModelsOfCars',
        payload: { q }
      })
    },
    onResetFilter () {
      dispatch({ type: 'car/queryModelsOfCars' })
    }
  }

  const clickBrowse = () => {
    dispatch({
      type: 'car/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const onShowPrintModal = (printType) => {
    dispatch({
      type: 'car/updateState',
      payload: {
        showPrintModal: true,
        printType
      }
    })
  }

  const onHidePrintModal = () => {
    dispatch({
      type: 'car/updateState',
      payload: {
        showPrintModal: false,
        changed: false,
        listPrintAllModels: []
      }
    })
  }

  const getAllModels = () => {
    if (printType === 'pdf') {
      dispatch({
        type: 'car/checkLengthOfModels',
        payload: {
          page: 51,
          pageSize: 10
        }
      })
    } else {
      dispatch({
        type: 'car/queryAllModels',
        payload: {
          type: 'all'
        }
      })
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPrintModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPrintModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown>)

  const printModalProps = {
    visible: showPrintModal,
    title: printType === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      onHidePrintModal()
    }
  }

  const printProps = {
    user,
    storeInfo
  }

  let buttonClickPDF = (changed && listPrintAllModels.length) ? (<PrintPDF data={listPrintAllModels} name="Print All Models" {...printProps} />) : (<Button disabled={queryLoading} type="default" size="large" onClick={getAllModels} loading={queryLoading}><Icon type="file-pdf" />Get All Models</Button>)
  let buttonClickXLS = (changed && listPrintAllModels.length) ? (<PrintXLS data={listPrintAllModels} name="Print All Models" {...printProps} />) : (<Button disabled={queryLoading} type="default" size="large" onClick={getAllModels} loading={queryLoading}><Icon type="file-pdf" />Get All Models</Button>)
  let notification = (changed && listPrintAllModels.length) ? "Click 'Print All Models' to print!" : "Click 'Get All Models' to get all data!"
  let type
  if (printType === 'pdf') {
    type = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={listModel} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    type = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={listModel} name="Print Current Page" {...printProps} /></Col></Row>)
  }

  return (
    <div className="content-inner">
      {showPrintModal && <Modal footer={null} {...printModalProps}>
        {type}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <FormModel {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <DataTable {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ car, app, loading }) => ({ car, app, loading }))(Model)
