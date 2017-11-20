import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Switch, Row, Col, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { lg: 14, md: 14, sm: 14, float: 'left' },
  wrapperCol: { lg: 14, md: 14, sm: 14, }
}

const Inventory = ({
  formHeader,
  visible,
  visibilityCommit,
  visibilitySave,
  config,
  onOk,
  changeVisible,
  form: { getFieldDecorator, validateFields, getFieldsValue },
}) => {
  Object.compare = function (obj1, obj2) {
    //Loop through properties in object 1
    for (var p in obj1) {
      //Check property exists on both objects
      if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

      switch (typeof (obj1[p])) {
        //Deep compare objects
        case 'object':
          if (!Object.compare(obj1[p], obj2[p])) return false;
          break;
        //Compare function code
        case 'function':
          if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
          break;
        //Compare values
        default:
          if (obj1[p] != obj2[p]) return false;
      }
    }

    //Check object 2 for any extra properties
    for (var p in obj2) {
      if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
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
      dataInventory.posOrder.editPurchase = (data.editPurchase === true || data.editPurchase === 1 ? 1 : 0)
      if (Object.compare(dataInventory, config)) {
        changeVisible('visible', 'Inventory')
        Modal.warning({
          title: 'No Changes',
          content: 'No Changes Detected'
        })
      } else {
        onOk(formHeader, dataInventory)      
        changeVisible('visible', 'Inventory')
      }
    })
  }
  return (
    <Form layout='horizontal' className="ant-form-item-label-float-left">
      <Row style={{ margin: '5px 10px 5px 10px' }}>
        <Col lg={{ span: 9, offset: 1 }} md={{ span: 9, offset: 1 }} sm={{ span: 19 }}>
          <FormItem label='Enable Out of stock checkout' {...formItemLayout}>
            {getFieldDecorator('outOfStock', {
              initialValue: config.posOrder.outOfStock,
            })(<Switch defaultChecked={config.posOrder.outOfStock} />)}
          </FormItem>
        </Col>
        <Col lg={{ span: 9, offset: 1 }} md={{ span: 9, offset: 1 }} sm={{ span: 19 }}>
          <FormItem label='Enable Edit Purchase' {...formItemLayout}>
            {getFieldDecorator('editPurchase', {
              initialValue: config.posOrder.editPurchase,
            })(<Switch defaultChecked={config.posOrder.editPurchase} />)}
          </FormItem>
        </Col>
      </Row>
      {visibilitySave && <Button type="primary" htmlType="submit" className="ant-form-save-width-half" onClick={saveClick} style={{ visibility: visibilitySave, margin: '5px 5px 5px 5px' }}>
        Save
      </Button>}
    </Form>
  )
}

Inventory.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  changeVisible: PropTypes.func,
  loading: PropTypes.object
}

export default Form.create()(Inventory)