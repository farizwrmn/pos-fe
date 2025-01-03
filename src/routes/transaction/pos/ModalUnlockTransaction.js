import React, { Component } from 'react'
import { Modal, Form, Row, message, Col, Checkbox, Button } from 'antd'

const FormItem = Form.Item

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 }
}

const formItemLayout = {
  labelCol: {
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 16 }
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
        if (data.realization) {
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
          message.error('Checkbox harus di centang')
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
              <FormItem label="Realization" {...formItemLayout}>
                {getFieldDecorator('realization', {
                  valuePropName: 'checked'
                })(<Checkbox>Transaksi sebelumnya tidak sama dengan yang ini</Checkbox>)}
              </FormItem>
              <Button type="primary" onClick={handleSubmit}>Lanjutkan ke Pembayaran</Button>
            </Col>
          </Row>
        </Form>)}
      </Modal>
    )
  }
}

export default Form.create()(ModalUnlockTransaction)
