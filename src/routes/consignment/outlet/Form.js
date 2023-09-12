import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Modal, Input, Select } from 'antd'

const FormItem = Form.Item
const Confirm = Modal.confirm
const Option = Select.Option

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
  loadingEdit,
  loadingAdd,
  formType,
  currentOutlet,
  editData,
  insertData,
  cancelEdit,
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
        offset: formType === 'edit' ? 12 : 18
      },
      sm: {
        offset: formType === 'edit' ? 17 : 18
      },
      md: {
        offset: formType === 'edit' ? 17 : 18
      },
      lg: {
        offset: formType === 'edit' ? 15 : 18
      }
    }
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const fields = getFieldsValue()
      Confirm({
        title: 'Simpan Perubahan',
        content: 'Kamu yakin ingin menyimpan perubahan?',
        onOk () {
          if (formType === 'add') {
            insertData(fields, resetFields)
          } else {
            editData(fields, resetFields)
          }
        },
        onCancel () { }
      })
    })
  }

  const handleCancel = () => {
    Confirm({
      title: 'Urungkan perubahan',
      content: 'Kamu Yakin?',
      onOk () {
        cancelEdit()
      },
      onCancel () { }
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Kode Outlet" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outlet_code', {
              initialValue: currentOutlet.outlet_code || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Nama Outlet" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outlet_name', {
              initialValue: currentOutlet.outlet_name || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Alamat" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address', {
              initialValue: currentOutlet.address || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Jumlah Baris Box" hasFeedback {...formItemLayout}>
            {getFieldDecorator('box_row', {
              initialValue: currentOutlet.box_rows_count || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Jumlah Kolom Box" hasFeedback {...formItemLayout}>
            {getFieldDecorator('box_column', {
              initialValue: currentOutlet.box_columns_count || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Komisi Makanan (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('commission_food', {
              initialValue: currentOutlet.commission_food || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Komisi Non Makanan (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('commission_non_food', {
              initialValue: currentOutlet.commission_non_food || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Include Payment Charge" hasFeedback {...formItemLayout}>
            {getFieldDecorator('include_payment_charge', {
              initialValue: currentOutlet ? currentOutlet.include_payment_charge : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select disabled={loadingAdd || loadingEdit}>
                <Option key={0} value={0}>Tidak</Option>
                <Option key={1} value={1}>Ya</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="Nama Bank" hasFeedback {...formItemLayout}>
            {getFieldDecorator('bank_name', {
              initialValue: currentOutlet.bank_name || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Nama Pemilik Rekening" hasFeedback {...formItemLayout}>
            {getFieldDecorator('account_name', {
              initialValue: currentOutlet.account_name || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Nomor Rekening" hasFeedback {...formItemLayout}>
            {getFieldDecorator('account_number', {
              initialValue: currentOutlet.account_number || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Nomor Handphone" hasFeedback {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: currentOutlet.phone || null,
              rules: [
                {
                  required: true
                },
                {
                  max: 191
                }
              ]
            })(
              <Input disabled={loadingAdd || loadingEdit} maxLength={191} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box A" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceA', {
              initialValue: currentOutlet.default_price_box_a || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box B" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceB', {
              initialValue: currentOutlet.default_price_box_b || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box C" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceC', {
              initialValue: currentOutlet.default_price_box_c || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box D" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceD', {
              initialValue: currentOutlet.default_price_box_d || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box E" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceE', {
              initialValue: currentOutlet.default_price_box_e || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box F" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceF', {
              initialValue: currentOutlet.default_price_box_f || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box G" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceG', {
              initialValue: currentOutlet.default_price_box_g || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box H" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceH', {
              initialValue: currentOutlet.default_price_box_h || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box I" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceI', {
              initialValue: currentOutlet.default_price_box_i || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box J" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceJ', {
              initialValue: currentOutlet.default_price_box_j || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box K" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceK', {
              initialValue: currentOutlet.default_price_box_k || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box L" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceL', {
              initialValue: currentOutlet.default_price_box_l || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box M" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceM', {
              initialValue: currentOutlet.default_price_box_m || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem label="Harga Sewa Box N" hasFeedback {...formItemLayout}>
            {getFieldDecorator('priceN', {
              initialValue: currentOutlet.default_price_box_n || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="number" disabled={loadingAdd || loadingEdit} />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {formType === 'edit' && <Button type="danger" onClick={() => handleCancel()} disabled={loadingAdd || loadingEdit}>Cancel</Button>}
            <Button type="primary" onClick={() => handleSubmit()} loading={loadingAdd || loadingEdit}>{formType === 'add' ? 'Simpan' : 'Ubah'}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
