import React from 'react'
import { Form, Modal, DatePicker, Select, Badge, Tabs, Calendar } from 'antd'
import moment from 'moment'
import { color } from 'utils'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 12 }
  }
}

const modal = ({
  ...modalProps,
  onSearch,
  activeKey,
  changeTab,
  date,
  onFilterCalendar,
  onSelectDate,
  listBooking,
  form: {
    getFieldDecorator,
    // resetFields,
    validateFields,
    getFieldsValue
  }
}) => {
  // const handleReset = () => {
  //   resetFields()
  //   resetItem()
  //   onListReset()
  // }

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onSearch(data.status, data.period.format('YYYY-MM-DD'))
    })
  }

  const getFieldCalendar = (value) => {
    const period = moment(value).format('YYYY-MM')
    onFilterCalendar(period)
  }

  const selectDate = (value) => {
    const selectedDate = moment(value).format('YYYY-MM-DD')
    onSelectDate(selectedDate)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const getListData = (value) => {
    let listData = []
    for (let key = 0; key < listBooking.length; key += 1) {
      switch (value.format('YYYY-MM-DD')) {
      case listBooking[key].scheduleDate:
        listData.push({ type: listBooking[key].status, content: listBooking[key].counter })
        break
      default:
      }
    }
    return listData || []
  }

  const dateCellRender = (value) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {
          listData.map((item) => {
            let badge
            switch (item.type) {
            case 'Open':
              badge = (<Badge dot
                style={{
                  backgroundColor: color.purple,
                  position: 'relative',
                  display: 'inline-block',
                  top: 0,
                  transform: 'none'
                }}
                text={item.content}
              />)
              break
            case 'Confirmed':
              badge = (<Badge status="default"
                text={item.content}
              />)
              break
            case 'Check-In':
              badge = (<Badge status="processing"
                text={item.content}
              />)
              break
            case 'Check-Out':
              badge = (<Badge status="success"
                text={item.content}
              />)
              break
            case 'Reschedule':
              badge = (<Badge dot
                style={{
                  backgroundColor: color.peach,
                  position: 'relative',
                  display: 'inline-block',
                  top: 0,
                  transform: 'none'
                }}
                text={item.content}
              />)
              break
            case 'Cancel':
              badge = (<Badge status="warning"
                text={item.content}
              />)
              break
            case 'Reject':
              badge = (<Badge status="error"
                text={item.content}
              />)
              break
            default:
            }
            return (
              <li>
                {badge}
              </li>
            )
          })
        }
      </ul>
    )
  }

  let groupByMonth = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[moment(x[key]).format('YYYY-MM')] = rv[moment(x[key]).format('YYYY-MM')] || []).push(x)
      return rv
    }, {})
  }

  let groupByStatus = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }

  let month = groupByMonth(listBooking, 'scheduleDate')
  let full = {}
  for (let key = 0; key < month.length; key += 1) {
    full[key] = groupByStatus(month[key], 'status')
  }

  const getMonthData = (value) => {
    let monthlyData = []
    for (let key = 0; key < full.length; key += 1) {
      switch (value.format('YYYY-MM')) {
      case key:
        for (let status = 0; status < full[key].length; status += 1) {
          switch (status) {
          case status: {
            let total = 0
            for (let i = 0; i < full[key][status].length; i += 1) {
              total += full[key][status][i].counter
            }
            monthlyData.push({ type: status, content: total })
            break
          }
          default:
          }
        }
        break
      default:
      }
    }
    return monthlyData || []
  }

  const monthCellRender = (value) => {
    const listData = getMonthData(value)
    return listData ? (<ul className="events">
      {
        listData.map((item) => {
          let badge
          switch (item.type) {
          case 'Open':
            badge = (<Badge dot
              style={{
                backgroundColor: color.purple,
                position: 'relative',
                display: 'inline-block',
                top: 0,
                transform: 'none'
              }}
              text={item.content}
            />)
            break
          case 'Confirmed':
            badge = (<Badge status="default"
              text={item.content}
            />)
            break
          case 'Check-In':
            badge = (<Badge status="processing"
              text={item.content}
            />)
            break
          case 'Check-Out':
            badge = (<Badge status="success"
              text={item.content}
            />)
            break
          case 'Reschedule':
            badge = (<Badge dot
              style={{
                backgroundColor: color.peach,
                position: 'relative',
                display: 'inline-block',
                top: 0,
                transform: 'none'
              }}
              text={item.content}
            />)
            break
          case 'Cancel':
            badge = (<Badge status="warning"
              text={item.content}
            />)
            break
          case 'Reject':
            badge = (<Badge status="error"
              text={item.content}
            />)
            break
          default:
          }
          return (
            <li>
              {badge}
            </li>
          )
        })
      }
    </ul>
    ) : []
  }

  const calendarProps = {
    dateCellRender,
    monthCellRender,
    style: { width: '730px', float: 'right' }
  }

  return (
    <Modal {...modalOpts}>
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)}>
        <TabPane tab="Filter" key="1">
          <FormItem label="Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: moment.utc(date, 'YYYY-MM-DD'),
              rules: [
                {
                  required: true
                }
              ]
            })(
              <DatePicker placeholder="Select Period" />
            )}
          </FormItem>
          <FormItem label="Status" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: 'OP'
            })(<Select placeholder="Choose Status" defaultValue="OP" style={{ width: 120 }} >
              <Option value="OP"><Badge dot
                text="Open"
                style={{
                  backgroundColor: color.wisteria,
                  position: 'relative',
                  display: 'inline-block',
                  top: 0,
                  transform: 'none'
                }}
              />
              </Option>
              <Option value="CF"><Badge status="default" text="Confirmed" /></Option>
              <Option value="CI"><Badge status="processing" text="Check-In" /></Option>
              <Option value="CO"><Badge status="success" text="Check-Out" /></Option>
              <Option value="RS"><Badge dot
                text="Reschedule"
                style={{
                  backgroundColor: color.lavenderrose,
                  position: 'relative',
                  display: 'inline-block',
                  top: 0,
                  transform: 'none'
                }}
              /></Option>
              <Option value="CC"><Badge status="warning" text="Cancel" /></Option>
              <Option value="RJ"><Badge status="error" text="Reject" /></Option>
            </Select>)}
          </FormItem>
        </TabPane>
        <TabPane tab="Browse" key="2">
          <div style={{ width: '230px', float: 'left' }} >
            <Badge dot
              style={{
                backgroundColor: color.wisteria,
                position: 'relative',
                display: 'inline-block',
                top: '-0.2vh',
                transform: 'none',
                marginRight: '8px'
              }}
            />
            <Badge status="default" />
            <Badge status="processing" />
            <Badge status="success" />
            <Badge dot
              style={{
                backgroundColor: color.lavenderrose,
                position: 'relative',
                display: 'inline-block',
                top: '-0.2vh',
                transform: 'none',
                marginRight: '8px'
              }}
            />
            <Badge status="warning" />
            <Badge status="error" />
            <div>
              <Badge dot
                text="Open"
                style={{
                  backgroundColor: color.wisteria,
                  position: 'relative',
                  display: 'inline-block',
                  top: 0,
                  transform: 'none'
                }}
              />
            </div>
            <div>
              <Badge status="default" text="Confirmed" />
            </div>
            <div>
              <Badge status="processing" text="Check-In" />
            </div>
            <div>
              <Badge status="success" text="Check-Out" />
            </div>
            <div>
              <Badge dot
                text="Reschedule"
                style={{
                  backgroundColor: color.lavenderrose,
                  position: 'relative',
                  display: 'inline-block',
                  top: 0,
                  transform: 'none'
                }}
              />
            </div>
            <div>
              <Badge status="warning" text="Cancel" />
            </div>
            <div>
              <Badge status="error" text="Reject" />
            </div>
          </div>
          <Calendar {...calendarProps} onSelect={e => selectDate(e)} onPanelChange={e => getFieldCalendar(e)} />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default Form.create()(modal)
