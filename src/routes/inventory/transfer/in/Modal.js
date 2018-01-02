import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, DatePicker, Select } from 'antd'
import moment from 'moment'

const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 12 },
  },
}

const modal = ({
  item,
  transNo,
  period,
  storeId,
  ...modalProps,
  changeDate,
  onSearch,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
    getFieldsValue,
  },
}) => {
  const handleReset = () => {
    resetFields()
    resetItem()
    onListReset()
  }

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      data.transNo === undefined ? data.transNo = [] : data.transNo
      data.storeId === undefined ? data.storeId = [] : data.storeId

      if (data.transNo.length === 0 && data.storeId.length === 0) {
        Modal.warning({
          title: 'No Data',
          content: 'No data inside storage',
        })
        return
      }

      for (let key in data) {
        if (data[key].length === 0) {
          delete data[key]
        }
      }
      // let startDate = moment(data.period[0]).format('YYYY-MM-DD')
      // let endDate = moment(data.period[1]).format('YYYY-MM-DD')
      const { period, ...other } = data
      let startDate = moment(period, 'YYYY-MM').startOf('month').format('YYYY-MM-DD hh:mm:ss')
      let endDate = moment(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD hh:mm:ss')
      onSearch(startDate, endDate, other)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const filterDate = (date, dateString) => {
    // let startDate = moment(dateString, 'YYYY-MM').startOf('month').format('YYYY-MM-DD hh:mm:ss')
    // let endDate = moment(dateString, 'YYYY-MM').endOf('month').format('YYYY-MM-DD hh:mm:ss')
    changeDate(dateString)
    resetFields()
  }

  let childrenTransNo = []
  const selectTransNo = () => {
    transNo.length > 0 ? transNo.map(no => childrenTransNo.push(<Option key={no.toString(36)}>{no.toString(36)}</Option>)) : []
  }

  let childrenStoreId = []
  const selectStoreId = () => {
    storeId.length > 0 ? storeId.map(store => childrenStoreId.push(<Option key={store.storeId.toString(36)}>{store.storeName.toString(36)}</Option>)) : []
  }

  const resetSelectedField = (value) => {
    resetFields([value])
  }

  return (
    <Modal {...modalOpts}>
      <FormItem label="Period" hasFeedback {...formItemLayout}>
        {getFieldDecorator('period', {
          initialValue: moment.utc(period, 'YYYY-MM'),
          rules: [
            {
              required: true,
            },
          ],
        })(
        // <RangePicker onChange={filterDate} />
        <MonthPicker onChange={filterDate} placeholder="Select Period" />
        )}
      </FormItem>
      <FormItem label="Trans No" hasFeedback {...formItemLayout}>
        {getFieldDecorator('transNo', {
          initialValue: item.transNo,
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
      <FormItem label="Store Name" hasFeedback {...formItemLayout}>
        {getFieldDecorator('storeId', {
          initialValue: item.storeId,
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
    </Modal>
  )
}

export default Form.create()(modal)
