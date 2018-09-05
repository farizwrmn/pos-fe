import React from 'react'
import { Row, Input, Modal, Col, Form, Card, Radio, Button } from 'antd'

const RadioGroup = Radio.Group
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 }
  }
}

const FormWO = ({
  listCustomFields,
  onSubmitFields,
  WorkOrder,
  loadingButton,
  formCustomFieldType,
  transData = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()

      const parent = listCustomFields.filter(x => x.fieldParentName === null)
      const parentId = parent.map(x => x.id)
      let arrayParent = parentId.map((x) => {
        let object = {}
        for (let i in data) {
          object.woId = transData.id
          object.fieldId = x
          if (i === `value-${x}`) {
            object.value = data[i]
          }
          if (i === `memo-${x}`) {
            object.memo = null
          }
        }
        return object
      })

      const child = listCustomFields.filter(x => x.fieldParentName !== null)
      const childId = child.map(x => x.id)
      let arrayChild = childId.map((x) => {
        let object = {}
        for (let i in data) {
          object.woId = transData.id
          object.fieldId = x
          if (i === `value-${x}`) {
            object.value = data[i]
          }
          if (i === `memo-${x}`) {
            object.memo = data[i]
          }
        }
        return object
      })
      onSubmitFields(arrayParent.concat(arrayChild))
    })
  }
  const resetValueFields = (name) => {
    const affectedFields = listCustomFields.filter(x => Number(x.fieldParentId) === Number(name))
    const object = {}
    for (let i in affectedFields) {
      const field = affectedFields[i]
      const value = `value-${field.id}`
      const memo = `memo-${field.id}`
      object[value] = null
      object[memo] = null
    }
    setFieldsValue(object)
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    if (value === 4) {
      Modal.info({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process'
      })
      resetValueFields(name)
    }
  }

  return (
    <div>
      <h1>{formCustomFieldType ? 'Add New' : ''}</h1>
      <h2>{transData.woNo}</h2>
      <h2>{transData.memberName}</h2>
      <h2>{transData.policeNo}</h2>
      <br />
      <Form layout="horizontal">
        {listCustomFields.map((x) => {
          const parentName = !!x.fieldParentName
          if (!parentName) {
            return (
              <Card bordered style={{ padding: '20px' }}>
                <Row>
                  <Col md={6}>
                    <FormItem label={`${x.fieldName}`} hasFeedback {...formItemLayout}>
                      {getFieldDecorator(`value-${x.id}`, {
                        initialValue: Number(x.value) || 4,
                        rules: [{ required: true }]
                      })(<RadioGroup disabled={!formCustomFieldType} name={x.id} onChange={key => handleChange(key)}>
                        <div><Radio value={1}>Good</Radio></div>
                        <div><Radio value={2}>Normal</Radio></div>
                        <div><Radio value={3}>Bad</Radio></div>
                        <div><Radio value={4}>Not-checked</Radio></div>
                      </RadioGroup>)}
                    </FormItem>
                  </Col>
                  <Col md={18}>
                    {listCustomFields.map((childField) => {
                      const parentName = !!childField.fieldParentName
                      if (parentName && Number(childField.fieldParentId) === Number(x.id)) {
                        return (
                          <FormItem label={`${childField.fieldName}`} hasFeedback {...formItemLayout}>
                            <Row gutter={16}>
                              <Col md={11}>
                                {getFieldDecorator(`value-${childField.id}`, {
                                  initialValue: childField.value
                                  // rules: [
                                  //   {
                                  //     required: getFieldValue(`value-${x.id}`) !== 4
                                  //   }
                                  // ]
                                })(<Input disabled={getFieldValue(`value-${x.id}`) === 4 || !formCustomFieldType} placeholder={`value-${childField.fieldName}`} />)}
                              </Col>
                              <Col md={11} style={{ marginRight: '8px' }}>
                                {getFieldDecorator(`memo-${childField.id}`, {
                                  initialValue: childField.memo
                                  // rules: [
                                  //   {
                                  //     required: getFieldValue(`value-${x.id}`) !== 4
                                  //   }
                                  // ]
                                })(<Input disabled={getFieldValue(`value-${x.id}`) === 4 || !formCustomFieldType} placeholder={`memo-${childField.fieldName}`} />)}
                              </Col>
                            </Row>
                          </FormItem>
                        )
                      }
                      return null
                    })}
                  </Col>
                </Row>
              </Card>
            )
          }
          return null
        })}
      </Form>
      <Button disabled={!formCustomFieldType || loadingButton.effects['workorder/addWorkOrderFields']} onClick={() => handleSubmit()} type="primary" size="large" style={{ float: 'right', marginBottom: 2, marginTop: 10 }}>Submit</Button>
      <Button onClick={() => WorkOrder()} size="large" style={{ float: 'right', marginBottom: 2, marginTop: 10, marginRight: '8px' }}>Work Order</Button>
    </div>
  )
}

export default Form.create()(FormWO)
