import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button, Tooltip } from 'antd'
import moment from 'moment'
import CardIn from './CardIn'
import Filter from './Filter'
import Modal from './Modal'
import ModalAccept from './ModalAccept'
moment.locale('id')

const Transfer = ({ transferIn, dispatch }) => {
  const { listTrans, listTransDetail, transHeader, transNo, currentItem, storeId, period, modalVisible, modalAcceptVisible, sequenceNumber } = transferIn
  const filterProps = {
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
    sequenceNumber,
    width: '700px',
    visible: modalAcceptVisible,
    wrapClassName: 'vertical-center-modal',
    onCancel() {
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          modalAcceptVisible: false,
          listTransDetail: [],
          transHeader: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Row>
        <Tooltip visible={listTrans.length <= 0} placement="bottomRight" title="Search transfer list card">
          <Filter {...filterProps} />
        </Tooltip>
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
}

export default connect(({ transferIn }) => ({ transferIn }))(Transfer)

