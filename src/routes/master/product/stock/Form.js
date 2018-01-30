import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Row, Col, Checkbox, Upload, Icon, Select, Menu, Dropdown, Modal, message } from 'antd'
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
      span: 9,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 7,
    },
    lg: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 15,
    },
    sm: {
      span: 11,
    },
    md: {
      span: 13,
    },
    lg: {
      span: 16,
    },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 7,
      offset: 0,
      push: 17,
    },
    sm: {
      span: 3,
      offset: 0,
      push: 16,
    },
    md: {
      span: 3,
      offset: 0,
      push: 17,
    },
    lg: {
      span: 2,
      offset: 0,
      push: 22,
    },
  },
}

const col = {
  lg: {
    span: 8,
    offset: 0,
  },
}

const formProductCategory = ({
  item = {},
  onSubmit,
  disabled,
  clickBrowse,
  modalType,
  activeKey,
  button,
  listCategory,
  showCategories,
  listBrand,
  showBrands,
  changeTab,
  ...listProps,
  ...filterProps,
  ...printProps,
  ...tabProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
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
        ...getFieldsValue(),
      }
      data.active = data.active === undefined || data.active === 0 || data.active === false ? 0 : 1
      data.trackQty = data.trackQty === undefined || data.trackQty === 0 || data.trackQty === false ? 0 : 1
      data.exception01 = data.exception01 === undefined || data.exception01 === 0 || data.exception01 === false ? 0 : 1
      if (data.productCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.productCode, data)
          },
          onCancel () {},
        })
      } else {
        message.warning("Product Code can't be null")
      }
    })
  }

  const brand = () => {
    showBrands()
  }

  const category = () => {
    showCategories()
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

  const productCategory = listCategory.length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  const productBrand = listBrand.length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []

  return (
    <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...col}>
              <FormItem label="Product Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('productCode', {
                  initialValue: item.productCode,
                  rules: [
                    {
                      required: true,
                      pattern: modalType === 'add' ? /^[A-Za-z0-9-._/]{3,30}$/i : /^[A-Za-z0-9-.() _/]{3,30}$/i ,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input disabled={disabled} maxLength={30} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sellPrice', {
                  initialValue: item.sellPrice,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Dummy Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('dummyCode', {
                  initialValue: item.dummyCode,
                  rules: [
                    {
                      required: true,
                      pattern: modalType === 'add' ? /^[A-Za-z0-9-._/]{3,30}$/i : /^[A-Za-z0-9-.() _/]{3,30}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={30} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Product Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('productName', {
                  initialValue: item.productName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[A-Za-z0-9-._/ ]{3,50}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={50} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Cost Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('costPrice', {
                  initialValue: item.costPrice,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Dummy Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('dummyName', {
                  initialValue: item.dummyName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[A-Za-z0-9-._/ ]{3,50}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={50} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Similar Name 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('otherName01', {
                  initialValue: item.otherName01,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Pre Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sellPricePre', {
                  initialValue: item.sellPricePre,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Location 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('location01', {
                  initialValue: item.location01,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Similar Name 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('otherName02', {
                  initialValue: item.otherName02,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Dist Price 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('distPrice01', {
                  initialValue: item.distPrice01,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Location 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('location02', {
                  initialValue: item.location02,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Category ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('categoryId', {
                  initialValue: item.categoryId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => category()}
                  mode="default"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{productCategory}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Dist Price 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('distPrice02', {
                  initialValue: item.distPrice02,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Exception" {...formItemLayout}>
                {getFieldDecorator('exception01', {
                  valuePropName: 'checked',
                  initialValue: item.exception01,
                })(<Checkbox>Exception</Checkbox>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Merk" hasFeedback {...formItemLayout}>
                {getFieldDecorator('brandId', {
                  initialValue: item.brandId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => brand()}
                  mode="default"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{productBrand}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Track Qty" {...formItemLayout}>
                {getFieldDecorator('trackQty', {
                  valuePropName: 'checked',
                  initialValue: item.trackQty,
                })(<Checkbox>Track</Checkbox>)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Image" {...formItemLayout}>
                {getFieldDecorator('productImage', {
                  initialValue: item.productImage,
                })(<Upload>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="barCode 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barCode01', {
                  initialValue: item.barCode01,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Alert Qty" hasFeedback {...formItemLayout}>
                {getFieldDecorator('alertQty', {
                  initialValue: item.alertQty,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="barCode 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barCode02', {
                  initialValue: item.barCode02,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Status" {...formItemLayout}>
                {getFieldDecorator('active', {
                  valuePropName: 'checked',
                  initialValue: item.active,
                })(<Checkbox>Active</Checkbox>)}
              </FormItem>
            </Col>
            <Col {...col} />
            <Col {...col} />
          </Row>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane tab="Browse" key="1" >
        <Filter {...filterProps} />
        <List {...listProps} />
      </TabPane>
    </Tabs>
  )
}

formProductCategory.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listCategory: PropTypes.object,
  listBrand: PropTypes.object,
  onSubmit: PropTypes.func,
  showBrands: PropTypes.func,
  showCategories: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
}

export default Form.create()(formProductCategory)
