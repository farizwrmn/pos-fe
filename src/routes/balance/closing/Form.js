import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormComponent = ({
  item = {},
  listShift = [],
  listUser = [],
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Row>
      <Col {...column}>
        <FormItem label="Shift" hasFeedback {...formItemLayout}>
          {getFieldDecorator('shiftId', {
            initialValue: item && item.shiftId ? item.shiftId : undefined,
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select disabled>
              {listShift && listShift.map(item => (<Option value={item.id} key={item.id}>{item.shiftName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="Assign To" hasFeedback {...formItemLayout}>
          {getFieldDecorator('approveUserId', {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              placeholder="Pejabat Toko"
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listUser && listUser.map(item => (<Option value={item.id} key={item.id}>{item.userName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="Memo" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item && item.description ? item.description : undefined
          })(<Input disabled maxLength={255} />)}
        </FormItem>
      </Col>
    </Row>
  )
}

FormComponent.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func
}

export default FormComponent
