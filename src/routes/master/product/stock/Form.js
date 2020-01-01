import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Button, Row, Col, Checkbox, Upload, Icon, Select, Modal, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 8 }
}

const formProductCategory = ({
  item = {},
  onSubmit,
  onCancel,
  disabled,
  modalType,
  button,
  listCategory,
  showCategories,
  listBrand,
  showBrands,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 17 : 22
      },
      md: {
        offset: modalType === 'edit' ? 18 : 22
      },
      lg: {
        offset: modalType === 'edit' ? 11 : 19
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.active = !data.active || data.active === 0 || data.active === false ? 0 : 1
      data.trackQty = !data.trackQty || data.trackQty === 0 || data.trackQty === false ? 0 : 1
      data.exception01 = !data.exception01 || data.exception01 === 0 || data.exception01 === false ? 0 : 1
      data.usageTimePeriod = data.usageTimePeriod || 0
      data.usageMileage = data.usageMileage || 0
      let valid = true
      if (modalType === 'add') {
        if (data.productCode !== data.dummyCode) {
          valid = false
          message.warning('Product Code does not match with Dummy Code!')
        }
      }
      if (valid) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.productCode, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      }
    })
  }

  const brand = () => {
    showBrands()
  }

  const category = () => {
    showCategories()
  }

  const productCategory = (listCategory || []).length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  const productBrand = (listBrand || []).length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []

  const changeProductCode = (e) => {
    const { value } = e.target
    setFieldsValue({ dummyCode: value })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Product Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productCode', {
              initialValue: item.productCode,
              rules: [
                {
                  required: true,
                  pattern: modalType === 'add' ? /^[a-z0-9/-]{3,30}$/i : /^[A-Za-z0-9-.,() _/]{3,30}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input disabled={disabled} maxLength={30} onChange={e => changeProductCode(e)} autoFocus />)}
          </FormItem>
          <FormItem label="Product Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productName', {
              initialValue: item.productName,
              rules: [
                {
                  required: true,
                  pattern: /^[A-Za-z0-9-._/ ]{3,50}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Location 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('location01', {
              initialValue: item.location01
            })(<Input />)}
          </FormItem>
          <FormItem label="Location 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('location02', {
              initialValue: item.location02
            })(<Input />)}
          </FormItem>
          <FormItem label="Category ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryId', {
              initialValue: item.categoryId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              optionFilterProp="children"
              onFocus={() => category()}
              mode="default"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{productCategory}
            </Select>)}
          </FormItem>
          <FormItem label="Merk" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brandId', {
              initialValue: item.brandId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              optionFilterProp="children"
              onFocus={() => brand()}
              mode="default"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{productBrand}
            </Select>)}
          </FormItem>
          <FormItem label="Usage Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('usageTimePeriod', {
              initialValue: item.usageTimePeriod,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,10})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber min={0} maxLength={10} placeholder="day(s)" style={{ width: '36%' }} />)}
            {getFieldDecorator('usageMileage', {
              initialValue: item.usageMileage,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,15})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber min={0} maxLength={15} placeholder="km" style={{ width: '60%', marginRight: 0 }} />)}
          </FormItem>
          <FormItem label="Status" {...formItemLayout}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: item.active
            })(<Checkbox>Active</Checkbox>)}
          </FormItem>
          <FormItem label="Section Width" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sectionWidth', {
              initialValue: item.sectionWidth
            })(<Input />)}
          </FormItem>
        </Col>
        <Col {...column} >
          <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sellPrice', {
              initialValue: item.sellPrice,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Cost Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('costPrice', {
              initialValue: item.costPrice,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Pre Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sellPricePre', {
              initialValue: item.sellPricePre,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Dist Price 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice01', {
              initialValue: item.distPrice01,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Dist Price 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice02', {
              initialValue: item.distPrice02,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Dist Price 3" hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice03', {
              initialValue: item.distPrice03,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Track Qty" {...formItemLayout}>
            {getFieldDecorator('trackQty', {
              valuePropName: 'checked',
              initialValue: item.trackQty
            })(<Checkbox>Track</Checkbox>)}
          </FormItem>
          <FormItem label="Alert Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alertQty', {
              initialValue: item.alertQty,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem />
          <FormItem label="Aspect Ratio" hasFeedback {...formItemLayout}>
            {getFieldDecorator('aspectRatio', {
              initialValue: item.aspectRatio
            })(<Input />)}
          </FormItem>
        </Col>
        <Col {...column} >
          <FormItem label="Dummy Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('dummyCode', {
              initialValue: item.dummyCode,
              rules: [
                {
                  required: true,
                  pattern: modalType === 'add' ? /^[A-Za-z0-9-._/]{3,30}$/i : /^[A-Za-z0-9-.() _/]{3,30}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={30} />)}
          </FormItem>
          <FormItem label="Dummy Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('dummyName', {
              initialValue: item.dummyName,
              rules: [
                {
                  required: true,
                  pattern: /^[A-Za-z0-9-._/ ]{3,50}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Similar Name 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('otherName01', {
              initialValue: item.otherName01
            })(<Input />)}
          </FormItem>
          <FormItem label="Similar Name 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('otherName02', {
              initialValue: item.otherName02
            })(<Input />)}
          </FormItem>
          <FormItem label="barCode 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('barCode01', {
              initialValue: item.barCode01
            })(<Input />)}
          </FormItem>
          <FormItem label="barCode 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('barCode02', {
              initialValue: item.barCode02
            })(<Input />)}
          </FormItem>
          <FormItem label="Exception" {...formItemLayout}>
            {getFieldDecorator('exception01', {
              valuePropName: 'checked',
              initialValue: item.exception01
            })(<Checkbox>Exception</Checkbox>)}
          </FormItem>
          <FormItem label="Image" {...formItemLayout}>
            {getFieldDecorator('productImage', {
              initialValue: item.productImage
            })(
              <Upload>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="Rim Diameter" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rimDiameter', {
              initialValue: item.rimDiameter
            })(<Input />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

formProductCategory.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  modalType: PropTypes.string,
  item: PropTypes.object,
  listCategory: PropTypes.object,
  listBrand: PropTypes.object,
  onSubmit: PropTypes.func,
  showBrands: PropTypes.func,
  showCategories: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formProductCategory)
