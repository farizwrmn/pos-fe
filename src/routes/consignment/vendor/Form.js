import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Select, Input, Modal, message } from 'antd'
import PasswordForm from '../components/PasswordForm'

const FormItem = Form.Item
const Option = Select.Option
const Confirm = Modal.confirm

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  formType,
  loading,
  modalState,
  selectedVendor,
  lastVendor,
  categoryList,
  cancelEdit,
  add,
  edit,
  resetPassword,
  handleModal,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: formType === 'edit' ? 12 : 21
      },
      sm: {
        offset: formType === 'edit' ? 17 : 22
      },
      md: {
        offset: formType === 'edit' ? 17 : 21
      },
      lg: {
        offset: formType === 'edit' ? 15 : 20
      }
    }
  }

  const handleCancel = () => {
    Confirm({
      title: 'Perubahan akan diurungkan',
      content: 'Kamu yakin?',
      onOk () {
        resetFields()
        cancelEdit()
      },
      onCancel () {

      }
    })
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (getFieldsValue().password !== getFieldsValue().passwordConfirmation && formType === 'add') {
        message.error('password tidak sama!')
        return
      }
      const fields = getFieldsValue()
      Confirm({
        title: 'Simpan Perubahan',
        content: 'Kamu yakin ingin menyimpan perubahan?',
        onOk () {
          if (formType === 'add') {
            add(fields, resetFields)
          } else {
            edit(fields, resetFields)
          }
        },
        onCancel () { }
      })
    })
  }

  const handleResetPassword = (password) => {
    resetPassword(password)
  }

  const changePassword = () => {
    handleModal()
  }

  const categoryOption = categoryList.length > 0 ? categoryList.map(record => (record.id !== 1 && <Option key={record.id} value={record.id}>{record.name}</Option>)) : []

  const validatePassword = (_, value) => {
    if (value !== getFieldsValue().password) {
      return Promise.reject(new Error('Password must be the same'))
    }
    return Promise.resolve()
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Tipe" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: selectedVendor.category_id || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select disabled={loading || formType === 'edit'}>
                {categoryOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="Kode Vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendorCode', {
              initialValue: formType === 'add' ? (
                `${getFieldsValue().type && getFieldsValue().type === 2 ? 'F' : 'V'}${String(lastVendor.id + 1).padStart(5, '0')}`
              ) : selectedVendor.vendor_code,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: selectedVendor.name || '',
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loading} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Tipe Identitas" hasFeedback {...formItemLayout}>
            {getFieldDecorator('identityType', {
              initialValue: selectedVendor.identityType || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select disabled={loading}>
                <Option value="NPWP">NPWP</Option>
                <Option value="KTP">KTP</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="Nomor Identitas" hasFeedback {...formItemLayout}>
            {getFieldDecorator('identityNumber', {
              initialValue: selectedVendor.identityNo || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 255
                }
              ]
            })(
              <Input disabled={loading} maxLength={255} />
            )}
          </FormItem>
          <FormItem label="Alamat" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address', {
              initialValue: selectedVendor.address || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 255
                }
              ]
            })(
              <Input disabled={loading} maxLength={255} />
            )}
          </FormItem>
          <FormItem label="Phone" hasFeedback {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: selectedVendor.phone || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input addonBefore="+62" disabled={loading} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Email" hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: selectedVendor.email || null,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9._-a-zA-Z0-9])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: 'The input is not valid E-mail!'
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loading} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Password" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: null,
              rules: [
                {
                  required: formType === 'add',
                  message: 'required'
                },
                {
                  min: 8,
                  message: 'password should have more than 8 char.'
                }
              ]
            })(
              formType === 'add' ? (
                <Input type="password" autoComplete="new-password" disabled={loading} />
              ) : (
                <Button type="primary" onClick={() => changePassword()} loading={loading}>Edit Password</Button>
              )
            )}
          </FormItem>
          {formType === 'add' && (
            <FormItem label="Password Confirmation" hasFeedback {...formItemLayout}>
              {getFieldDecorator('passwordConfirmation', {
                initialValue: null,
                rules: [
                  {
                    required: true,
                    message: 'required'
                  },
                  {
                    validator: validatePassword
                  }
                ]
              })(
                <Input type="password" autoComplete="new-password" disabled={loading} />
              )}
            </FormItem>
          )}
          <FormItem label="Nama Bank" hasFeedback {...formItemLayout}>
            {getFieldDecorator('bankName', {
              initialValue: selectedVendor.bank_name || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loading} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Nama Pemilik Rekening" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountName', {
              initialValue: selectedVendor.account_name || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loading} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Nomor Rekening" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountNumber', {
              initialValue: selectedVendor.account_number || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loading} maxLength={191} />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {formType === 'edit' && <Button type="danger" onClick={() => handleCancel()} disabled={loading}>Cancel</Button>}
            <Button type="primary" onClick={() => handleSubmit()} loading={loading}>{formType === 'add' ? 'Simpan' : 'Ubah'}</Button>
          </FormItem>
        </Col>
        <PasswordForm handleSubmitPassword={handleResetPassword} modalState={modalState} handleModal={handleModal} loading={loading} />
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
