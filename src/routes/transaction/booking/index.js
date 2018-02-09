import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Select, Badge, Icon, message, DatePicker } from 'antd'
import moment from 'moment'
import { color } from 'utils'
import CardIn from './CardIn'
import Filter from './Filter'
import Modal from './Modal'

moment.locale('id')
const { Option } = Select

const Booking = ({ booking, dispatch, app }) => {
  const { listTrans, listBooking, oldBookingStatus, period, date, modalVisible, focusBookingId, newBookingStatus, activeKey, newScheduleDate, newScheduleTime } = booking
  const { user } = app
  const filterProps = {
    listTrans,
    resetModal () {
      dispatch({
        type: 'booking/resetAll'
      })
    },
    openModal () {
      dispatch({
        type: 'booking/queryModal',
        payload: {
          active: 1,
          status: 'O',
          start: moment().format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD')
        }
      })
      dispatch({
        type: 'booking/updateState',
        payload: {
          period: moment().format('YYYY-MM'),
          activeKey: '1'
        }
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'booking/updateState',
        payload: {
          activeKey: key
        }
      })
      if (key === '2') {
        dispatch({
          type: 'booking/queryBooking',
          payload: {
            groupMonth: period
          }
        })
      }
    }
  }

  const badge = (status) => {
    let getBadge
    switch (status) {
      case 'OP':
        getBadge = (<Badge dot
          text="Open"
          style={{ backgroundColor: color.purple,
            position: 'relative',
            display: 'inline-block',
            top: 0,
            transform: 'none'
          }}
        />)
        break
      case 'CF':
        getBadge = <Badge status="default" text="Confirmed" />
        break
      case 'CI':
        getBadge = <Badge status="processing" text="Check-In" />
        break
      case 'CO':
        getBadge = <Badge status="success" text="Check-Out" />
        break
      case 'RS':
        getBadge = (<Badge dot
          text="Reschedule"
          style={{ backgroundColor: color.peach,
            position: 'relative',
            display: 'inline-block',
            top: 0,
            transform: 'none'
          }}
        />)
        break
      case 'CC':
        getBadge = <Badge status="warning" text="Cancel" />
        break
      case 'RJ':
        getBadge = <Badge status="error" text="Reject" />
        break
      default:
    }
    return getBadge
  }

  let badgeStatus = badge(oldBookingStatus)

  const modalProps = {
    ...tabProps,
    visible: modalVisible,
    listBooking,
    width: activeKey === '2' ? 1000 : 520,
    date,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onSearch (status, dateBooking) {
      badge()
      dispatch({
        type: 'booking/updateState',
        payload: {
          oldBookingStatus: status,
          date: dateBooking,
          focusBookingId: '',
          listTrans: []
        }
      })
      dispatch({
        type: 'booking/query',
        payload: {
          status,
          dateBooking
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'booking/hideModal'
      })
    },
    onFilterCalendar (value) {
      dispatch({
        type: 'booking/queryBooking',
        payload: {
          groupMonth: value
        }
      })
      dispatch({
        type: 'booking/updateState',
        payload: {
          period: value
        }
      })
    },
    onSelectDate (value) {
      dispatch({
        type: 'booking/updateState',
        payload: {
          activeKey: '1',
          date: value
        }
      })
    }
  }

  const clickedItem = (e) => {
    const { value } = e.target
    dispatch({
      type: 'booking/updateBooking',
      payload: {
        transNo: value
      }
    })
    if (listTrans.length > 0) {
      if (value === focusBookingId) {
        if (oldBookingStatus !== newBookingStatus || oldBookingStatus === 'RS') {
          let leftOvers = listTrans.filter((item) => {
            return item.bookingId !== value
          })
          switch (oldBookingStatus) {
            case 'CI':
              switch (newBookingStatus) {
                case 'CO':
                  dispatch({
                    type: 'booking/edit',
                    payload: {
                      id: value,
                      status: {
                        oldStatus: oldBookingStatus,
                        newStatus: newBookingStatus,
                        updateBy: user.userid
                      },
                      leftOvers
                    }
                  })
                  break
                default:
                  message.warning('This booking has been checked in!')
                  break
              }
              break
            case 'CO':
              message.warning('This booking has been checked out!')
              break
            default:
              switch (newBookingStatus) {
                case 'RS':
                  if (newScheduleDate !== '' && newScheduleTime !== '') {
                    dispatch({
                      type: 'booking/edit',
                      payload: {
                        id: value,
                        status: {
                          oldStatus: oldBookingStatus,
                          newStatus: newBookingStatus,
                          newScheduleDate,
                          newScheduleTime,
                          updateBy: user.userid
                        },
                        leftOvers
                      }
                    })
                  } else {
                    message.warning('Please choose your reschedule time!')
                  }
                  break
                default:
                  dispatch({
                    type: 'booking/edit',
                    payload: {
                      id: value,
                      status: {
                        oldStatus: oldBookingStatus,
                        newStatus: newBookingStatus,
                        updateBy: user.userid
                      },
                      leftOvers
                    }
                  })
                  break
              }
              break
          }
        } else {
          message.warning('This is your latest status!')
        }
      }
    }
  }

  const showHistory = (e) => {
    const { value } = e.target
    dispatch({
      type: 'booking/queryHistory',
      payload: value
    })
  }

  const getComponentCard = (list, focusBookingId, newBookingStatus) => {
    let card = []
    function handleChange (value) {
      const payload = value.split('#')
      dispatch({
        type: 'booking/focusBookingId',
        payload: {
          newBookingStatus: payload[0],
          focusBookingId: payload[1]
        }
      })
      dispatch({
        type: 'booking/updateState',
        payload: {
          newScheduleDate: '',
          newScheduleTime: ''
        }
      })
    }
    function rescheduleBooking (value) {
      const payload = moment(value).format('YYYY-MM-DD HH:mm:ss').split(' ')
      dispatch({
        type: 'booking/updateState',
        payload: {
          newScheduleDate: payload[0],
          newScheduleTime: payload[1]
        }
      })
    }
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        const cardProps = {
          title: `# ${list[key].bookingId}`,
          style: { margin: '5px 5px' },
          extra: (
            <div>
              { (list[key].bookingId === focusBookingId) && <span style={{ paddingRight: '2px' }}><Icon type="check" /></span>}
              <Select placeholder="Update Status" style={{ width: 120 }} onChange={handleChange} >
                <Option value={`OP#${list[key].bookingId}`}><Badge dot
                  text="Open"
                  style={{ backgroundColor: color.purple,
                    position: 'relative',
                    display: 'inline-block',
                    top: 0,
                    transform: 'none'
                  }}
                />
                </Option>
                <Option value={`CF#${list[key].bookingId}`}><Badge status="default" text="Confirmed" /></Option>
                <Option value={`CI#${list[key].bookingId}`}><Badge status="processing" text="Check-In" /></Option>
                <Option value={`CO#${list[key].bookingId}`}><Badge status="success" text="Check-Out" /></Option>
                <Option value={`RS#${list[key].bookingId}`}><Badge dot
                  text="Reschedule"
                  style={{ backgroundColor: color.peach,
                    position: 'relative',
                    display: 'inline-block',
                    top: 0,
                    transform: 'none'
                  }}
                /></Option>
                <Option value={`CC#${list[key].bookingId}`}><Badge status="warning" text="Cancel" /></Option>
                <Option value={`RJ#${list[key].bookingId}`}><Badge status="error" text="Reject" /></Option>
              </Select>
            </div>
          ),
          item: (
            <div>
              { (list[key].bookingId === focusBookingId) && (newBookingStatus === 'RS') &&
              <Row gutter={16}>
                <Col span={6} >Schedule</Col>
                <Col span={18}>: <DatePicker
                  showTime
                  style={{ width: '95%' }}
                  size="small"
                  onChange={rescheduleBooking}
                  onOk={rescheduleBooking}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Choose Reschedule Time"
                /></Col>
              </Row>
              }
              <Row gutter={16}>
                <Col span={6} >Card Id</Col>
                <Col span={18}>: {list[key].memberCardId.match(/\d{4}/g).join(' ')}</Col>
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
                style={{ marginTop: '10px', float: 'right' }}
                onClick={value => clickedItem(value)}
                disabled={focusBookingId === '' ? true : !(list[key].bookingId === focusBookingId)}
                value={list[key].bookingId}
              >OK
              </Button>
              <Button onClick={value => showHistory(value)} value={list[key].bookingId}>History</Button>
            </div>
          )
        }
        card.push(
          <Col lg={8} md={24}>
            <CardIn {...cardProps} />
          </Col>
        )
      }
    }
    return (
      <div>
        { card.length > 0 ? badgeStatus : '' }
        <Row>{card}</Row>
      </div>
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
        newBookingStatus)}
    </div>
  )
}

Booking.propTypes = {
  dispatch: PropTypes.func.isRequired,
  booking: PropTypes.object,
  app: PropTypes.object
}

export default connect(({ booking, app }) => ({ booking, app }))(Booking)

