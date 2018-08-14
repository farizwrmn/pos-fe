import React from 'react'
import { connect } from 'dva'
import { Tabs, Button, Icon, Dropdown, Row, Col, Menu, Modal } from 'antd'
import { DataTable } from './../components'
import FormType from './Form'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Type = ({ car, app, loading, dispatch }) => {
  const { listType, listModel, activeKey, pagination, currentItem, formType, printType,
    changed, showPrintModal, listPrintAllTypes, queryLoading } = car
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
    dispatch({ type: 'car/queryTypesOfCars' })
  }

  const formProps = {
    item: currentItem,
    listModel,
    formType,
    callModel (q) {
      dispatch({
        type: 'car/queryTypesOfCars',
        payload: { q }
      })
    },
    onSubmit (data) {
      let id = currentItem.id
      if (id) {
        dispatch({ type: 'car/updateTypeOfCars', payload: { id, ...data } })
      } else {
        dispatch({ type: 'car/addTypeOfCars', payload: data })
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
    dataSource: listType,
    pagination,
    loading: loading.effects['car/queryTypesOfCars'],
    headers: [{ title: 'Name', key: 'typeName' }],
    module: 'type',
    onChange (page) {
      dispatch({
        type: 'car/queryTypesOfCars',
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
    },
    deleteItem (id) {
      dispatch({
        type: 'car/deleteTypeOfCars',
        payload: { id }
      })
    }
  }

  const filterProps = {
    onSearchByKeyword (q) {
      dispatch({
        type: 'car/queryTypesOfCars',
        payload: { q }
      })
    },
    onResetFilter () {
      dispatch({ type: 'car/queryTypesOfCars' })
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
        listPrintAllTypes: []
      }
    })
  }

  const getAllTypes = () => {
    if (printType === 'pdf') {
      dispatch({
        type: 'car/checkLengthOfTypes',
        payload: {
          page: 51,
          pageSize: 10
        }
      })
    } else {
      dispatch({
        type: 'car/queryAllTypes',
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

  let buttonClickPDF = (changed && listPrintAllTypes.length) ? (<PrintPDF data={listPrintAllTypes} name="Print All Types" {...printProps} />) : (<Button disabled={queryLoading} type="default" size="large" onClick={getAllTypes} loading={queryLoading}><Icon type="file-pdf" />Get All Types</Button>)
  let buttonClickXLS = (changed && listPrintAllTypes.length) ? (<PrintXLS data={listPrintAllTypes} name="Print All Types" {...printProps} />) : (<Button disabled={queryLoading} type="default" size="large" onClick={getAllTypes} loading={queryLoading}><Icon type="file-pdf" />Get All Types</Button>)
  let notification = (changed && listPrintAllTypes.length) ? "Click 'Print All Types' to print!" : "Click 'Get All Types' to get all data!"
  let type
  if (printType === 'pdf') {
    type = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={listType} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    type = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={listType} name="Print Current Page" {...printProps} /></Col></Row>)
  }

  return (
    <div className="content-inner">
      {showPrintModal && <Modal footer={null} {...printModalProps}>
        {type}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <FormType {...formProps} />}
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

export default connect(({ car, app, loading }) => ({ car, app, loading }))(Type)
