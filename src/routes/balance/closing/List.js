import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Modal, InputNumber, Row, Col, message } from 'antd'
import { lstorage } from 'utils'
import {
  BALANCE_TYPE_TRANSACTION
} from 'utils/variable'
import FormHeader from './Form'
import AdvanceForm from './AdvanceForm'
import ConfirmationDialog from './ConfirmationDialog'

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

// const FormLabel = () => {
//   return (
//     <Row label={(<div />)} hasFeedback {...formItemLayout}>
//       <Col {...formItemLayout.labelCol} />
//       <Col {...formItemLayout.wrapperCol}>
//         <Row>
//           <Col span={8}><div>Sales</div></Col>
//         </Row>
//       </Col>
//     </Row>
//   )
// }

const FormComponent = ({
  label,
  name,
  getFieldDecorator
}) => {
  return (
    <FormItem label={label} hasFeedback {...formItemLayout}>
      <Row>
        <Col span={8}>
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
                disabled
                min={0}
                style={{ width: '60%' }}
                formatter={value => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value)}
                parser={value => (value ? value.replace(/[^0-9]/g, '') : value)}
              />
            )}
          </div>
        </Col>
      </Row>
    </FormItem>
  )
}

const List = ({
  visible,
  item,
  list,
  listPhysicalMoneyDeposit,
  loading,
  listOpts = [],
  listShift,
  listUser,
  listSetoran,
  user,
  dispatch,
  button,
  onSubmit,
  onVisible,
  closeVisible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue
  }
}) => {
  const handleOpenVisible = () => {
    validateFields((errors) => {
      if (errors) {
        if (errors.approveUserId) {
          message.error(errors.approveUserId.errors[0].message)
        }
        return
      }
      onVisible()
    })
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      // data.detail = list
      data.setoranDetail = list
      const readableDataSetoran = listSetoran.map(item => ({
        type: item.type,
        amount: item.edcAmount || item.voidAmount,
        total: item.edcTotal || item.voidTotal,
        status: item.status
      }))

      data.listSetoran = readableDataSetoran
      let listAmount = list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0)
      if (listAmount < 0) {
        message.error('Masukkan jumlah lembar uang tunai yang valid')
        return
      }
      onSubmit(data)
      resetFields()
      closeVisible()
    })
  }

  const formComponentProps = {
    item,
    listShift,
    listUser,
    form: {
      getFieldDecorator
    }
  }
  const advanceFormProps = {
    dispatch,
    listSetoran,
    list,
    listDeposit: listPhysicalMoneyDeposit,
    form: {
      getFieldDecorator,
      setFieldsValue
    },
    setCashValue (amount) {
      setFieldsValue({
        'detail[C][balanceIn]': amount
      })
    }
  }
  const confirmationDialogProps = {
    dispatch,
    listSetoran,
    list,
    listDeposit: listPhysicalMoneyDeposit,
    setCashValue (amount) {
      setFieldsValue({
        'detail[C][balanceIn]': amount
      })
    }
  }

  const formData = {
    ...getFieldsValue()
  }
  const filterShift = listShift && listShift.length >= 0 && listShift.filter(item => item.id === formData.shiftId)
  const itemShift = filterShift && filterShift[0] ? filterShift[0] : null
  const itemCashier = user
  return (
    <div>
      <Modal
        width={1200}
        okText="Ok"
        cancelText="Cancel"
        title="Konfirmasi penutupan setoran"
        visible={visible}
        onOk={() => handleSubmit()}
        onCancel={() => closeVisible()}
      >
        {/* Shift */}
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Shift: {itemShift ? itemShift.shiftName : 'N/A'}</p>
        {/* Cahsier Name */}
        <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1em' }}>Nama Cashier: {itemCashier ? itemCashier.username : 'N/A'}</p>
        <ConfirmationDialog {...confirmationDialogProps} />
      </Modal>
      <Form layout="horizontal">
        <FormHeader {...formComponentProps} />
        {/* <FormLabel /> */}
        <AdvanceForm {...advanceFormProps} />
        <div style={{ marginTop: '1em', marginLeft: '11em' }}>
          {listOpts && listOpts.map((detail) => {
            const filteredValue = item && item.transaction ? item.transaction.filter(filtered => filtered.balanceType === BALANCE_TYPE_TRANSACTION && filtered.paymentOptionId === detail.id) : []
            if (filteredValue && filteredValue[0]) {
              return (
                <FormComponent
                  defaultValue={filteredValue}
                  getFieldDecorator={getFieldDecorator}
                  label={detail.typeName}
                  name={detail.typeCode}
                // previous value Cash
                // label="Subtotal"
                />
              )
            }
            return null
          })}
        </div>
        <Button type="primary" disabled={loading.effects['balance/closed']} onClick={() => handleOpenVisible()}>{button}</Button>
      </Form>
    </div>
  )
}

List.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
}

export default Form.create()(List)
