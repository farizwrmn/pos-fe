import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Select, InputNumber, Row, Col, Dropdown, Menu, Icon, Modal, message } from 'antd'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

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

const formCustomerType = ({
  item = {},
  onSubmit,
  disabled,
  clickBrowse,
  activeKey,
  button,
  listSellprice,
  ...tabProps,
  ...listProps,
  ...filterProps,
  ...printProps,
  changeTab,
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
      console.log('Submit')
      if (data.typeCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data)
          },
          onCancel () {}
        })
      } else {
        message.warning("Type Code can't be null")
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

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{ `${show ? 'Hide' : 'Show'} Search` }</Button> <Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  const children = listSellprice.length > 0 ? listSellprice.map(misc => <Option value={misc.miscName} key={misc.miscName}>{misc.miscName}</Option>) : []

  return (
    <Tabs activeKey={activeKey} {...tabProps} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...column}>
              <FormItem label="Type Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('typeCode', {
                  initialValue: item.typeCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9_]{1,5}$/i,
                      message: 'a-z & 0-9'
                    }
                  ]
                })(<Input disabled={disabled} maxLength={5} />)}
              </FormItem>
              <FormItem label="Type Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('typeName', {
                  initialValue: item.typeName,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem label="Discount 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPct01', {
                  initialValue: item.discPct01,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem label="Discount 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPct02', {
                  initialValue: item.discPct02,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem label="Discount 3" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPct03', {
                  initialValue: item.discPct03,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem label="Discount Nominal" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discNominal', {
                  initialValue: item.discNominal,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
              <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sellPrice', {
                  initialValue: item.sellPrice,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  optionFilterProp="children"
                  mode="default"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{children}
                </Select>)}
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

formCustomerType.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  showSellPrice: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
  listSellprice: PropTypes.object
}

export default Form.create()(formCustomerType)
