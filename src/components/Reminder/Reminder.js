import React from 'react'
import { Tabs, Table } from 'antd'
import { connect } from 'dva'
import moment from 'moment'

const TabPane = Tabs.TabPane

const Reminder = ({
  listServiceReminder,
  listUnitUsage,
  unitId,
  unitPoliceNo,
  dispatch
}) => {
  const columnAlert = [{
    title: 'Name',
    dataIndex: 'checkName',
    key: 'checkName',
    width: 250,
    render (text, record) {
      return {
        props: {
          style: {
            backgroundColor: (localStorage.getItem('lastMeter') || 0) >= record.checkMileage ? '#FF4D49' : '#ffffff',
            color: (localStorage.getItem('lastMeter') || 0) >= record.checkMileage ? '#ffffff' : '#666'
          }
        },
        children: <div>{text}</div>
      }
    }
  }, {
    title: 'KM',
    dataIndex: 'checkMileage',
    key: 'checkMileage',
    width: 110,
    render (text, record) {
      return {
        props: {
          style: {
            backgroundColor: (localStorage.getItem('lastMeter') || 0) >= record.checkMileage ? '#FF4D49' : '#ffffff',
            color: (localStorage.getItem('lastMeter') || 0) >= record.checkMileage ? '#ffffff' : '#666'
          }
        },
        children: <div>{text.toLocaleString()}</div>
      }
    }
  }, {
    title: 'Period',
    dataIndex: 'checkTimePeriod',
    key: 'checkTimePeriod',
    width: 130,
    render (text, record) {
      return {
        props: {
          style: {
            backgroundColor: (localStorage.getItem('lastMeter') || 0) >= record.checkMileage ? '#FF4D49' : '#ffffff',
            color: (localStorage.getItem('lastMeter') || 0) >= record.checkMileage ? '#ffffff' : '#666'
          }
        },
        children: <div>{text.toLocaleString()} days</div>
      }
    }
  }]

  const columnUsage = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      render (text, record) {
        return {
          props: {
            style: {
              backgroundColor: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#FF4D49' : '#ffffff',
              color: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#ffffff' : '#666'
            }
          },
          children: <div>{text}</div>
        }
      }
    },
    {
      title: 'Last Meter',
      dataIndex: 'lastMeter',
      key: 'lastMeter',
      width: 100,
      render (text, record) {
        return {
          props: {
            style: {
              backgroundColor: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#FF4D49' : '#ffffff',
              color: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#ffffff' : '#666'
            }
          },
          children: <div>{text}</div>
        }
      }
    },
    {
      title: 'Next Service',
      dataIndex: 'nextServiceMeter',
      key: 'nextServiceMeter',
      width: 100,
      render (text, record) {
        return {
          props: {
            style: {
              backgroundColor: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#FF4D49' : '#ffffff',
              color: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#ffffff' : '#666'
            }
          },
          children: <div>{text}</div>
        }
      }
    },
    {
      title: 'Last Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 110,
      render (text, record) {
        return {
          props: {
            style: {
              backgroundColor: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#FF4D49' : '#ffffff',
              color: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#ffffff' : '#666'
            }
          },
          children: <div>{text ? moment(text, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}</div>
        }
      }
    },
    {
      title: 'Avg By KM',
      dataIndex: 'nextServiceKM',
      key: 'nextServiceKM',
      width: 110,
      render (text, record) {
        return {
          props: {
            style: {
              backgroundColor: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#FF4D49' : '#ffffff',
              color: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#ffffff' : '#666'
            }
          },
          children: <div>{text ? moment(text, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}</div>
        }
      }
    },
    {
      title: 'Avg By Date',
      dataIndex: 'nextServiceDate',
      key: 'nextServiceDate',
      width: 110,
      render (text, record) {
        return {
          props: {
            style: {
              backgroundColor: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#FF4D49' : '#ffffff',
              color: (moment().format('YYYY-MM-DD') >= moment(record.nextServiceKM, 'YYYY-MM-DD').format('YYYY-MM-DD') ||
                moment().format('YYYY-MM-DD') >= moment(record.nextServiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD')) ?
                '#ffffff' : '#666'
            }
          },
          children: <div>{text ? moment(text, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}</div>
        }
      }
    }
  ]

  if (listServiceReminder && listServiceReminder.length) {
    listServiceReminder.sort((x, y) => x.checkMileage - y.checkMileage)
  }

  let alertDescription = (<Table bordered pagination={false} style={{ margin: '0px 5px', backgroundColor: '#FFF' }} dataSource={listServiceReminder} columns={columnAlert} />)
  let alertUsage = (<Table bordered pagination={false} scroll={{ x: '840px', y: 350 }} style={{ margin: '0px 5px', backgroundColor: '#FFF' }} dataSource={listUnitUsage || []} columns={columnUsage} />)
  const handleChangeReminder = (key) => {
    if (key === '2') {
      dispatch({
        type: 'pos/getServiceUsageReminder',
        payload: {
          policeNo: unitId
        }
      })
    }
  }

  return (
    <Tabs type="card" onChange={handleChangeReminder}>
      <TabPane tab="Usage" key="1">
        <div className="componentTitleWrapper">
          <h3 className="componentTitle">
            <span>Usage for {unitPoliceNo}</span>
          </h3>
        </div>
        <div className="service-reminders">{alertUsage}</div>
      </TabPane>
      <TabPane tab="Services" key="2">
        <div className="componentTitleWrapper">
          <h3 className="componentTitle">
            <span>Services</span>
          </h3>
        </div>
        <div className="service-reminders">{alertDescription}</div>
      </TabPane>
    </Tabs>
  )
}

export default connect(({ pos }) => ({ pos }))(Reminder)

