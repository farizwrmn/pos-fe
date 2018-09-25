import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Button, Row, Col, Checkbox, Upload, Icon, Select, Modal, Card, message } from 'antd'
import { DataQuery, FooterToolbar } from 'components'

const { Variant, Specification, Stock } = DataQuery
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  style: {
    marginTop: 8
  },
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 12 }
}

const parentRight = {
  md: { span: 24 },
  lg: { span: 14 }
}

const parentLeft = {
  md: { span: 24 },
  lg: { span: 10 }
}

const AdvancedForm = ({
  item = {},
  onSubmit,
  onCancel,
  disabled,
  loadingButton,
  modalVariantVisible,
  modalSpecificationVisible,
  modalProductVisible,
  listVariantStock,
  editItemProductById,
  dispatch,
  modalType,
  button,
  listCategory,
  showCategories,
  listBrand,
  listVariant,
  showBrands,
  showVariant,
  showVariantId,
  showSpecification,
  listSpecification,
  listSpecificationCode,
  showProductModal,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields,
    setFieldsValue
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 17 : 22
      },
      md: {
        offset: modalType === 'edit' ? 18 : 22
      },
      lg: {
        offset: modalType === 'edit' ? 11 : 19
      }
    }
  }

  const onChangeCheckBox = (e) => {
    if (e.target.checked) {
      dispatch({
        type: 'variantStock/updateState',
        payload: {
          listVariantStock: []
        }
      })
    } else {
      resetFields(['variantId'])
    }
  }

  const handleCancel = () => {
    onCancel()
    dispatch({
      type: 'variantStock/updateState',
      payload: {
        listVariantStock: []
      }
    })

    dispatch({
      type: 'specificationStock/updateState',
      payload: {
        listSpecificationCode: []
      }
    })
    dispatch({
      type: 'specification/updateState',
      payload: {
        listSpecification: []
      }
    })
    resetFields()
  }
  const existVariant = listVariantStock.map(x => x.variantId)

  const availableVariant = listVariant.map((x) => {
    if (existVariant.indexOf(x.id) > -1) {
      return {}
    }
    return x
  }).filter(x => !!x.id)

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (!getFieldValue('variant') && getFieldValue('useVariant') && !item.productParentId) {
        message.warning('Must Choose Product')
        return
      }
      if (getFieldValue('useVariant') && !data.variantId.key) {
        message.warning('Must Choose Variant')
        return
      }
      data.categoryName = data.categoryId ? data.categoryId.label : null
      data.categoryId = data.categoryId ? data.categoryId.key : null
      data.brandName = data.brandId ? data.brandId.label : null
      data.brandId = data.brandId ? data.brandId.key : null
      data.variantName = data.variantId ? data.variantId.label : null
      data.variantId = data.variantId ? data.variantId.key : null
      data.productParentId = item.productParentId
      data.productParentName = item.productParentName
      data.active = !data.active || data.active === 0 || data.active === false ? 0 : 1
      data.trackQty = !data.trackQty || data.trackQty === 0 || data.trackQty === false ? 0 : 1
      data.exception01 = !data.exception01 || data.exception01 === 0 || data.exception01 === false ? 0 : 1
      data.usageTimePeriod = data.usageTimePeriod || 0
      data.usageMileage = data.usageMileage || 0
      let valid = true
      if (valid) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.productCode, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      }
    })
  }

  const brand = () => {
    showBrands()
  }

  const handleShowSpecification = () => {
    showSpecification()
  }

  const category = () => {
    dispatch({
      type: 'specificationStock/updateState',
      payload: {
        listSpecificationCode: []
      }
    })
    dispatch({
      type: 'specification/updateState',
      payload: {
        listSpecification: []
      }
    })
    showCategories()
  }

  const handleChangeCategoryId = (e) => {
    if (modalType === 'add' && e.key && listSpecification.length === 0) {
      dispatch({
        type: 'specification/query',
        payload: {
          categoryId: e.key
        }
      })
    }
  }

  const variant = () => {
    showVariantId()
  }

  const productCategory = (listCategory || []).length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  const productBrand = (listBrand || []).length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []
  const productVariant = (availableVariant || []).length > 0 ? availableVariant.map(b => <Option value={b.id} key={b.id}>{b.name}</Option>) : []

  const changeProductCode = (e) => {
    const { value } = e.target
    setFieldsValue({ dummyCode: value })
  }

  const cardProps = {
    bordered: true,
    style: {
      padding: 8,
      marginLeft: 8,
      marginBottom: 8
    }
  }

  const InputNumberProps = {
    placeholder: '0',
    style: { width: '100%' },
    maxLength: 20
  }

  const modalVariantProps = {
    location,
    item,
    loading: loadingButton.effects['variantStock/query'] || loadingButton.effects['productstock/queryItemById'],
    visible: modalVariantVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalVariantVisible: false
        }
      })
    },
    onRowClick (item) {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          editItemProductById(item)
        }
      })

      // const data = getFieldsValue()
      // dispatch({
      //   type: 'productstock/updateState',
      //   payload: {
      //     modalVariantVisible: false,
      //     currentItem: {
      //       ...data
      //     }
      //   }
      // })
      // dispatch({
      //   type: 'customerunit/updateState',
      //   payload: {
      //     modalVariantVisible: false,
      //     unitItem: {}
      //   }
      // })
      // resetFields()
    }
  }

  const modalSpecificationProps = {
    location,
    loading: loadingButton.effects['specification/query'],
    visible: modalSpecificationVisible,
    modalType,
    enableFilter: false,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    editListItem (id, value) {
      let newListSpecificationStock = []
      if (modalType === 'add') {
        newListSpecificationStock = listSpecification.map((x) => {
          if (x.id === Number(id)) {
            return {
              ...x,
              value
            }
          }
          return x
        })
        dispatch({
          type: 'specification/updateState',
          payload: {
            listSpecification: newListSpecificationStock
          }
        })
      } else if (modalType === 'edit') {
        newListSpecificationStock = listSpecificationCode.map((x) => {
          if (x.id === Number(id)) {
            return {
              ...x,
              value
            }
          }
          return x
        })
        dispatch({
          type: 'specificationStock/updateState',
          payload: {
            listSpecificationCode: newListSpecificationStock
          }
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalSpecificationVisible: false
        }
      })
    },
    onRowClick (item) {
      console.log('item', item)

      // const data = getFieldsValue()
      // dispatch({
      //   type: 'productstock/updateState',
      //   payload: {
      //     modalVariantVisible: false,
      //     currentItem: {
      //       ...data
      //     }
      //   }
      // })
      // dispatch({
      //   type: 'customerunit/updateState',
      //   payload: {
      //     modalVariantVisible: false,
      //     unitItem: {}
      //   }
      // })
      // resetFields()
    }
  }

  const modalProductProps = {
    location,
    loading: loadingButton,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    },
    onRowClick (item) {
      const data = getFieldsValue()
      data.variantId = null
      data.brandName = data.brandId.label
      data.brandId = data.brandId.key
      data.categoryName = data.categoryId.label
      data.categoryId = data.categoryId.key
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalProductVisible: false,
          currentItem: {
            ...data,
            productParentId: item.id,
            productParentName: item.productName
          }
        }
      })
      dispatch({
        type: 'variantStock/query',
        payload: {
          type: 'all',
          productParentId: item.id
        }
      })
      resetFields(['variantId'])
    }
  }
  const handleShowVariant = () => {
    if (item.variantId) {
      dispatch({
        type: 'variantStock/query',
        payload: {
          type: 'all',
          productParentId: item.productParentId
        }
      })
      showVariant(item)
    } else {
      message.info("this product doensn't have variant")
    }
  }

  const handleShowProduct = () => {
    dispatch({
      type: 'pos/getProducts',
      payload: {
        page: 1,
        lov: 'variant'
      }
    })
    showProductModal()
  }
  const variantIdFromItem = modalType === 'edit' && !!item.variantId

  return (
    <Form layout="horizontal">
      <Card title={<h3>Product Info</h3>} {...cardProps}>
        <Row>
          <Col {...column}>
            <FormItem label="Product Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productCode', {
                initialValue: item.productCode,
                rules: [
                  {
                    required: true,
                    pattern: modalType === 'add' ? /^[a-z0-9/-]{3,30}$/i : /^[A-Za-z0-9-.,() _/]{3,30}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input disabled={disabled} maxLength={30} onChange={e => changeProductCode(e)} autoFocus />)}
            </FormItem>
            <FormItem label="Product Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productName', {
                initialValue: item.productName,
                rules: [
                  {
                    required: true,
                    pattern: /^[A-Za-z0-9-._/ ]{3,50}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
            <FormItem label="Category" hasFeedback {...formItemLayout}>
              {getFieldDecorator('categoryId', {
                initialValue: item.categoryId ? {
                  key: item.categoryId,
                  label: item.categoryName
                } : {},
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                allowClear
                disabled={modalType === 'edit'}
                onFocus={() => category()}
                onChange={handleChangeCategoryId}
                optionFilterProp="children"
                labelInValue
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              >{productCategory}
              </Select>)}
            </FormItem>
            <FormItem label="Brand" hasFeedback {...formItemLayout}>
              {getFieldDecorator('brandId', {
                initialValue: item.brandId ? {
                  key: item.brandId,
                  label: item.brandName
                } : {},
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                allowClear
                onFocus={() => brand()}
                optionFilterProp="children"
                labelInValue
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              >{productBrand}
              </Select>)}
            </FormItem>
            <FormItem help={!(getFieldValue('categoryId') || {}).key ? 'Fill category field' : `${modalType === 'add' ? listSpecification.length : listSpecificationCode.length} Specification`} label="Manage" {...formItemLayout}>
              <Button.Group>
                {modalType === 'edit' && variantIdFromItem && <Button disabled={modalType === 'add'} onClick={handleShowVariant} type="primary">Variant</Button>}
                <Button disabled={getFieldValue('categoryId') ? !getFieldValue('categoryId').key : null} onClick={handleShowSpecification}>Specification</Button>
              </Button.Group>
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label="Barcode 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('barCode01', {
                initialValue: item.barCode01
              })(<Input />)}
            </FormItem>
            <FormItem label="Barcode 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('barCode02', {
                initialValue: item.barCode02
              })(<Input />)}
            </FormItem>

            {(modalType === 'add' || !variantIdFromItem) &&
              <FormItem
                label="Use Variant"
                {...formItemLayout}
              >
                {getFieldDecorator('useVariant', {
                  valuePropName: 'checked',
                  initialValue: !!item.useVariant || !!item.variantId
                })(<Checkbox>Use Variant</Checkbox>)}
              </FormItem>}

            {(modalType === 'add' || !variantIdFromItem) && getFieldValue('useVariant') &&
              (
                <div>
                  <FormItem
                    validateStatus={!getFieldValue('variant') && !item.productParentId ? 'error' : ''}
                    help={!getFieldValue('variant') && !item.productParentId ? 'Must Choose Product' : ''}
                    label="Variant"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('variant', {
                      valuePropName: 'checked',
                      initialValue: (item.variant ? item.variant : modalType === 'add') || !!item.variantId
                    })(<Checkbox onChange={onChangeCheckBox}>{getFieldValue('variant') ? 'New' : 'Old'} Product</Checkbox>)}
                    {!getFieldValue('variant') &&
                      (<span>
                        <Button type="primary" onClick={handleShowProduct}>Product</Button>
                        <br />
                        {item.productParentName ? `Variant of "${item.productParentName}" ${getFieldValue('variantId') ? `as ${getFieldValue('variantId').label || ''}` : ''}` : ''}
                      </span>)}
                  </FormItem>
                  <FormItem label="Variant Name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('variantId', {
                      initialValue: item.variant ? { key: item.variantId, label: item.variantName } : {},
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Select
                      showSearch
                      allowClear
                      onFocus={() => variant()}
                      optionFilterProp="children"
                      labelInValue
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                    >{productVariant}
                    </Select>)}
                  </FormItem>
                </div>
              )}
          </Col>
        </Row>
      </Card>
      <Row>
        <Col {...parentLeft}>
          <Card title={<h3>Pricing</h3>} {...cardProps}>
            <Row>
              <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sellPrice', {
                  initialValue: item.sellPrice,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber {...InputNumberProps} />)}
              </FormItem>
              <FormItem label="Dist Price 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('distPrice01', {
                  initialValue: item.distPrice01,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber {...InputNumberProps} />)}
              </FormItem>
              <FormItem label="Dist Price 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('distPrice02', {
                  initialValue: item.distPrice02,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber {...InputNumberProps} />)}
              </FormItem>
              <FormItem label="Cost Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('costPrice', {
                  initialValue: item.costPrice,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber {...InputNumberProps} />)}
              </FormItem>
              <FormItem label="Pre Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sellPricePre', {
                  initialValue: item.sellPricePre,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber {...InputNumberProps} />)}
              </FormItem>
            </Row>
          </Card>
        </Col>
        <Col {...parentRight}>
          <Card title={<h3>Advance Product Utility</h3>} {...cardProps}>
            <Row>
              <Col {...column}>
                <FormItem label="Track Qty" {...formItemLayout}>
                  {getFieldDecorator('trackQty', {
                    valuePropName: 'checked',
                    initialValue: !!item.trackQty
                  })(<Checkbox>Track</Checkbox>)}
                </FormItem>
                <FormItem label="Alert Qty" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('alertQty', {
                    initialValue: item.alertQty,
                    rules: [
                      {
                        required: getFieldValue('trackQty'),
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} />)}
                </FormItem>
                <FormItem label="Location 1" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('location01', {
                    initialValue: item.location01
                  })(<Input />)}
                </FormItem>
                <FormItem label="Location 2" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('location02', {
                    initialValue: item.location02
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...column}>
                <FormItem label="Status" {...formItemLayout}>
                  {getFieldDecorator('active', {
                    valuePropName: 'checked',
                    initialValue: item.active === undefined ? true : item.active
                  })(<Checkbox>Active</Checkbox>)}
                </FormItem>
                <FormItem label="Under Cost" {...formItemLayout}>
                  {getFieldDecorator('exception01', {
                    valuePropName: 'checked',
                    initialValue: !!item.exception01
                  })(<Checkbox>Allow</Checkbox>)}
                </FormItem>
                <FormItem label="Image" {...formItemLayout}>
                  {getFieldDecorator('productImage', {
                    initialValue: item.productImage
                  })(
                    <Upload>
                      <Button>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                  )}
                </FormItem>
                <FormItem label="Usage Period" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('usageTimePeriod', {
                    initialValue: item.usageTimePeriod,
                    rules: [
                      {
                        pattern: /^(?:0|[1-9][0-9]{0,10})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} min={0} maxLength={10} placeholder="day(s)" style={{ width: '36%' }} />)}
                  {getFieldDecorator('usageMileage', {
                    initialValue: item.usageMileage,
                    rules: [
                      {
                        pattern: /^(?:0|[1-9][0-9]{0,15})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber min={0} maxLength={15} placeholder="km" style={{ width: '60%', marginRight: 0 }} />)}
                </FormItem>
                {/* <FormItem label="Aspect Ratio" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('aspectRatio', {
                    initialValue: item.aspectRatio
                  })(<Input />)}
                </FormItem>
                <FormItem label="Rim Diameter" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('rimDiameter', {
                    initialValue: item.rimDiameter
                  })(<Input />)}
                </FormItem>
                <FormItem label="Section Width" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('sectionWidth', {
                    initialValue: item.sectionWidth
                  })(<Input />)}
                </FormItem> */}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <FooterToolbar>
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" onClick={handleSubmit}>{button}</Button>
        </FormItem>
      </FooterToolbar>
      {modalVariantVisible && <Variant {...modalVariantProps} />}
      {modalSpecificationVisible && <Specification {...modalSpecificationProps} />}
      {modalProductVisible && <Stock {...modalProductProps} />}
    </Form>
  )
}

AdvancedForm.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  modalType: PropTypes.string,
  item: PropTypes.object,
  listCategory: PropTypes.object,
  listBrand: PropTypes.object,
  onSubmit: PropTypes.func,
  showBrands: PropTypes.func,
  showCategories: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(AdvancedForm)
