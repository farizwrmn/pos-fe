import React from 'react'
import PropTypes from 'prop-types'
import { IMAGEURL, rest } from 'utils/config.company'
import { arrayToTree } from 'utils'
import { Form, Input, Button, Tree, Checkbox, Select, Row, Col, message, Upload, Icon, Modal } from 'antd'

const { apiCompanyURL } = rest
const FormItem = Form.Item
const { Option } = Select
const TreeNode = Tree.TreeNode

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
  queryEditItem,
  item = {},
  onSubmit,
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

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
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

  const productCategory = (listK3ExpressCategory || []).length > 0 ? (listK3ExpressCategory || []).map(c => <Option key={c.id}>{c.categoryName} ({c.categoryCode})</Option>) : []

  const menuTree = arrayToTree((listK3ExpressCategory || []).filter(filtered => filtered.id !== null), 'id', 'categoryParentId')
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

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryCode', {
              initialValue: item.categoryCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9_]{3,}$/,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={10} autoFocus />)}
          </FormItem>
          <FormItem label="Category Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryName', {
              initialValue: item.categoryName,
              rules: [
                {
                  required: true,
                  pattern: /^.{3,20}$/,
                  message: 'Brand Name must be between 3 and 20 characters'
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
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{productCategory}
            </Select>)}
          </FormItem>
          <FormItem label="Image" {...formItemLayout}>
            {getFieldDecorator('categoryImage', {
              initialValue: modalType === 'edit'
                && item.categoryImage
                && item.categoryImage != null ?
                {
                  fileList: [{
                    uid: 0,
                    name: item.categoryImage,
                    status: 'done',
                    url: `${IMAGEURL}/${item.categoryImage}`,
                    thumbUrl: `${IMAGEURL}/${item.categoryImage}`
                  }]
                } : undefined,
              rules: [
                {
                  required: true
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
                    && item.categoryImage
                    && item.categoryImage != null ? [{
                      uid: 0,
                      name: item.categoryImage,
                      status: 'done',
                      url: `${IMAGEURL}/${item.categoryImage}`,
                      thumbUrl: `${IMAGEURL}/${item.categoryImage}`
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
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="Status" {...formItemLayout}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: item.active === undefined ? true : item.active
            })(<Checkbox>Active</Checkbox>)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        {(listK3ExpressCategory || []).length > 0 &&
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

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
