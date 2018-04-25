import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tree, Select, Tabs, Row, Col, Menu, Icon, Dropdown, Modal, message } from 'antd'
import { arrayToTree } from 'utils'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const TreeNode = Tree.TreeNode

const formItemLayout = {
  labelCol: {
    xs: {
      span: 9
    },
    sm: {
      span: 8
    },
    md: {
      span: 7
    }
  },
  wrapperCol: {
    xs: {
      span: 15
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formProductCategory = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  disabled,
  activeKey,
  button,
  changeTab,
  queryEditItem,
  clickBrowse,
  showCategoriesParent,
  listCategory,
  listCategoryCurrent,
  ...listProps,
  ...filterProps,
  ...printProps,
  ...tabProps,
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

  const { show } = filterProps
  const { onShowHideSearch } = tabProps
  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
    handleReset()
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
            setTimeout(() => {
              resetFields()
            }, 500)
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
  const browse = () => {
    clickBrowse()
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  // const handleChooseTree = (e) => {
  //   const { eventKey } = e.node.props
  //   queryEditItem(eventKey)
  // }

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

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button><Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)
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

  return (
    <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...column}>
              <FormItem label="Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('categoryCode', {
                  initialValue: item.categoryCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9_]{2,10}$/,
                      message: 'a-Z & 0-9'
                    }
                  ]
                })(<Input disabled={disabled} maxLength={10} autoFocus />)}
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
      </TabPane>
      <TabPane tab="Browse" key="1" >
        <Filter {...filterProps} />
        <List {...listProps} />
      </TabPane>
    </Tabs >
  )
}

formProductCategory.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  showCategoriesParent: PropTypes.func.isRequired,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formProductCategory)
