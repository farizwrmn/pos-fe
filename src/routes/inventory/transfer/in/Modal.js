import React from 'react'
// import PropTypes from 'prop-types'
import { Form, Modal, Select } from 'antd'
import moment from 'moment'

// const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option

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
  item,
  transNo,
  storeId,
  ...modalProps,
  // changeDate,
  onSearch,
  form: {
    getFieldDecorator,
    resetFields,
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

      data.period = data.period ? data.period : []
      data.transNo = data.transNo ? data.transNo : []
      data.storeIdReceiver = data.storeIdReceiver ? data.storeIdReceiver : []
      for (let key in data) {
        if (data[key].length === 0) {
          delete data[key]
        }
      }
      // let startDate = moment(data.period[0]).format('YYYY-MM-DD')
      // let endDate = moment(data.period[1]).format('YYYY-MM-DD')
      const { period, ...other } = data
      let startDate = period ? moment(period, 'YYYY-MM').startOf('month').format('YYYY-MM-DD hh:mm:ss') : null
      let endDate = period ? moment(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD hh:mm:ss') : null
      onSearch(startDate, endDate, other)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  // const filterDate = (date, dateString) => {
  //   // let startDate = moment(dateString, 'YYYY-MM').startOf('month').format('YYYY-MM-DD hh:mm:ss')
  //   // let endDate = moment(dateString, 'YYYY-MM').endOf('month').format('YYYY-MM-DD hh:mm:ss')
  //   changeDate(dateString)
  //   resetFields()
  // }

  let childrenTransNo = []
  const selectTransNo = () => {
    transNo.length > 0 ? transNo.map(no => childrenTransNo.push(<Option key={(no || '').toString(36)}>{(no || '').toString(36)}</Option>)) : []
  }

  let childrenStoreId = []
  const selectStoreId = () => {
    storeId.length > 0 ? storeId.map(store => childrenStoreId.push(<Option key={(store.storeIdReceiver || '').toString(36)}>{(store.storeNameReceiver || '').toString(36)}</Option>)) : []
  }

  const resetSelectedField = (value) => {
    resetFields([value])
  }

  return (
    <Modal {...modalOpts}>
      {/* <FormItem label="Period" hasFeedback {...formItemLayout}>
        {getFieldDecorator('period', {
          initialValue: null
        })(
          // <RangePicker onChange={filterDate} />
          <MonthPicker onChange={filterDate} placeholder="Select Period" />
        )}
      </FormItem> */}
      <FormItem label="Store Name" hasFeedback {...formItemLayout}>
        {getFieldDecorator('storeIdReceiver', {
          initialValue: item.storeIdReceiver
        })(<Select
          mode="multiple"
          style={{ width: 245 }}
          placeholder="Select Store Name"
          onFocus={selectStoreId()}
          onChange={() => resetSelectedField('transNo')}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {childrenStoreId}
        </Select>)}
      </FormItem>
      <FormItem label="Trans No" hasFeedback {...formItemLayout}>
        {getFieldDecorator('transNo', {
          initialValue: item.transNo
        })(<Select
          mode="multiple"
          style={{ width: 245 }}
          placeholder="Select Trans No"
          onFocus={selectTransNo()}
          onChange={() => resetSelectedField('storeId')}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {childrenTransNo}
        </Select>)}
      </FormItem>
    </Modal>
  )
}

export default Form.create()(modal)
