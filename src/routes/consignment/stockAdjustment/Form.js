import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Select, Input, Modal, Spin } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const { TextArea } = Input

let searchTimeOut

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
  modalType,
  vendorList,
  productList,
  loadingSearchVendor,
  loading,
  selectedOutlet,
  selectedVendorProductList,
  updateProductList,
  searchVendor,
  selectVendor,
  submitAdjustment,
  emptyVendorList,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    validateFields,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 13 : 17
      },
      sm: {
        offset: modalType === 'edit' ? 13 : 17
      },
      md: {
        offset: modalType === 'edit' ? 13 : 17
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 17
      }
    }
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          const fields = getFieldsValue()
          submitAdjustment(fields, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const addProduct = () => {
    const list = productList
    list.push({
      id: null,
      product_name: null,
      quantity: 1,
      normalPrice: 0,
      grabPrice: 0,
      grabMartPrice: 0,
      commercePrice: 0
    })
    updateProductList(list)
  }

  const removeProduct = (index) => {
    const list = productList.filter((record, ind) => {
      if (ind !== index) {
        return true
      }
      return false
    })
    list.map((record, index) => {
      setFieldsValue({
        [`productName-${index}`]: record.product_name,
        [`qty-${index}`]: record.quantity,
        [`normalPrice-${index}`]: record.normalPrice,
        [`grabPrice-${index}`]: record.grabPrice,
        [`grabMartPrice-${index}`]: record.grabMartPrice,
        [`commercePrice-${index}`]: record.commercePrice
      })
      return true
    })
    updateProductList(list)
  }

  const changeQty = (event, index) => {
    const value = event.target.value
    const list = productList
    list[index] = {
      id: productList[index].id,
      product_name: productList[index].product_name,
      stockId: productList[index].stockId,
      quantity: value,
      normalPrice: productList[index].normalPrice,
      grabPrice: productList[index].grabPrice,
      grabMartPrice: productList[index].grabMartPrice,
      commercePrice: productList[index].commercePrice
    }
    updateProductList(list)
  }

  const changePrice = (event, index, type) => {
    const value = event.target.value
    const list = productList
    list[index] = {
      id: productList[index].id,
      product_name: productList[index].product_name,
      stockId: productList[index].stockId,
      quantity: productList[index].quantity,
      normalPrice: type === '1' ? value : productList[index].normalPrice,
      grabPrice: type === '2' ? value : productList[index].grabPrice,
      grabMartPrice: type === '3' ? value : productList[index].grabMartPrice,
      commercePrice: type === '4' ? value : productList[index].commercePrice
    }

    updateProductList(list)
  }

  const changeProductName = (value, index) => {
    const list = productList
    const product = selectedVendorProductList.filter(filtered => filtered.id === value)
    if (product && product[0]) {
      list[index] = {
        id: value,
        product_name: `${value} - ${product[0].product_name}`,
        stockId: product[0]['stocks.stock_id'],
        quantity: 1,
        normalPrice: product[0].price,
        grabPrice: product[0].price_grabfood_gofood || 0,
        grabMartPrice: product[0].price_grabmart || 0,
        commercePrice: product[0].price_shopee || 0
      }
      updateProductList(list)
    }
  }

  const selectVendorSearch = (value) => {
    emptyVendorList()
    if (value.length > 0) {
      if (searchTimeOut) {
        clearTimeout(searchTimeOut)
        searchTimeOut = null
      }

      searchTimeOut = setTimeout(() => searchVendor(value), 1000)
    }
  }

  const vendorOption = vendorList ? vendorList.map(c => <Option key={c.id} value={c.id}>{c.vendor_code} - {c.name}</Option>) : []
  const productOption = selectedVendorProductList ? selectedVendorProductList.map(c => <Option key={c.id} value={c.id}>{c.product_code} - {c.product_name}</Option>) : []

  const productForm = (productList || []).map((record, index) => {
    return (
      <FormItem label={`Produk ${index + 1}`} hasFeedback {...formItemLayout}>
        {getFieldDecorator(`productName-${index}`, {
          initialValue: record.productName || undefined,
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select
            onChange={(value) => { changeProductName(value, index) }}
            disabled={!getFieldsValue().vendor || loading}
            placeholder="Select Product"
            showSearch
          >
            {productOption}
          </Select>
        )}
        {getFieldDecorator(`qty-${index}`, {
          initialValue: record.quantity,
          rules: [
            {
              required: false
            }
          ]
        })(
          <Input addonBefore="Quantity" disabled={!getFieldsValue().vendor || loading} onChange={(event) => { changeQty(event, index) }} />
        )}
        {getFieldDecorator(`normalPrice-${index}`, {
          initialValue: record.normalPrice,
          rules: [
            {
              required: false
            }
          ]
        })(
          <Input addonBefore="Normal Price" disabled={!getFieldsValue().vendor || loading} onChange={(event) => { changePrice(event, index, '1') }} />
        )}
        {getFieldDecorator(`grabPrice-${index}`, {
          initialValue: record.grabPrice || 0,
          rules: [
            {
              required: false
            }
          ]
        })(
          <Input addonBefore="Grab/Gojek Price" disabled={!getFieldsValue().vendor || loading} onChange={(event) => { changePrice(event, index, '2') }} />
        )}
        {getFieldDecorator(`grabMartPrice-${index}`, {
          initialValue: record.grabMartPrice || 0,
          rules: [
            {
              required: false
            }
          ]
        })(
          <Input addonBefore="GrabMart Price" disabled={!getFieldsValue().vendor || loading} onChange={(event) => { changePrice(event, index, '3') }} />
        )}
        {getFieldDecorator(`commercePrice-${index}`, {
          initialValue: record.commercePrice || 0,
          rules: [
            {
              required: false
            }
          ]
        })(
          <Input addonBefore="e-Commerce Price" disabled={!getFieldsValue().vendor || loading} onChange={(event) => { changePrice(event, index, '4') }} />
        )}
        <Row>
          {getFieldsValue().vendor ? ((index + 1) === productList.length ? (
            <Col span={24}>
              {productList.length !== 1 && (
                <Col span={12}>
                  <Button
                    onClick={() => removeProduct(index)}
                    type="danger"
                    style={{ width: '100%' }}
                    loading={loading}
                  >
                    Remove Product
                  </Button>
                </Col>
              )}
              <Col span={12}>
                <Button
                  onClick={() => addProduct()}
                  type="primary"
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  Add Product
                </Button>
              </Col>
            </Col>
          ) : (
            <Col span={12} >
              <Button
                onClick={() => removeProduct(index)}
                type="danger"
                style={{ width: '100%' }}
                loading={loading}
              >
                Remove Product
              </Button>
            </Col>
          )) : null}
        </Row>
      </FormItem>
    )
  })

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Outlet" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outlet', {
              initialValue: selectedOutlet.outlet_name,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
              initialValue: undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                showSearch
                placeholder="Select Vendor"
                optionFilterProp="children"
                onChange={(value) => { selectVendor(value) }}
                onSearch={selectVendorSearch}
                filterOption={false}
                notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
                disabled={loading}
              >
                {vendorOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="Tipe Permintaan" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                showSearch
                placeholder="Select Request Type"
                optionFilterProp="children"
                disabled={!getFieldsValue().vendor || loading}
              >
                <Option value={1}>Stock IN</Option>
                <Option value={0}>Stock OUT</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="Catatan" hasFeedback {...formItemLayout}>
            {getFieldDecorator('note', {
              initialValue: undefined,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <TextArea disabled={!getFieldsValue().vendor || loading} placeholder={'Tulis Catatan ... '} />
            )}
          </FormItem>

          {productForm}

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={() => handleSubmit()} loading={loading}>Simpan</Button>
          </FormItem>
        </Col>
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
