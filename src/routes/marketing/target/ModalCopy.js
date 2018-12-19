import React from 'react'
import { Form, Modal, Select } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const FormCustomer = ({
  ...modalProps,
  months,
  currentModal,
  onCancel,
  onSubmit,
  item,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    getFieldValue
  }
}) => {
  const getCurrentData = () => {
    const data = getFieldsValue()
    let newData = []
    // newData.brand = data.targetBrandSales.map((x, index) => ({
    //   brandId: data.brandId[index],
    //   month: currentModal + 1,
    //   targetSales: x,
    //   targetSalesQty: data.targetBrandSalesQty[index]
    // }))
    // newData.category = data.targetCategorySales.map((x, index) => ({
    //   categoryId: data.categoryId[index],
    //   month: currentModal + 1,
    //   targetSales: x,
    //   targetSalesQty: data.targetCategorySalesQty[index]
    // }))
    const newBrand = item.brand.filter(x => x.month === data.month).map(filteredData => ({
      brandId: filteredData.brandId,
      month: currentModal + 1,
      targetSales: filteredData.targetSales,
      targetSalesQty: filteredData.targetSalesQty
    }))
    const newCategory = item.brand.filter(x => x.month === data.month).map(filteredData => ({
      brandId: filteredData.brandId,
      month: currentModal + 1,
      targetSales: filteredData.targetSales,
      targetSalesQty: filteredData.targetSalesQty
    }))
    newData.brand = item.brand.filter(x => x.month !== currentModal + 1).concat(newBrand)
    newData.category = item.category.filter(x => x.month !== currentModal + 1).concat(newCategory)
    newData.year = item.year
    newData.description = item.description
    newData.id = item.id
    console.log('newBrand', newBrand)
    console.log('newData', newData)

    return Object.assign({}, newData)
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getCurrentData()
      onSubmit(data, getFieldValue('month'))
    })
  }
  const option = (months || []).length > 0 ? months.map((data, index) => <Option disabled={currentModal === index} value={index + 1} key={index + 1}>{data.month}</Option>) : []
  const modalOpts = {
    onOk: handleOk,
    onCancel,
    ...modalProps
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="vertical">
        <FormItem label="Month" hasFeedback>
          {getFieldDecorator('month', {
            rules: [
              {
                required: true,
                message: 'Must provide value'
              }
            ]
          })(<Select placeholder="Choose period">
            {option}
          </Select>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(FormCustomer)
