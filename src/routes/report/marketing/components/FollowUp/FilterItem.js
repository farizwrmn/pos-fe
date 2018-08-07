/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Modal, Form } from 'antd'
import moment from 'moment'
import { formatDate } from 'utils'

const { RangePicker } = DatePicker
const FormItem = Form.Item

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

const FilterItem = ({ onDateChange, onListReset, form: { getFieldsValue, validateFields, getFieldDecorator }, ...filterItemProps }) => {
  const handleChange = () => {
    validateFields((errors) => {
      const data = {
        ...getFieldsValue()
      }
      if (errors) {
        return
      }
      if (data.transDate && data.createdAt && data.lastCall && data.nextCall && data.postService) {
        Modal.warning({
          title: 'Choose a filter',
          content: 'Choose at least 1 filter'
        })
        return
      }
      for (let key in data) {
        if (data[key]) {
          data[key] = [
            moment(data[key][0]).format('YYYY-MM-DD'),
            moment(data[key][1]).format('YYYY-MM-DD')
          ]
        }
      }
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
          <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
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
          <FormItem label="Call Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('createdAt', {
              rules: [
                {
                  required: false
                }
              ]
            })(<RangePicker format="DD-MMM-YYYY" />
            )}
          </FormItem>
          <FormItem label="Last Call" hasFeedback {...formItemLayout}>
            {getFieldDecorator('lastCall', {
              rules: [
                {
                  required: false
                }
              ]
            })(<RangePicker format="DD-MMM-YYYY" />
            )}
          </FormItem>
          <FormItem label="Next Call" hasFeedback {...formItemLayout}>
            {getFieldDecorator('nextCall', {
              rules: [
                {
                  required: false
                }
              ]
            })(<RangePicker format="DD-MMM-YYYY" />
            )}
          </FormItem>
          <FormItem label="Post Service" hasFeedback {...formItemLayout}>
            {getFieldDecorator('postService', {
              rules: [
                {
                  required: false
                }
              ]
            })(<RangePicker format="DD-MMM-YYYY" />
            )}
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
