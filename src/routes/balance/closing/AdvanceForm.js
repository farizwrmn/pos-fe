import React from 'react'
import { Form, Input, Row, Col } from 'antd'

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
  list = [],
  form: {
    getFieldsValue,
    getFieldDecorator
  }
}) => {
  const substringPrice = (text) => {
    if (text.includes('@')) {
      const start_index = text.indexOf('@') + 1
      return text.substring(start_index).trim()
    }
    return text
  }
  const fieldsValue = [
    ...getFieldsValue()
  ]
  let amountPrice = Object.keys(fieldsValue).reduce((prev, key) => {
    const value = parseFloat(substringPrice(fieldsValue[key]))
    return prev + (isNaN(value) ? 0 : value)
  }, 0)


  return (
    <Row>
      <Col {...column}>
        {/* <div
          style={{
            display: 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'grid-template-rows': '1fr',
            'grid-column-gap': '0px',
            'grid-row-gap': '0px'
          }}
        > */}
        <table style={{ 'border-collapse': 'collapse' }}>
          <tr>
            <th>Lembar</th>
            <th>Denominasi</th>
            <th>Total</th>
          </tr>
          <tr>
            {list && list.map((column) => {
              return (
                <div>
                  <td>
                    <FormItem label={column.name} hasFeedback {...formItemLayout}>
                      {getFieldDecorator(column.name, {
                        initialValue: column.name || null
                      })(<Input />)}
                    </FormItem>
                    <p>{column.type}</p>
                  </td>
                  <td>
                    <p>{substringPrice(column.name)}</p>
                  </td>
                </div>
              )
            })}
          </tr>
          <tr>
            <td colSpan={2}>Subtotal</td>
            <td>{amountPrice}</td>
          </tr>
        </table>
        {/* </div> */}
      </Col>
    </Row>
  )
}


export default Form.create()(FormComponent)
