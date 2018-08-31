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

      data.transDate = {
        from: moment(data.transDate[0]).format('YYYY-MM-DD'),
        to: moment(data.transDate[1]).format('YYYY-MM-DD')
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
      <Modal {...modalOpts} className="modal-browse-fix-size">
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
