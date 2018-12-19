import React from 'react'
import { Form, Tabs, Modal, Row, Col, Input, InputNumber, Button } from 'antd'

const TabPane = Tabs.TabPane
const FormItem = Form.Item

const FormCustomer = ({
  ...modalProps,
  listBrand,
  listCategory,
  currentModal,
  item,
  onCancel,
  onSubmit,
  onShowModalCopy,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const getCurrentData = () => {
    const data = getFieldsValue()
    let newData = []
    newData.brand = data.targetBrandSales.map((x, index) => ({
      brandId: data.brandId[index],
      month: currentModal + 1,
      targetSales: x,
      targetSalesQty: data.targetBrandSalesQty[index]
    }))
    newData.category = data.targetCategorySales.map((x, index) => ({
      categoryId: data.categoryId[index],
      month: currentModal + 1,
      targetSales: x,
      targetSalesQty: data.targetCategorySalesQty[index]
    }))
    newData.year = item.year
    newData.description = item.description
    newData.id = item.id

    return Object.assign({}, newData)
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getCurrentData()
      onSubmit(data)
    })
  }
  const modalOpts = {
    onOk: handleOk,
    onCancel,
    ...modalProps
  }

  return (
    <Modal
      footer={[
        <Button key="back" size="large" onClick={onCancel}>Cancel</Button>,
        <Button key="submit" type="primary" size="large" onClick={handleOk}>
          Save
        </Button>
      ]}
      {...modalOpts}
    >
      <Form layout="vertical">
        <Tabs type="card"
          tabBarExtraContent={<Button onClick={onShowModalCopy}>Copy From...</Button>}
        >
          <TabPane tab="Brand" key="Brand">
            {listBrand.map((data, index) => {
              return (
                <Row>
                  <Col span={8}>
                    <FormItem label={index === 0 ? 'Brand' : null} hasFeedback>
                      {data.brandName}
                    </FormItem>
                  </Col>
                  {getFieldDecorator(`brandId[${index}]`, {
                    initialValue: data.id
                  })(<Input type="hidden" />)}
                  <Col span={7}>
                    <FormItem label={index === 0 ? 'Target Qty' : null} hasFeedback>
                      {getFieldDecorator(`targetBrandSalesQty[${index}]`, {
                        initialValue: item.brand ? (item.brand.filter(x => x.brandId === data.id && x.month === currentModal + 1)[0] || {}).targetSalesQty || 0 : 0,
                        rules: [
                          {
                            required: true,
                            message: 'Must provide value'
                          }
                        ]
                      })(<InputNumber min={0} style={{ width: '100%' }} disabled={data.type === 'edit'} placeholder="Target Qty" />)}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={1}>
                    <FormItem label={index === 0 ? 'Target Sales' : null} hasFeedback>
                      {getFieldDecorator(`targetBrandSales[${index}]`, {
                        initialValue: item.brand ? (item.brand.filter(x => x.brandId === data.id && x.month === currentModal + 1)[0] || {}).targetSales || 0 : 0,
                        rules: [
                          {
                            required: true,
                            message: 'Must provide value'
                          }
                        ]
                      })(<InputNumber min={0} style={{ width: '100%' }} disabled={data.type === 'edit'} placeholder="Target Sales" />)}
                    </FormItem>
                  </Col>
                </Row>
              )
            })}
          </TabPane>
          <TabPane tab="Category" key="category">
            {listCategory.map((data, index) => {
              return (
                <Row>
                  <Col span={8}>
                    <FormItem label={index === 0 ? 'Category' : null} hasFeedback>
                      {data.categoryName}
                    </FormItem>
                  </Col>
                  {getFieldDecorator(`categoryId[${index}]`, {
                    initialValue: data.id
                  })(<Input type="hidden" />)}
                  <Col span={7}>
                    <FormItem label={index === 0 ? 'Target Qty' : null} hasFeedback>
                      {getFieldDecorator(`targetCategorySalesQty[${index}]`, {
                        initialValue: item.category ? (item.category.filter(x => x.categoryId === data.id && x.month === currentModal + 1)[0] || {}).targetSalesQty || 0 : 0,
                        rules: [
                          {
                            required: true,
                            message: 'Must provide value'
                          }
                        ]
                      })(<InputNumber min={0} style={{ width: '100%' }} disabled={data.type === 'edit'} placeholder="Target Qty" />)}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={1}>
                    <FormItem label={index === 0 ? 'Target Sales' : null} hasFeedback>
                      {getFieldDecorator(`targetCategorySales[${index}]`, {
                        initialValue: item.category ? (item.category.filter(x => x.categoryId === data.id && x.month === currentModal + 1)[0] || {}).targetSales || 0 : 0,
                        rules: [
                          {
                            required: true,
                            message: 'Must provide value'
                          }
                        ]
                      })(<InputNumber min={0} style={{ width: '100%' }} disabled={data.type === 'edit'} placeholder="Target Sales" />)}
                    </FormItem>
                  </Col>
                </Row>
              )
            })}
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )
}

export default Form.create()(FormCustomer)
