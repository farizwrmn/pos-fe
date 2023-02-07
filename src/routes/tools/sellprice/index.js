import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Tabs } from 'antd'
import { connect } from 'dva'
import Form from './Form'
import ModalItem from './Modal'
import ModalEdit from './ModalEdit'
import ModalRounding from './ModalRounding'
import ListTransfer from './ListTransferOut'
import FilterTransfer from './FilterTransferOut'

const TabPane = Tabs.TabPane
const Sellprice = ({ location, transferOut, sellprice, pos, employee, app, dispatch, loading }) => {
  const { modalInvoiceVisible, listInvoice, tmpInvoiceList, listTransOut, period, modalConfirmVisible, formType, showPrintModal } = transferOut
  const { modalProductVisible, listTrans, currentItemList, modalAcceptVisible, modalVisible, modalEditVisible, currentItem, filter, sort, disable, listItem, activeKey, selectedRowKeys, modalRoundingVisible } = sellprice
  const { list } = employee
  let listEmployee = list
  const { user, storeInfo } = app

  const listProps = {
    dataSource: listItem,
    loading: loading.effects['sellprice/query'],
    activeKey,
    selectedRowKeys,
    location,
    editItem (item) {
      dispatch({
        type: 'sellprice/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
    },
    updateSelectedKey (key) {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          selectedRowKeys: key
        }
      })
    }
  }

  // const tabProps = {
  //   activeKey,
  //   changeTab (key) {
  //     dispatch({
  //       type: 'sellprice/changeTab',
  //       payload: {
  //         activeKey: key,
  //         formType: 'add',
  //         currentItem: {},
  //         disable: ''
  //       }
  //     })
  //   }
  // }

  const modalProductProps = {
    location,
    loading: loading.effects['productstock/query'],
    pos,
    listInvoice,
    selectedRowKeys,
    tmpInvoiceList,
    modalProductVisible,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          list: []
        }
      })
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    },
    handleProductBrowse () {
      dispatch({
        type: 'productstock/query'
      })
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalProductVisible: true
        }
      })
    },
    handleModalEdit () {
      if ((listItem || []).length > 0 && (selectedRowKeys || []).length > 0) {
        dispatch({
          type: 'sellprice/updateState',
          payload: {
            modalEditVisible: true
          }
        })
      } else {
        Modal.warning({
          title: 'Item was not selected',
          content: 'Select at least 1 item from list'
        })
      }
    },
    handleModalRounding () {
      if ((listItem || []).length > 0 && (selectedRowKeys || []).length > 0) {
        dispatch({
          type: 'sellprice/updateState',
          payload: {
            modalRoundingVisible: true
          }
        })
      } else {
        Modal.warning({
          title: 'Item was not selected',
          content: 'Select at least 1 item from list'
        })
      }
    },
    onRowClick (item) {
      let arrayProd = []
      const listByCode = listItem
      const checkExists = listByCode.filter(el => el.productCode === item.productCode)
      if (checkExists.length === 0) {
        arrayProd = listByCode
        const data = {
          no: arrayProd.length + 1,
          productId: item.id,
          productCode: item.productCode,
          productName: item.productName,
          prevSellPrice: item.sellPrice,
          prevDistPrice01: item.distPrice01,
          prevDistPrice02: item.distPrice02,
          prevDistPrice03: item.distPrice03,
          prevDistPrice04: item.distPrice04,
          prevDistPrice05: item.distPrice05,
          prevDistPrice06: item.distPrice06,
          prevDistPrice07: item.distPrice07,
          prevDistPrice08: item.distPrice08,
          prevDistPrice09: item.distPrice09,
          sellPrice: item.sellPrice,
          distPrice01: item.distPrice01,
          distPrice02: item.distPrice02,
          distPrice03: item.distPrice03,
          distPrice04: item.distPrice04,
          distPrice05: item.distPrice05,
          distPrice06: item.distPrice06,
          distPrice07: item.distPrice07,
          distPrice08: item.distPrice08,
          distPrice09: item.distPrice09
        }
        arrayProd.push(data)
        dispatch({
          type: 'sellprice/updateState',
          payload: {
            listItem: arrayProd,
            currentItemList: data,
            modalVisible: true
          }
        })
        dispatch({
          type: 'sellprice/updateState',
          payload: {
            modalProductVisible: false
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

  const formEditProps = {
    visible: modalVisible,
    currentItemList,
    onOkList (item) {
      listItem[item.no - 1] = item

      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false,
          listItem
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false
        }
      })
    },
    onDeleteItem (no) {
      dispatch({
        type: 'sellprice/deleteListState',
        payload: {
          no,
          listItem
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false
        }
      })
    }
  }

  const formEditAllProps = {
    visible: modalEditVisible,
    listItem,
    currentItemList,
    selectedRowKeys,
    onOkList (item) {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalEditVisible: false,
          listItem: item
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalEditVisible: false
        }
      })
    },
    onDeleteItem (no) {
      dispatch({
        type: 'sellprice/deleteListState',
        payload: {
          no,
          listItem
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalEditVisible: false
        }
      })
    }
  }

  const formRoundingProps = {
    visible: modalRoundingVisible,
    listItem,
    currentItemList,
    selectedRowKeys,
    onOkList (item) {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalRoundingVisible: false,
          listItem: item
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalRoundingVisible: false
        }
      })
    },
    onDeleteItem (no) {
      dispatch({
        type: 'sellprice/deleteListState',
        payload: {
          no,
          listItem
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: {},
          modalRoundingVisible: false
        }
      })
    }
  }

  const formConfirmProps = {
    visible: modalConfirmVisible,
    modalConfirmVisible,
    itemPrint: currentItem,
    user,
    storeInfo,
    onShowModal () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
    // ...tabProps,
    ...listProps,
    ...formEditProps,
    ...formConfirmProps,
    listTrans,
    listItem,
    listEmployee,
    item: currentItem,
    modalProductProps,
    modalProductVisible,
    modalInvoiceVisible,
    modalVisible,
    disableSave: loading.effects['sellprice/add'],
    loading: loading.effects['productstock/query'],
    disabled: `${formType === 'edit' ? disable : ''}`,
    button: `${formType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (listCurrentItem, header, data) {
      dispatch({
        type: 'sellprice/add',
        payload: {
          currentItem: listCurrentItem,
          header,
          data
        }
      })
    },
    getEmployee () {
      dispatch({
        type: 'employee/query',
        payload: {}
      })
    },
    hideEmployee () {
      dispatch({
        type: 'employee/updateState',
        payload: {
          listEmployee: {}
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          currentItemList: record,
          modalVisible: true
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          formType: 'add',
          currentItem: {},
          currentItemList: {}
        }
      })
    }
  }

  const listTransferProps = {
    dataSource: listTrans,
    listItem,
    listTrans,
    listEmployee,
    modalAcceptVisible,
    visible: modalAcceptVisible,
    listTransOut,
    loading: loading.effects['sellprice/query'],
    location,
    filter,
    sort,
    storeInfo,
    item: currentItem,
    showPrintModal,
    user,
    onOk (id, data) {
      dispatch({
        type: 'sellprice/update',
        payload: {
          header: {
            transNoId: id
          },
          data
        }
      })
    },
    onVoid (id) {
      dispatch({
        type: 'sellprice/cancel',
        payload: {
          id
        }
      })
    },
    updateFilter (filters, sorts) {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          filter: filters,
          sort: sorts
        }
      })
    },
    showAcceptModal (data) {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalAcceptVisible: true,
          currentItem: data
        }
      })
      dispatch({
        type: 'sellprice/queryDetail',
        payload: {
          transNo: data.transNo,
          status: 0
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          modalAcceptVisible: false
        }
      })
    },
    onModalVisible () {
      // dispatch({
      //   type: 'sellprice/updateState',
      //   payload: {
      //     currentItemList: record,
      //     modalVisible: true
      //   }
      // })
    }
  }

  const filterTransferProps = {
    period,
    filter: {
      ...location.query
    },
    filterTransNo (no) {
      dispatch({
        type: 'sellprice/queryHeader',
        payload: {
          transNo: no,
          status: 0
        }
      })
    }
  }
  const changeTab = (key) => {
    if (key === '1') {
      dispatch({
        type: 'sellprice/queryHeader',
        payload: {
          status: 0
        }
      })
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          activeKey: key,
          listItem: [],
          currentItem: {},
          selectedRowKeys: []
        }
      })
    } else {
      dispatch({
        type: 'sellprice/querySequence'
      })
      dispatch({
        type: 'sellprice/updateState',
        payload: {
          activeKey: key,
          listItem: [],
          selectedRowKeys: []
        }
      })
    }
  }
  return (
    <div className="content-inner">
      <Tabs type="card" activeKey={activeKey} onChange={key => changeTab(key)}>
        <TabPane tab="Add" key="0">
          {activeKey === '0' && (<div>
            <Form {...formProps} />
            {modalVisible && <ModalItem {...formEditProps} />}
            {modalEditVisible && <ModalEdit {...formEditAllProps} />}
            {modalRoundingVisible && <ModalRounding {...formRoundingProps} />}
          </div>)}
        </TabPane>
        <TabPane tab="Browse" key="1">
          {activeKey === '1' && (<div>
            <FilterTransfer {...filterTransferProps} />
            <ListTransfer {...listTransferProps} />
          </div>)}
        </TabPane>
      </Tabs>
    </div>
  )
}

Sellprice.propTypes = {
  transferOut: PropTypes.object,
  pos: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ sellprice, transferOut, pos, employee, productstock, app, loading }) => ({ sellprice, transferOut, pos, employee, productstock, app, loading }))(Sellprice)
