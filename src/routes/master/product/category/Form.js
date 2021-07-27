import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tree, Select, Row, Col, Modal, message, Checkbox, Upload, Icon } from 'antd'
import { arrayToTree } from 'utils'
import { IMAGEURL, rest } from 'utils/config.company'

const { apiCompanyURL } = rest
const FormItem = Form.Item
const Option = Select.Option
const TreeNode = Tree.TreeNode

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formProductCategory = ({
  lastTrans,
  item = {},
  onSubmit,
  onCancel,
  modalType,
  disabled,
  button,
  queryEditItem,
  showCategoriesParent,
  listCategory,
  listCategoryCurrent,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const productCategory = (listCategory || []).length > 0 ? (listCategory || []).map(c => <Option key={c.id}>{c.categoryName} ({c.categoryCode})</Option>) : []

  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
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

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data.categoryCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.categoryCode, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Product Category Code can't be null")
      }
    })
  }

  const category = () => {
    showCategoriesParent()
  }

  const handleClickTree = (event, id) => {
    Modal.confirm({
      title: 'Edit item ?',
      content: `You're gonna edit item ${event}`,
      onOk () {
        resetFields()
        queryEditItem(event, id)
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  const menuTree = arrayToTree((listCategoryCurrent || []).filter(_ => _.id !== null), 'id', 'categoryParentId')
  const levelMap = {}
  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.categoryParentId) {
          levelMap[item.id] = item.categoryParentId
        }
        return (
          <TreeNode key={item.categoryCode} title={(<div onClick={() => handleClickTree(item.categoryCode, item.id)} value={item.categoryCode}>{item.categoryName} ({item.categoryCode})</div>)}>
            {getMenus(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode key={item.categoryCode} title={(<div onClick={() => handleClickTree(item.categoryCode, item.id)} value={item.categoryCode}>{item.categoryName} ({item.categoryCode})</div>)}>
          {(!menuTree.includes(item)) && item.name}
        </TreeNode>
      )
    })
  }
  const categoryVisual = getMenus(menuTree)

  console.log('item', item)

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryCode', {
              initialValue: modalType === 'add' && typeof lastTrans === 'string' ? lastTrans : item.categoryCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9 _]{3,}$/,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input disabled={modalType === 'add' && typeof lastTrans === 'string' ? true : disabled} maxLength={10} autoFocus />)}
          </FormItem>
          <FormItem label="Category Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryName', {
              initialValue: item.categoryName,
              rules: [
                {
                  required: true,
                  pattern: /^.{3,20}$/,
                  message: 'Category Name must be between 3 and 20 characters'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Category Color" help="Usage in product sticker" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryColor', {
              initialValue: item.categoryColor,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input type="color" />)}
          </FormItem>
          <FormItem label="Category Parent" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryParentId', {
              initialValue: item.categoryParentId,
              rules: [
                {
                  required: false
                }
              ]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Parent of category"
              onFocus={category}
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{productCategory}
            </Select>)}
          </FormItem>
          <FormItem label="Image" {...formItemLayout}>
            {getFieldDecorator('categoryImage', {
              initialValue: item.categoryImage
                && item.categoryImage != null
                && item.categoryImage !== '"no_image.png"'
                && item.categoryImage !== 'no_image.png' ?
                {
                  fileList: JSON.parse(item.categoryImage).map((detail, index) => {
                    return ({
                      uid: index + 1,
                      name: detail,
                      status: 'done',
                      url: `${IMAGEURL}/${detail}`,
                      thumbUrl: `${IMAGEURL}/${detail}`
                    })
                  })
                }
                : item.categoryImage
            })(
              <Upload
                showUploadList={{
                  showPreviewIcon: true
                }}
                listType="picture"
                defaultFileList={
                  item.categoryImage
                    && item.categoryImage != null
                    && item.categoryImage !== '"no_image.png"'
                    && item.categoryImage !== 'no_image.png' ?
                    JSON.parse(item.categoryImage).map((detail, index) => {
                      return ({
                        uid: index + 1,
                        name: detail,
                        status: 'done',
                        url: `${IMAGEURL}/${detail}`,
                        thumbUrl: `${IMAGEURL}/${detail}`
                      })
                    })
                    : []
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
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="Loyalty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('loyaltyException', {
              valuePropName: 'checked',
              initialValue: item.loyaltyException === undefined ? true : item.loyaltyException
            })(<Checkbox />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        {(listCategoryCurrent || []).length > 0 &&
          <div>
            <strong style={{ fontSize: '15' }}> Current Category </strong>
            <br />
            <br />
            <Col {...column}>
              <div style={{ margin: '0px', width: '100 %', overflowY: 'auto', height: '300px' }}>
                <Tree
                  showLine
                  // onRightClick={handleChooseTree}
                  defaultExpandAll
                >
                  {categoryVisual}
                </Tree>
              </div>
            </Col>
          </div>}
      </Row>
    </Form>
  )
}

formProductCategory.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  showCategoriesParent: PropTypes.func.isRequired,
  button: PropTypes.string
}

export default Form.create()(formProductCategory)
