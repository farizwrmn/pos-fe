import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Switch, Row, Col } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { lg: 14, md: 14, sm: 14, float: 'left' },
  wrapperCol: { lg: 14, md: 14, sm: 14, }
}

const Inventory = ({
  formHeader,
  visible,
  visibility,
  config,
  onOk,
  changeVisible,
  form: { getFieldDecorator, validateFields, getFieldsValue },
}) => {
  const turnOnButton = () => {
    const data = {
      ...getFieldsValue(),
    }
    let dataInventory = {}
    dataInventory.posOrder = {}
    dataInventory.posOrder.outOfStock = (data.outOfStock === true || data.outOfStock === 1 ? 1 : 0)
    if (JSON.stringify(dataInventory) === JSON.stringify(config)) {
      changeVisible('visible', 'Inventory')
    } else {
      changeVisible('hidden', 'Inventory')
    }
  }
  const saveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      let dataInventory = {}
      dataInventory.posOrder = {}
      dataInventory.posOrder.outOfStock = (data.outOfStock === true || data.outOfStock === 1 ? 1 : 0)
      onOk(formHeader, dataInventory)
    })
  }
  return (
    <Form layout='horizontal' className="ant-form-item-label-float-left">
      <Row style={{ margin: '5px 10px 5px 10px' }}>
        <Col lg={{ span: 9, offset: 1 }} md={{ span: 9, offset: 1 }} sm={{ span: 19 }}>
          <FormItem label='Enable Out of stock checkout' {...formItemLayout}>
            {getFieldDecorator('outOfStock', {
              initialValue: config.posOrder.outOfStock,
            })(<Switch defaultChecked={config.posOrder.outOfStock} onChange={turnOnButton} />)}
          </FormItem>
        </Col>
        <Col lg={{ span: 9, offset: 1 }} md={{ span: 9, offset: 1 }} sm={{ span: 19 }}>

        </Col>
      </Row>
      <Button type="primary" htmlType="submit" className="ant-form-save-width-half" onClick={saveClick} style={{ visibility: visibility, margin: '5px 5px 5px 5px' }}>
        Save
      </Button>
    </Form>
  )
}

Inventory.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  changeVisible: PropTypes.func
}

export default Form.create()(Inventory)