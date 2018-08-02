/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { TimePicker, DatePicker, message, Modal, Form } from 'antd'
import moment from 'moment'
import { formatDate } from 'utils'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const format = 'HH:mm'

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const FilterItem = ({ onDateChange, onListReset, form: { getFieldsValue, validateFields, getFieldValue, getFieldDecorator }, ...filterItemProps }) => {
  const handleChange = () => {
    validateFields((errors) => {
      const data = {
        ...getFieldsValue()
      }
      if (!(data.transTime1 && data.transTime2 && data.transTime3 && data.transTime4
        && data.transTime5 && data.transTime6 && data.transTime7 && data.transTime8)) {
        message.warning('please insert all time range')
      }
      if (errors) {
        return
      }

      data.transDate = {
        from: moment(data.transDate[0]).format('YYYY-MM-DD'),
        to: moment(data.transDate[1]).format('YYYY-MM-DD')
      }
      data.transTime1 = data.transTime1.format(format)
      data.transTime2 = data.transTime2.format(format)
      data.transTime3 = data.transTime3.format(format)
      data.transTime4 = data.transTime4.format(format)
      data.transTime5 = data.transTime5.format(format)
      data.transTime6 = data.transTime6.format(format)
      data.transTime7 = data.transTime7.format(format)
      data.transTime8 = data.transTime8.format(format)
      onDateChange(data)
    })
  }

  const modalOpts = {
    onOk: handleChange,
    ...filterItemProps
  }

  return (
    <div>
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transDate', {
              initialValue: [moment(formatDate(), 'DD-MMM-YYYY').add('-1', 'months'), moment(formatDate(), 'DD-MMM-YYYY')],
              rules: [
                {
                  required: true
                }
              ]
            })(<RangePicker format="DD-MMM-YYYY" />
            )}
          </FormItem>
          <FormItem label="Trans Time 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transTime1', {
              initialValue: moment('08:01', format),
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />
            )}
            {getFieldDecorator('transTime2', {
              initialValue: getFieldValue('transTime1') ? moment(getFieldValue('transTime1'), format).add('2', 'hours').add('-1', 'minutes') : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
          </FormItem>
          <FormItem label="Trans Time 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transTime3', {
              initialValue: moment(getFieldValue('transTime2'), format).add('1', 'minutes'),
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
            {getFieldDecorator('transTime4', {
              initialValue: getFieldValue('transTime3') ? moment(getFieldValue('transTime3'), format).add('2', 'hours').add('-1', 'minutes') : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
          </FormItem>
          <FormItem label="Trans Time 3" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transTime5', {
              initialValue: getFieldValue('transTime4') ? moment(getFieldValue('transTime4'), format).add('1', 'minutes') : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
            {getFieldDecorator('transTime6', {
              initialValue: getFieldValue('transTime5') ? moment(getFieldValue('transTime5'), format).add('3', 'hours').add('-1', 'minutes') : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
          </FormItem>
          <FormItem label="Trans Time 4" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transTime7', {
              initialValue: getFieldValue('transTime6') ? moment(getFieldValue('transTime6'), format).add('1', 'minutes') : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
            {getFieldDecorator('transTime8', {
              initialValue: getFieldValue('transTime7') ? moment(getFieldValue('transTime7'), format).add('3', 'hours').add('-1', 'minutes') : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

FilterItem.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(FilterItem)
