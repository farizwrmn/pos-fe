import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Row, Col } from 'antd'

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

const FormLabel = () => {
  return (
    <Row label={(<div />)} hasFeedback {...formItemLayout}>
      <Col {...formItemLayout.labelCol} />
      <Col {...formItemLayout.wrapperCol}>
        <Row>
          <Col span={12}><div>Sales</div></Col>
          <Col span={12}><div>Petty-Cash</div></Col>
        </Row>
      </Col>
    </Row>
  )
}

const FormComponent = ({
  label,
  name,
  getFieldDecorator
}) => {
  return (
    <FormItem label={label} hasFeedback {...formItemLayout}>
      <Row>
        <Col span={12}>
          <div>
            {getFieldDecorator(`detail[${name}][balanceIn]`, {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber
                style={{ width: '95%' }}
                // onClick={() => this.select()}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            )}
          </div>
        </Col>
        {/* {name === 'C' && (
          <Col span={12}>
            <div>
              {getFieldDecorator(`cash[${name}][balanceIn]`, {
                initialValue: 0,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  // onClick={() => this.select()}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              )}
            </div>
          </Col>
        )} */}
      </Row>
    </FormItem>
  )
}

const List = ({
  listOpts = [],
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <div>
      <FormLabel />
      {listOpts && listOpts.map(item => (
        <FormComponent
          getFieldDecorator={getFieldDecorator}
          label={item.typeName}
          name={item.typeCode}
        />
      ))}
    </div>
  )
}

List.propTypes = {
  form: PropTypes.object.isRequired
}

export default List
