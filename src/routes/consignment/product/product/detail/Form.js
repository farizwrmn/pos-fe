import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Select, Modal, Input, Upload, Icon, message } from 'antd'
import { CONSIGNMENTIMAGEURL, IMAGEURL, rest } from 'utils/config.company'

const FormItem = Form.Item
const Confirm = Modal.confirm
const TextArea = Input.TextArea
const Option = Select.Option

const { apiCompanyURL } = rest

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
  lg: { span: 24 },
  xl: { span: 24 }
}

const FormCounter = ({
  categoryList,
  subCategoryList,
  formType,
  selectedProduct,
  cancelEdit,
  onSubmit,
  form: {
    getFieldDecorator,
    getFieldsValue
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

  const handleSubmit = () => {
    const fields = getFieldsValue()
    Confirm({
      title: 'Simpan Perubahan',
      content: 'Kamu yakin ingin menyimpan perubahan?',
      onOk () {
        onSubmit(fields)
      },
      onCancel () { }
    })
  }

  const categoryOption = categoryList.length > 0 ? categoryList.map(record => <Option key={record.id} value={record.id}>{record.name}</Option>) : []

  const subCategoryOption = subCategoryList.length > 0 ? subCategoryList.map(record => <Option key={record.id} value={record.id}>{record.name}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Product Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productCode', {
              initialValue: selectedProduct.product_code,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Product Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productName', {
              initialValue: selectedProduct.product_name,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Category" hasFeedback {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: selectedProduct.category_id,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Select >
                {categoryOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="Sub Category" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subCategory', {
              initialValue: selectedProduct.subcategory_id,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Select >
                {subCategoryOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: selectedProduct.description,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <TextArea />
            )}
          </FormItem>
          <FormItem label="Barcode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('barcode', {
              initialValue: selectedProduct.barcode,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="No. BPOM/PIRT" hasFeedback {...formItemLayout}>
            {getFieldDecorator('noLicense', {
              initialValue: selectedProduct.noLicense,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Weight" hasFeedback {...formItemLayout}>
            {getFieldDecorator('weight', {
              initialValue: selectedProduct.weight,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Photo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('photo', {
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Upload
                showUploadList={{
                  showPreviewIcon: true
                }}
                listType="picture"
                defaultFileList={
                  selectedProduct.productImage
                    && selectedProduct.productImage != null ?
                    [{
                      uid: 0,
                      name: selectedProduct.productImage,
                      status: 'done',
                      url: `${String(IMAGEURL)}/${selectedProduct.productImage}`,
                      thumbUrl: `${String(IMAGEURL)}/${selectedProduct.productImage}`
                    }]
                    : selectedProduct.photo
                      && selectedProduct.photo != null ?
                      [{
                        uid: 0,
                        name: selectedProduct.photo,
                        status: 'done',
                        url: `${String(CONSIGNMENTIMAGEURL)}/${selectedProduct.photo}`,
                        thumbUrl: `${String(CONSIGNMENTIMAGEURL)}/${selectedProduct.photo}`
                      }]
                      : undefined
                }
                action={`${apiCompanyURL}/time/time`}
                onPreview={file => console.log('file', file)}
                onChange={(info) => {
                  if (info.file.status !== 'uploading') {
                    console.log('pending', info.fileList)
                  }
                  if (info.file.status === 'done') {
                    console.log('success', info)
                    message.success(`${info.file.name} file staged success`)
                  } else if (info.file.status === 'error') {
                    console.log('error', info)
                    message.error(`${info.file.name} file staged failed.`)
                  }
                }}
              >
                <Button>
                  <Icon type="upload" /> upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {formType === 'edit' && <Button type="danger" onClick={() => cancelEdit()}>Cancel</Button>}
            <Button type="primary" onClick={() => handleSubmit()}>{formType === 'add' ? 'Simpan' : 'Ubah'}</Button>
          </FormItem>
        </Col>
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
