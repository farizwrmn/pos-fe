import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Row, Col, Menu, Icon, Dropdown, message, Modal } from 'antd'
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

const formProductBrand = ({
  item = {},
  onSubmit,
  disabled,
  activeKey,
  clickBrowse,
  button,
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
  const { onShowHideSearch } = tabProps
  const { show } = filterProps
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
      if (data.brandCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.brandCode, data)
          },
          onCancel () { }
        })
      } else {
        message.warning("Product Brand Code can't be null")
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

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button><Dropdown overlay={menu}>
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
              <FormItem label="Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('brandCode', {
                  initialValue: item.brandCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9_]{3,}$/,
                      message: 'a-Z & 0-9'
                    }
                  ]
                })(<Input disabled={disabled} maxLength={10} autoFocus />)}
              </FormItem>
              <FormItem label="Brand Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('brandName', {
                  initialValue: item.brandName,
                  rules: [
                    {
                      required: true,
                      pattern: /^.{3,20}$/,
                      message: 'Brand Name must be between 3 and 20 characters'
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

formProductBrand.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  clickBrowse: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formProductBrand)
