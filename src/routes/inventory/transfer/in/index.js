import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button } from 'antd'
import moment from 'moment'
import CardIn from './CardIn'
import Filter from './Filter'
import Modal from './Modal'
import ModalAccept from './ModalAccept'
moment.locale('id')

const Transfer = ({ transferIn, employee, dispatch }) => {
  const { listTrans, listTransDetail, transHeader, transNo, currentItem, storeId, period, modalVisible, modalAcceptVisible, sequenceNumber } = transferIn
  const { list } = employee
  let listEmployee = list
  const filterProps = {
    listTrans,
    resetModal () {
      dispatch({
        type: 'transferIn/resetAll',
      })
    },
    openModal () {
      dispatch({
        type: 'transferIn/queryModal',
        payload: {
          active: 1,
          status: 0,
          start: moment(period, 'YYYY-MM').startOf('month').format('YYYY-MM-DD hh:mm:ss'),
          end: moment(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD hh:mm:ss'),
        },
      })
    },
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
          start: moment(dateString, 'YYYY-MM').startOf('month').format('YYYY-MM-DD hh:mm:ss'),
          end: moment(dateString, 'YYYY-MM').endOf('month').format('YYYY-MM-DD hh:mm:ss'),
          active: 1,
          status: 0
        },
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
        },
      })
    },
    onCancel () {
      dispatch({
        type: 'transferIn/hideModal',
      })
    },
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
        transNo: value
      }
    })
  }

  const getComponentCard = (list) => {
    let card = []
    let then = "" 
    let now = moment().format("DD/MM/YYYY hh:mm:ss")
    for (let key in list) {
      then = moment(list[key].transDate).format('dddd, DD-MM-YYYY')
      // let ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))
      // let d = moment.duration(ms)
      // let duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss")
      let duration = moment(moment(now, "DD/MM/YYYY hh:mm:ss")).diff(moment(then, "DD/MM/YYYY hh:mm:ss"), 'd')
      const cardProps = {
        title: list[key].transNo,
        style: {
          margin: '5px 5px'
        },
        extra:(<Button type="primary" onClick={(value) => clickedItem(value)} value={list[key].transNo}>Detail</Button>),
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
            <CardIn { ...cardProps }/>
          </Col>
      )
    }
    return (
      <Row>
        {card}
      </Row>
    )
  }

  const modalAcceptProps = {
    item: transHeader,
    listTransDetail,
    listEmployee,
    sequenceNumber,
    width: '700px',
    visible: modalAcceptVisible,
    wrapClassName: 'vertical-center-modal',
    onOk(data, list, storeId) {
      dispatch({
        type: 'transferIn/add',
        payload: {
          storeId: storeId,
          data: data,
          detail: list
        },
      })
    },
    onCancel() {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          modalAcceptVisible: false,
          listTransDetail: [],
          transHeader: {}
        }
      })
    },
    getEmployee() {
      dispatch({
        type: 'employee/query',
        payload: {}
      })
    },
    hideEmployee() {
      dispatch({
        type: 'employee/updateState',
        payload: {
          listEmployee: {}
        }
      })
    },
  }
  return (
    <div className="content-inner">
      <Row>
        <Filter {...filterProps} />
      </Row>
      {modalVisible && <Modal {...modalProps} />}
      {modalAcceptVisible && <ModalAccept {...modalAcceptProps} />}
      {getComponentCard(listTrans)}
    </div>
  )
}

Transfer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  transferIn: PropTypes.object,
  employee: PropTypes.object,
}

export default connect(({ transferIn, employee }) => ({ transferIn, employee }))(Transfer)

