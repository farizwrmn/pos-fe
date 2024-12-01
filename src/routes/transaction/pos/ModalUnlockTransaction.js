import React, { Component } from 'react'
import { Modal, Form, Row, message, Col, Input, Button } from 'antd'

const FormItem = Form.Item

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formItemLayout = {
  labelCol: {
    sm: { span: 10 },
    md: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

class ModalUnlockTransaction extends Component {
  render () {
    const {
      dispatch,
      showForm,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields
      },
      ...modalProps
    } = this.props

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        if (data.realization && data.realization.toLowerCase().replace(/^\s+|\s+$/gm, '') === 'saya paham') {
          Modal.confirm({
            title: 'Do you want to save this item?',
            onOk () {
              resetFields()
              dispatch({
                type: 'pos/unlockTransaction'
              })
            },
            onCancel () { }
          })
        } else {
          message.error('Masukkan kata yang benar "saya paham"')
        }
      })
    }

    const handleTransaction = () => {
      dispatch({
        type: 'pos/printLatestTransaction'
      })
    }

    return (
      <Modal {...modalProps}>
        <div>Popup ini bertujuan untuk mencegah terjadinya duplikat pada transaksi</div>
        <div>1. Tekan Tombol Print Transaksi Terakhir</div>
        <Button disabled={showForm} type="primary" onClick={() => handleTransaction()}>Print Transaksi Terakhir</Button>
        <div>{'2. Jika kamu sudah menyadari bahwa transaksi ini tidak double silahkan isi dengan "saya paham"'}</div>

        {showForm && (<Form layout="horizontal">
          <Row>
            <Col {...column}>
              <FormItem label="Realization" hasFeedback {...formItemLayout}>
                {getFieldDecorator('realization', {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input placeholder="saya paham" />)}
              </FormItem>
              <Button type="primary" onClick={handleSubmit}>Submit</Button>
            </Col>
          </Row>
        </Form>)}
      </Modal>
    )
  }
}

export default Form.create()(ModalUnlockTransaction)
