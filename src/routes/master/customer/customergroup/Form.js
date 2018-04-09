import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Row, Col, Dropdown, Menu, Icon, Modal, message } from 'antd'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

const formItemLayout = {
  labelCol: {
    xs: {
      span: 13
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
      span: 11
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 17
    },
    sm: {
      offset: 19
    },
    md: {
      offset: 18
    },
    lg: {
      offset: 17
    }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formCustomerGroup = ({
  item = {},
  onSubmit,
  disabled,
  activeKey,
  button,
  clickBrowse,
  changeTab,
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
  const { show } = filterProps
  const { onShowHideSearch } = tabProps
  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
    handleReset()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data.groupCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data)
            setTimeout(() => {
              resetFields()
            }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Group Code can't be null")
      }
    })
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

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button> <Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  return (
    <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...column}>
              <FormItem label="Group Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('groupCode', {
                  initialValue: item.groupCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9_]{1,5}$/i,
                      message: 'a-z & 0-9'
                    }
                  ]
                })(<Input disabled={disabled} maxLength={5} autoFocus />)}
              </FormItem>
              <FormItem label="Group Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('groupName', {
                  initialValue: item.groupName,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="Browse" key="1" >
        <Filter {...filterProps} />
        <List {...listProps} />
      </TabPane>
    </Tabs>
  )
}

formCustomerGroup.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formCustomerGroup)
