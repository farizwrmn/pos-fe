import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button, Checkbox } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

// const formItemLayout = {
//   labelCol: {
//     span: 6,
//   },
//   wrapperCol: {
//     span: 18,
//   },
//   style: {
//     marginTop: '5px',
//     marginBottom: '5px'
//   }
// }

const PurchaseList = ({
  listSequence,
  generateSequence,
  notUsingWo,
  woNumber,
  usingWo,
  ...modalProps,
  formItemLayout,
  form: {
    getFieldDecorator,
    resetFields
  }
}) => {
  const getSequence = () => {
    const pad = (n, width, z) => {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }
    let maxNumber = pad(parseFloat(listSequence.seqValue), listSequence.maxNumber)
    let concatSequence = listSequence.seqCode + moment(listSequence.seqDate, 'YYYY-MM-DD').format('YYMM') + maxNumber
    return concatSequence
  }
  const onGenerate = () => {
    resetFields()
    generateSequence('WO')
  }
  const notUsing = (e) => {
    const { value } = e.target
    notUsingWo(false, value)
  }
  const disableUsingWo = (e) => {
    resetFields()
    notUsingWo(false, null)
  }
  return (
    <Form layout="horizontal">
      <FormItem label="Ref" help={woNumber === '' || woNumber === null ? 'you are not using Work Order' : 'you are using Work Order'} {...formItemLayout}>
        <Row>
          <Col span={20}>
            {getFieldDecorator('woReference', {
              initialValue: woNumber            
            })(<Input disabled={usingWo} onChange={(value) => notUsing(value)} style={{ width: '100%', height: '32px', backgroundColor: '#ffffff' }} />)}
          </Col>
          {/* <Col span={7}>
            <Button onClick={() => onGenerate()} type="primary" style={{ width: '100%', height: '32px' }}>Auto</Button>
          </Col> */}
          <Col span={4}>
            <Button icon="close" onClick={() => disableUsingWo()} type="dashed" style={{ width: '100%', height: '32px' }} className="bgcolor-red"/>
          </Col>
        </Row>
      </FormItem>
    </Form>
  )
}

PurchaseList.propTypes = {
  form: PropTypes.object,
}
export default Form.create()(PurchaseList)
