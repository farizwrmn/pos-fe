import React from 'react'
import PropTypes from 'prop-types'
import { arrayToTree } from 'utils'
import { Form, Input, Button, Tree, Checkbox, Select, Row, Col, Modal, Upload, message, Icon } from 'antd'
import { IMAGEURL, rest } from 'utils/config.company'
import TextArea from 'antd/lib/input/TextArea'

const FormItem = Form.Item
const { Option } = Select
const TreeNode = Tree.TreeNode

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
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  listK3ExpressCategory,
  listBrand,
  listProductConsignment,
  dispatch,
  productDetail,
  editItem,
  item = {},
  onSubmit,
  onGetDetail,
  onCancel,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleEnter = async () => {
    const productCode = getFieldsValue().productCode
    await onGetDetail(productCode)
  }

  const handleClearForm = () => {
    dispatch({
      type: 'expressProductConsignment/updateState',
      payload: {
        productDetail: []
      }
    })
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (getFieldsValue().description.length > 300) {
        console.log(getFieldsValue().description.length)
        return
      }
      const data = {
        ...getFieldsValue(),
        categoryName: (listK3ExpressCategory.filter(filter => filter.id === parseInt(getFieldsValue().expressCategoryId, 10)))[0].categoryName,
        brandName: (listBrand.filter(filter => filter.id === parseInt(getFieldsValue().expressBrandId, 10)))[0].brandName,
        productId: productDetail.id
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
          resetFields()
          dispatch({
            type: 'expressProductConsignment/updateState',
            payload: {
              productDetail: []
            }
          })
        },
        onCancel () { }
      })
    })
  }

  const handleClickTree = (item) => {
    Modal.confirm({
      title: 'Edit item ?',
      content: `You're gonna edit item ${item.productName}`,
      onOk () {
        resetFields()
        editItem(item)
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  const productCategory = (listK3ExpressCategory || []).length > 0 ? (listK3ExpressCategory || []).map(c => <Option key={c.id} value={c.id}>{c.categoryName} ({c.categoryCode})</Option>) : []
  const productBrand = (listBrand || []).length > 0 ? (listBrand || []).map(b => <Option key={b.id} value={b.id}>{b.brandName} ({b.brandCode})</Option>) : []

  const menuTree = arrayToTree((listProductConsignment || []).filter(filtered => filtered.id !== null), 'id')

  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      return (
        <TreeNode key={item.id} title={(<div onClick={() => handleClickTree(item)} value={item.productCode}>{item.productName} ({item.productCode})</div>)}>
          {(!menuTree.includes(item)) && item.productName}
        </TreeNode>
      )
    })
  }

  const productVisual = getMenus(menuTree)

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Product Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productCode', {
              initialValue: productDetail.product_code !== undefined ? productDetail.product_code : item.productCode ? item.productCode : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input autoFocus onPressEnter={() => handleEnter()} disabled={productDetail.product_code !== undefined || modalType === 'edit'} />)}
          </FormItem>
          <FormItem label="Product Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productName', {
              initialValue: productDetail.product_name !== undefined ? productDetail.product_name : item.productName ? item.productName : null,
              rules: [
                {
                  required: true,
                  pattern: /^.{3,20}$/,
                  message: 'Product Name must be between 3 and 20 characters'
                }
              ]
            })(<Input disabled={productDetail.product_code === undefined && modalType !== 'edit'} />)}
          </FormItem>
          <FormItem label="Image" {...formItemLayout}>
            {getFieldDecorator('productImage', {
              initialValue: modalType === 'edit'
                && item.productImage
                && item.productImage != null ?
                {
                  fileList: [{
                    uid: 0,
                    name: item.productImage,
                    status: 'done',
                    url: `${IMAGEURL}/${item.productImage}`,
                    thumbUrl: `${IMAGEURL}/${item.productImage}`
                  }]
                } : undefined,
              rules: [
                {
                  required: true,
                  message: 'Product image required'
                }
              ]
            })(
              <Upload
                showUploadList={{
                  showPreviewIcon: true
                }}
                listType="picture"
                defaultFileList={
                  modalType === 'edit'
                    && item.productImage
                    && item.productImage != null ? [{
                      uid: 0,
                      name: item.productImage,
                      status: 'done',
                      url: `${IMAGEURL}/${item.productImage}`,
                      thumbUrl: `${IMAGEURL}/${item.productImage}`
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
                <Button disabled={productDetail.product_code === undefined && modalType !== 'edit'}>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="Express Category" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expressCategoryId', {
              initialValue: productDetail.subcategory_id !== undefined ? productDetail.subcategory_id : item.expressCategoryId ? item.expressCategoryId : undefined,
              rules: [
                {
                  required: true,
                  message: 'Express category required'
                }
              ]
            })(<Select
              disabled={productDetail.product_code === undefined && modalType !== 'edit'}
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Express Category"
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{productCategory}
            </Select>)}
          </FormItem>
          <FormItem label="Express Brand" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expressBrandId', {
              initialValue: item.expressBrandId ? item.expressBrandId : undefined,
              rules: [
                {
                  required: true,
                  message: 'Express brand required'
                }
              ]
            })(<Select
              disabled={productDetail.product_code === undefined && modalType !== 'edit'}
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Express Brand"
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{productBrand}
            </Select>)}
          </FormItem>
          <FormItem label="Weight (e. 100 g)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('weight', {
              initialValue: productDetail.weight !== undefined ? productDetail.weight : item.weight ? item.weight : null,
              rules: [
                {
                  required: true,
                  message: 'Weight required'
                }
              ]
            })(<Input disabled={productDetail.product_code === undefined && modalType !== 'edit'} />)}
          </FormItem>
          <FormItem label="Barcode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('barcode', {
              initialValue: productDetail.barcode !== undefined ? productDetail.barcode : item.barcode ? item.barcode : null,
              rules: [
                {
                  required: true,
                  barcode: 'Barcode required'
                }
              ]
            })(<Input disabled={productDetail.product_code === undefined && modalType !== 'edit'} />)}
          </FormItem>
          <FormItem label="Product Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: productDetail.description !== undefined ? productDetail.description : item.description !== undefined ? item.description : null,
              rules: [
                {
                  required: false
                }
              ]
            })(<TextArea rows={4} disabled={productDetail.product_code === undefined && modalType !== 'edit'} maxLength={255} />)}
          </FormItem>
          <FormItem label="Status" {...formItemLayout}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: item.active === undefined ? true : item.active
            })(<Checkbox disabled={productDetail.product_code === undefined && modalType !== 'edit'}>Active</Checkbox>)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            {productDetail.product_code !== undefined && <Button type="ghost" style={{ margin: '0 10px' }} onClick={() => { handleClearForm() }}>clear form</Button>}
            <Button type="primary" onClick={handleSubmit} disabled={productDetail.product_code === undefined && modalType !== 'edit'}>{button}</Button>
          </FormItem>
        </Col>
        {(listProductConsignment || []).length > 0 &&
          <div>
            <strong style={{ fontSize: '15' }}> Current Product </strong>
            <br />
            <br />
            <Col {...column}>
              <div style={{ margin: '0px', width: '100 %', overflowY: 'auto', height: '300px' }}>
                <Tree
                  showLine
                  // onRightClick={handleChooseTree}
                  defaultExpandAll
                >
                  {productVisual}
                </Tree>
              </div>
            </Col>
          </div>}
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
