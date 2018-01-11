import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button, Select, Badge, Icon } from 'antd'
import moment from 'moment'
import { color } from 'utils'
import CardIn from './CardIn'
import Filter from './Filter'
import Modal from './Modal'

moment.locale('id')
const { Option, OptGroup } = Select

const Booking = ({ booking, dispatch }) => {
  const { listTrans, modalVisible, focusBookingId, newBookingStatus  } = booking
  const filterProps = {
    listTrans,
    resetModal () {
      dispatch({
        type: 'booking/resetAll',
      })
    },
    openModal () {
      dispatch({
        type: 'booking/queryModal',
        payload: {
          active: 1,
          status: 'O',
          start: moment().format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
        },
      })
    },
  }
  const modalProps = {
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onSearch (status, dateBooking) {
      dispatch({
        type: 'booking/query',
        payload: {
          status,
          dateBooking
        },
      })
    },
    onCancel () {
      dispatch({
        type: 'booking/hideModal',
      })
    },
  }
  
  const clickedItem = (e) => {
    const { value } = e.target
    dispatch({
      type: 'booking/updateBooking',
      payload: {
        transNo: value
      }
    })
  }

  const getComponentCard = (list, focusBookingId, newBookingStatus) => {
    let card = []
    function handleChange(value) {
      const payload = value.split('#')
      dispatch({
        type: 'booking/focusBookingId',
        payload: {
          newBookingStatus: payload[0],
          focusBookingId: payload[1]
        }
      })
    }
    for (let key in list) {
      const cardProps = {
        title: '# ' + list[key].bookingId,
        style: { margin: '5px 5px' },
        extra:(
          <div>
          { (list[key].bookingId === focusBookingId) && <span style={{paddingRight: '2px'}}><Icon type="check" /></span>}
          <Select placeholder="Update Status" style={{ width: 120 }} onChange={handleChange} >
            <Option value={`OP#`+list[key].bookingId}><Badge dot text="Open"
                                      style={{backgroundColor: color.purple,
                                        position: 'relative', display: 'inline-block',
                                        top: 0, transform: 'none'
                                      }}/>
            </Option>
            <Option value={`CF#`+list[key].bookingId}><Badge status="default" text="Confirmed" /></Option>
            <Option value={`CI#`+list[key].bookingId}><Badge status="processing" text="Check-In" /></Option>
            <Option value={`CO#`+list[key].bookingId}><Badge status="success" text="Check-Out" /></Option>
            <Option value={`RS#`+list[key].bookingId}><Badge dot text="Reschedule" style={{backgroundColor: color.peach,
              position: 'relative', display: 'inline-block',
              top: 0, transform: 'none'
            }} /></Option>
            <Option value={`CC#`+list[key].bookingId}><Badge status="warning" text="Cancel" /></Option>
            <Option value={`RJ#`+list[key].bookingId}><Badge status="error" text="Reject" /></Option>
          </Select>
          </div>
            ),
        item: (
          <div>
            <Row gutter={16}>
              <Col span={6} >Card Id</Col>
              <Col span={18}>: {list[key].memberCardId.match(/\d{4}/g).join(" ")}</Col>
            </Row>
            <Row gutter={16}>
              <Col span={6} >Name</Col>
              <Col span={18}>: {list[key].memberName}</Col>
            </Row>
            <Row gutter={16}>
              <Col span={6} >Mobile No.</Col>
              <Col span={18}>: {list[key].mobileNumber}</Col>
            </Row>
            <Row gutter={16}>
              <Col span={6} >Police No.</Col>
              <Col span={18}>: {list[key].policeNo}</Col>
            </Row>
            <Row gutter={16}>
              <Col span={6} >Schedule</Col>
              <Col span={18}>: {list[key].scheduleDate} {list[key].scheduleTime}</Col>
            </Row>
            <Button type="primary"
                    style={{ marginTop: '10px', float: 'right'}}
                    onClick={(value) => clickedItem(value)}
                    disabled={focusBookingId==='' ? true : !(list[key].bookingId===focusBookingId)}
                    value={list[key].bookingId}>OK
            </Button>
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
      <Row>{card}</Row>
    )
  }

  return (
    <div className="content-inner">
      <Row>
      <Filter {...filterProps} />
      </Row>
      {modalVisible && <Modal {...modalProps} />}
      {getComponentCard(listTrans,
        focusBookingId,
        newBookingStatus,)}
    </div>
  )
}

Booking.propTypes = {
  dispatch: PropTypes.func.isRequired,
  booking: PropTypes.object,
}

export default connect(({ booking }) => ({ booking }))(Booking)

