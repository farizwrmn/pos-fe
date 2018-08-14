import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Tabs } from 'antd'
import moment from 'moment'
import { lstorage } from 'utils'
import CardIn from './CardIn'
import Filter from './Filter'
import Modal from './Modal'
import ModalAccept from './ModalAccept'
import ListTransfer from './ListTransferIn'
import FilterTransfer from './FilterTransferIn'

const TabPane = Tabs.TabPane

moment.locale('id')

const Transfer = ({ transferIn, employee, loading, dispatch, app }) => {
  const { listTrans,
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
    modalConfirmVisible } = transferIn
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

  const clickedItem = (e) => {
    const { value } = e.target
    // dispatch({
    //   type: 'employee/query',
    //   payload: {}
    // })
    dispatch({
      type: 'transferIn/queryOutDetail',
      payload: {
        transNo: value,
        storeIdReceiver: lstorage.getCurrentUserStore()
      }
    })
  }

  const getComponentCard = (list) => {
    let card = []
    let then = ''
    let now = moment().format('DD/MM/YYYY HH:mm:ss')
    for (let key = 0; key < list.length; key += 1) {
      then = moment(list[key].transDate).format('dddd, DD-MM-YYYY')
      // let ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))
      // let d = moment.duration(ms)
      // let duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss")
      let duration = moment(moment(now, 'DD/MM/YYYY HH:mm:ss')).diff(moment(then, 'DD/MM/YYYY HH:mm:ss'), 'd')
      const cardProps = {
        title: list[key].transNo,
        style: {
          margin: '5px 5px'
        },
        extra: (<Button type="primary" onClick={value => clickedItem(value)} value={list[key].transNo}>Detail</Button>),
        item: (
          <div>
            <p>from: {list[key].storeName}/{list[key].employeeName}</p>
            <p>to: {list[key].storeNameReceiver}</p>
            <p>Send: {then}</p>
            <p>Duration: {duration} {duration > 1 ? 'days ago' : 'day ago'}</p>
          </div>
        )
      }
      card.push(
        <Col lg={8} md={24}>
          <CardIn {...cardProps} />
        </Col>
      )
    }
    return (
      <Row>
        {card}
      </Row>
    )
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
    modalConfirmVisible,
    disableButton,
    item: transHeader,
    listTransDetail,
    user,
    storeInfo,
    listItem: listTransDetail,
    listEmployee,
    sequenceNumber,
    width: '700px',
    visible: modalAcceptVisible,
    wrapClassName: 'vertical-center-modal',
    onOk (data, list, storeId) {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          disableButton: true
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
    updateFilter (filters, sorts) {
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
          {getComponentCard(listTrans)}
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
  transferIn: PropTypes.object,
  employee: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object
}

export default connect(({ transferIn, employee, loading, app }) => ({ transferIn, employee, loading, app }))(Transfer)

