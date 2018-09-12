import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Modal, Input, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  },
  style: {
    marginBottom: '5px'
  }
}
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
  // listSequence,
  // generateSequence,
  dispatch,
  notUsingWo,
  woNumber,
  usingWo,
  currentItem = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {},
  form: {
    getFieldDecorator
    // resetFields
  }
}) => {
  const notUsing = (e) => {
    const { value } = e.target
    notUsingWo(false, value)
  }
  const handleCancel = () => {
    Modal.confirm({
      title: 'Reset unsaved process',
      content: 'this action will reset your current process',
      onOk () {
        dispatch({
          type: 'pos/removeTrans'
        })
      }
    })
  }
  // const disableUsingWo = () => {
  //   resetFields()
  //   notUsingWo(false, null)
  // }
  return (
    <Form layout="horizontal">
      {!currentItem.id && (<FormItem label="Ref" {...formItemLayout}>
        {getFieldDecorator('woReference', {
          initialValue: woNumber
        })(<Input
          disabled={usingWo}
          maxLength={30}
          onChange={value => notUsing(value)}
          style={{ width: '100%', height: '32px', backgroundColor: '#ffffff' }}
        />)}
      </FormItem>)}
      <FormItem label="Wo No" {...formItemLayout}>
        {getFieldDecorator('woNo', {
          initialValue: currentItem.woNo
        })(<Input
          disabled
          maxLength={30}
          onChange={value => notUsing(value)}
          style={{ width: '100%', height: '32px', backgroundColor: '#ffffff' }}
        />)}
      </FormItem>
      <FormItem label="Time In" {...formItemLayout}>
        {getFieldDecorator('timeIn', {
          initialValue: currentItem.timeIn ? moment.utc(currentItem.timeIn).format('YYYY-MM-DD HH:mm:ss') : null
        })(<Input
          disabled
          maxLength={30}
          onChange={value => notUsing(value)}
          style={{ width: '100%', height: '32px', backgroundColor: '#ffffff' }}
        />)}
      </FormItem>
      <FormItem label="" {...formItemLayout}>
        <Button onClick={handleCancel} type="danger">Clear WorkOrder</Button>
      </FormItem>
    </Form>
  )
}

PurchaseList.propTypes = {
  form: PropTypes.object
}
export default Form.create()(PurchaseList)
