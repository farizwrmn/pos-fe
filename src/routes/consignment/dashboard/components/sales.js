import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { color, numberFormat } from 'utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Menu, Dropdown, Button, Icon, Modal, DatePicker, Row, Form } from 'antd'
import moment from 'moment'
import ModalRange from './modalRange'
import styles from './sales.less'

const numberFormatter = numberFormat.numberFormatter

const FormItem = Form.Item
const { MonthPicker } = DatePicker
class CustomizedLabel extends React.Component {
  render () {
    const { x, y, stroke, value } = this.props

    return <text x={x} y={y} dy={-4} fill={stroke} fontSize={11} textAnchor="middle">{value === 0 ? null : numberFormatter(value)}</text>
  }
}

const Sales = ({
  dispatch,
  typeText,
  modalRange,
  modalPeriod,
  data
}) => {
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 9
      },
      sm: {
        span: 8
      },
      md: {
        span: 7
      }
    },
    wrapperCol: {
      xs: {
        span: 15
      },
      sm: {
        span: 16
      },
      md: {
        span: 14
      }
    }
  }

  const handleMenuClick = (e) => {
    const { key } = e
    switch (key) {
      case '1': {
        const params = {
          start: moment().add(-6, 'days').format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD'),
          typeText: 'Weekly'
        }
        dispatch({
          type: 'consignmentDashboard/queryChart',
          payload: params
        })
        break
      }
      case '2': {
        const params = {
          start: moment().add(-29, 'days').format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD'),
          typeText: 'Last 30 Days'
        }
        dispatch({
          type: 'consignmentDashboard/queryChart',
          payload: params
        })
        break
      }
      case '3': {
        const params = {
          start: moment().startOf('month').format('YYYY-MM-DD'),
          to: moment().endOf('month').format('YYYY-MM-DD'),
          typeText: 'This Month'
        }
        dispatch({
          type: 'consignmentDashboard/queryChart',
          payload: params
        })
        break
      }
      case '4': {
        const params = {
          start: moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
          to: moment().add(-1, 'month').endOf('month').format('YYYY-MM-DD'),
          typeText: 'Last Month'
        }
        dispatch({
          type: 'consignmentDashboard/queryChart',
          payload: params
        })
        break
      }
      case '5': {
        const params = {
          modalRange: true
        }
        dispatch({
          type: 'consignmentDashboard/updateState',
          payload: params
        })
        break
      }
      case '6': {
        const params = {
          modalPeriod: true
        }
        dispatch({
          type: 'consignmentDashboard/updateState',
          payload: params
        })
        break
      }
      default:
    }
  }
  const hdlChangeMonth = (date, dateString) => {
    dispatch({
      type: 'consignmentDashboard/queryChart',
      payload: {
        start: moment(dateString, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
        to: moment(dateString, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
        typeText: moment(dateString, 'YYYY-MM').format('MMM-YYYY')
      }
    })
    dispatch({
      type: 'consignmentDashboard/updateState',
      payload: {
        modalPeriod: false
      }
    })
  }

  const menu = (
    <Menu onClick={handleMenuClick} >
      <Menu.Item key="1">Weekly</Menu.Item>
      <Menu.Item key="2">Last 30 Days</Menu.Item>
      <Menu.Item key="3">This Month</Menu.Item>
      <Menu.Item key="4">Last Month</Menu.Item>
      <Menu.Item key="5">Custom Range</Menu.Item>
      <Menu.Item key="6">Choose Period</Menu.Item>
    </Menu>
  )
  const modalProps = {
    visible: modalRange,
    onCancel () {
      dispatch({
        type: 'consignmentDashboard/updateState',
        payload: {
          modalRange: false
        }
      })
    },
    onSubmit (data) {
      dispatch({
        type: 'consignmentDashboard/queryChart',
        payload: {
          start: data.start <= data.to ? moment(data.start).format('YYYY-MM-DD') : moment(data.to).format('YYYY-MM-DD'),
          to: data.to >= data.start ? moment(data.to).format('YYYY-MM-DD') : moment(data.start).format('YYYY-MM-DD'),
          typeText: `${moment(data.start, 'YYYY-MM-DD').format('DD-MMM')} - ${moment(data.to, 'YYYY-MM-DD').format('DD-MMM')}`
        }
      })
      dispatch({
        type: 'consignmentDashboard/updateState',
        payload: {
          modalRange: false
        }
      })
    }
  }

  const modalPeriodProps = {
    visible: modalPeriod,
    footer: null,
    onCancel () {
      dispatch({
        type: 'consignmentDashboard/updateState',
        payload: {
          modalPeriod: false
        }
      })
    }
  }

  return (
    <div className={styles.sales}>
      <Modal {...modalPeriodProps}>
        <Row>
          <FormItem label="Periode" hasFeedback {...formItemLayout}>
            <MonthPicker allowClear onChange={hdlChangeMonth} />
          </FormItem>
        </Row>
      </Modal>
      {modalRange && <ModalRange {...modalProps} />}
      <div className={styles.title}>
        <Dropdown size="normal" trigger={['click']} overlay={menu} >
          <Button style={{ marginLeft: 8 }}>
            {typeText}
            <Icon type="down" />
          </Button>
        </Dropdown> - Consignment Sales</div>
      <ResponsiveContainer minHeight={360}>
        <LineChart data={data}>
          <Legend verticalAlign="top"
            content={(prop) => {
              const { payload } = prop
              return (<ul className={classnames({ [styles.legend]: true, clearfix: true })}>
                {payload.map((item, key) => <li key={key}><span className={styles.radiusdot} style={{ background: item.color }} />{item.value}</li>)}
              </ul>)
            }}
          />
          <XAxis dataKey="name" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
          <Tooltip
            wrapperStyle={{ border: 'none', boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)' }}
            content={(content) => {
              const list = content.payload.map((item, key) => <li key={key} className={styles.tipitem}><span className={styles.radiusdot} style={{ background: item.color }} />{`${item.name}:${numberFormatter(item.value)}`}</li>)
              return <div className={styles.tooltip}><p className={styles.tiptitle}>{moment(content.label, 'DD/MM').format('ll')}</p><ul>{list}</ul></div>
            }}
          />
          <Line type="linear" dataKey="Sales" stroke={color.pastelgreen} strokeWidth={3} dot={{ fill: color.pastelgreen }} activeDot={{ r: 5, strokeWidth: 0 }} label={<CustomizedLabel />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

Sales.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.array
}

export default Sales
