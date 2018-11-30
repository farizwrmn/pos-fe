import React from 'react'
import { Form, Button, Input, Modal, Row, Col, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const FormCustomer = ({
  ...modalProps,
  listSocial,
  addNewRow,
  deleteRow,
  listCustomerSocial,
  onSubmit,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields
  }
}) => {
  const sociallist = (listSocial || []).length > 0 ? listSocial.map(c => <Option value={c.id} key={c.id}>{c.name}</Option>) : []
  const getCurrentData = () => {
    const data = getFieldsValue()
    let newData = []
    for (let key in data.name) {
      newData[key] = {
        id: data.id[key],
        name: data.name[key],
        sosmedId: data.sosmedId[key],
        url: data.url[key],
        type: data.type[key],
        memberId: data.memberId[key]
      }
    }
    return newData
  }
  const handleOk = () => {
    const data = getCurrentData()
    onSubmit(data)
  }
  const modalOpts = {
    onOk: handleOk,
    ...modalProps
  }

  const handleClick = () => {
    const data = getCurrentData()
    addNewRow(data)
  }
  const handleDelete = (id, index) => {
    Modal.confirm({
      title: 'Are you sure Delete This Record ?',
      content: 'Delete cannot be undone',
      onOk () {
        const data = getCurrentData()
        deleteRow(data, id, index)
        resetFields()
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="vertical">
        {
          listCustomerSocial.map((data, index) => {
            return (
              <Row>
                <Col span={6}>
                  {getFieldDecorator(`type[${index}]`, { initialValue: data.type })(<Input type="hidden" />)}
                  {getFieldDecorator(`id[${index}]`, { initialValue: data.id })(<Input type="hidden" />)}
                  {getFieldDecorator(`memberId[${index}]`, { initialValue: data.memberId })(<Input type="hidden" />)}
                  <FormItem label={index === 0 ? 'Sosmed' : null} hasFeedback>
                    {getFieldDecorator(`sosmedId[${index}]`, {
                      initialValue: data.sosmedId,
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Select
                      showSearch
                      allowClear
                      disabled={data.type === 'edit'}
                      optionFilterProp="children"
                      placeholder="ex. facebook.com"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                    >{sociallist}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={6} offset={1}>
                  <FormItem label={index === 0 ? 'Name' : null} hasFeedback>
                    {getFieldDecorator(`name[${index}]`, {
                      initialValue: data.name,
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Input disabled={data.type === 'edit'} placeholder="Name" />)}
                  </FormItem>
                </Col>
                <Col span={6} offset={1}>
                  <FormItem label={index === 0 ? 'URL' : null} hasFeedback>
                    {getFieldDecorator(`url[${index}]`, {
                      initialValue: data.url
                    })(<Input disabled={data.type === 'edit'} placeholder="URL" />)}
                  </FormItem>
                </Col>
                <Col span={3} offset={1}>
                  <FormItem label={index === 0 ? 'Delete' : null}>
                    <Button icon="delete" type="danger" onClick={() => handleDelete(data.id, index)} />
                  </FormItem>
                </Col>
              </Row>
            )
          })
        }
        <Button icon="plus" style={{ width: '100%' }} onClick={handleClick} />
      </Form>
    </Modal>
  )
}

export default Form.create()(FormCustomer)
