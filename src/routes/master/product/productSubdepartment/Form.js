import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Select, Modal } from 'antd'
import { Link } from 'dva/router'

const FormItem = Form.Item
const { Option } = Select

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  listDivision,
  listDepartment,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const productDivision = (listDivision || []).length > 0 ? listDivision.map(c => <Option value={c.id} key={c.id}>{c.divisionName}</Option>) : []
  const productDepartment = (listDepartment || []).length > 0 ? listDepartment.filter(filtered => filtered.divisionId === getFieldValue('divisionId')).map(c => <Option value={c.id} key={c.id}>{c.departmentName}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label={(<Link target="_blank" to="/stock-division">Division</Link>)} hasFeedback {...formItemLayout}>
            {getFieldDecorator('divisionId', {
              initialValue: item.divisionId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              optionFilterProp="children"
              onChange={() => setFieldsValue({ departmentId: null })}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >{productDivision}
            </Select>)}
          </FormItem>
          <FormItem label={(<Link target="_blank" to="/stock-department">Department</Link>)} hasFeedback {...formItemLayout}>
            {getFieldDecorator('departmentId', {
              initialValue: item.departmentId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >{productDepartment}
            </Select>)}
          </FormItem>
          <FormItem label="Subdepartment Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subdepartmentName', {
              initialValue: item.subdepartmentName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
