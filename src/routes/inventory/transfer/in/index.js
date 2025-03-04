import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Tabs, message } from 'antd'
import moment from 'moment'
import { lstorage } from 'utils'
import { CANCEL_INPUT } from 'utils/variable'
import Filter from './Filter'
import Modal from './Modal'
import ModalAccept from './ModalAccept'
import ListTransfer from './ListTransferIn'
import FilterTransfer from './FilterTransferIn'
import ListTransferPending from './ListTransferPending'

const TabPane = Tabs.TabPane

moment.locale('id')

const Transfer = ({ fingerEmployee, transferIn, employee, loading, dispatch, app }) => {
  const {
    listTrans,
    listTransIn,
    listProducts,
    listTransferIn,
    activeTabKey,
    listTransDetail,
    transHeader,
    transNo,
    currentItem,
    storeId,
    period,
    modalVisible,
    modalAcceptVisible,
    sequenceNumber,
    filter,
    sort,
    disableButton,
    showPrintModal,
    modalConfirmVisible,
    printMode,
    selectedRowKeys
  } = transferIn
  const { currentItem: currentItemFinger } = fingerEmployee
  const { list } = employee
  const { user, storeInfo } = app
  let listEmployee = list
  const changeTab = (key) => {
    dispatch({
      type: 'transferIn/updateState',
      payload: {
        activeTabKey: (key || '0').toString()
      }
    })
  }
  const filterProps = {
    activeTabKey,
    listTrans,
    resetModal () {
      dispatch({
        type: 'transferIn/resetAll'
      })
    },
    openModal () {
      dispatch({
        type: 'transferIn/queryModal',
        payload: {
          active: 1,
          status: 0,
          start: moment(period, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
      dispatch({
        type: 'transferIn/queryCode',
        payload: {
          active: 1,
          status: 0,
          storeIdReceiver: lstorage.getCurrentUserStore()
        }
      })
    }
  }
  const modalProps = {
    item: currentItem,
    transNo,
    period,
    storeId,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    changeDate (dateString) {
      dispatch({
        type: 'transferIn/queryCode',
        payload: {
          period: dateString,
          start: moment(dateString, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(dateString, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
          active: 1,
          status: 0
        }
      })
    },
    onSearch (startDate, endDate, data) {
      dispatch({
        type: 'transferIn/queryMutasiOut',
        payload: {
          start: startDate,
          end: endDate,
          active: 1,
          status: 0,
          ...data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferIn/hideModal'
      })
    }
  }

  const clickedItem = (transNo) => {
    // dispatch({
    //   type: 'employee/query',
    //   payload: {}
    // })
    dispatch({
      type: 'transferIn/queryOutDetail',
      payload: {
        transNo,
        storeIdReceiver: lstorage.getCurrentUserStore()
      }
    })
  }

  const listTransferPendingProps = {
    dataSource: listTrans,
    onRowClick (record) {
      clickedItem(record.transNo)
    }
  }

  const formConfirmProps = {
    visible: modalConfirmVisible,
    modalConfirmVisible,
    itemPrint: currentItem,
    listItem: listTransDetail,
    user,
    storeInfo,
    wrapClassName: 'vertical-center-modal',
    onShowModal () {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }
  const modalAcceptProps = {
    ...formConfirmProps,
    printMode,
    selectedRowKeys,
    modalConfirmVisible,
    disableButton,
    item: transHeader,
    currentItem: currentItemFinger,
    listTransDetail,
    user,
    storeInfo,
    dispatch,
    listItem: listTransDetail,
    listEmployee,
    sequenceNumber,
    width: '850px',
    visible: modalAcceptVisible,
    wrapClassName: 'vertical-center-modal',
    onEnter (data) {
      dispatch({
        type: 'transferIn/acceptTransOut',
        payload: {
          ...data
        }
      })
    },
    onPrintBarcode () {
      message.info('Choose product to print barcode')
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          printMode: 'select'
        }
      })
    },
    onOk (data, list, storeId) {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          disableButton: true,
          selectedRowKeys: [],
          printMode: 'default'
        }
      })
      dispatch({
        type: 'transferIn/add',
        payload: {
          storeId,
          data,
          detail: list
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          modalAcceptVisible: false,
          selectedRowKeys: [],
          printMode: 'default',
          listTransDetail: [],
          transHeader: {}
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
    registerFingerprint (payload) {
      if (payload) {
        payload.transType = CANCEL_INPUT
      }
      dispatch({
        type: 'employee/registerFingerprint',
        payload
      })
    }
  }
  const filterTransferProps = {
    period,
    filter: {
      ...location.query
    },
    filterChange (date) {
      dispatch({
        type: 'transferIn/queryTransferIn',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          period: date
        }
      })
    },
    filterTransNo (date, no) {
      dispatch({
        type: 'transferIn/queryTransferIn',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
          transNo: no
        }
      })
    }
  }
  const listTransferProps = {
    dataSource: listTransferIn,
    listTransferIn,
    listProducts,
    listTransOut: listTransIn,
    loading: loading.effects['transferOut/queryTransferOut'],
    location,
    filter,
    sort,
    storeInfo,
    showPrintModal,
    user,
    updateFilter (page, filters, sorts) {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          filter: filters,
          sort: sorts
        }
      })
    },
    getProducts (transNo) {
      dispatch({
        type: 'transferIn/queryProducts',
        payload: {
          transNo
        }
      })
    },
    getTrans (transNo, storeId) {
      dispatch({
        type: 'transferIn/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    },
    onShowPrint () {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          showPrintModal: true
        }
      })
    },
    onClosePrint () {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          showPrintModal: false
        }
      })
    }
  }
  return (
    <div className="content-inner">
      <Tabs type="card" defaultActiveKey={activeTabKey} onChange={key => changeTab(key)}>
        <TabPane tab="List" key="0">
          <Row>
            <Filter {...filterProps} />
          </Row>
          {modalVisible && <Modal {...modalProps} />}
          {modalAcceptVisible && <ModalAccept {...modalAcceptProps} />}
          <ListTransferPending {...listTransferPendingProps} />
        </TabPane>
        <TabPane tab="Archieve" key="1">
          <FilterTransfer {...filterTransferProps} />
          <ListTransfer {...listTransferProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Transfer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fingerEmployee: PropTypes.object,
  transferIn: PropTypes.object,
  employee: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object
}

export default connect(({ fingerEmployee, transferIn, employee, loading, app }) => ({ fingerEmployee, transferIn, employee, loading, app }))(Transfer)

