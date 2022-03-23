import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Form, Input, Spin, InputNumber, DatePicker, Button, Row, Col, Checkbox, Upload, Icon, Select, Modal, Card, message, Table, BackTop } from 'antd'
import { DataQuery, FooterToolbar } from 'components'
import moment from 'moment'
import { IMAGEURL, rest } from 'utils/config.company'
import { getDistPriceName, getDistPriceDescription } from 'utils/string'
import ModalSupplier from './ModalSupplier'

const { apiCompanyURL } = rest
const { Variant, Specification, Stock } = DataQuery
const { TextArea } = Input
const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option

const formatWeight = (dimension) => {
  try {
    if (dimension) {
      let newDimension
      const splitted = dimension.split('X')
      if (splitted && splitted.length > 0) {
        newDimension = splitted[splitted.length - 1]
      }
      return newDimension
    }
    if (dimension === '') {
      return '100 g'
    }
    return dimension
  } catch (error) {
    console.log('formatWeight', error)
    return '100 g'
  }
}

const formatBox = (dimension) => {
  try {
    if (dimension && dimension.includes('X')) {
      let newDimension
      const splitted = dimension.split('X')
      if (splitted && splitted.length === 3) {
        newDimension = splitted[0]
      }
      return newDimension
    }
    if (dimension === '') {
      return '1'
    }
    return '1'
  } catch (error) {
    console.log('formatBox', error)
    return '1'
  }
}

const formatPack = (dimension) => {
  try {
    if (dimension) {
      let newDimension
      const splitted = dimension.split('X')
      if (splitted && splitted.length === 3) {
        newDimension = splitted[1]
      }
      if (splitted && splitted.length === 2) {
        newDimension = splitted[0]
      }
      return newDimension
    }
    if (dimension === '') {
      return '1'
    }
    return dimension
  } catch (error) {
    console.log('formatPack', error)
    return '1'
  }
}

const formatDimension = (productName) => {
  try {
    let newDimension = ''
    if (productName) {
      const splitted = productName.split(' ')
      if (splitted && splitted.length > 0) {
        const dimension = splitted[splitted.length - 1]
        const dimensionSplit = dimension.split('X')
        if (dimension
          && /^(g|kg|per pack|ml|L)$/.test(dimensionSplit[dimensionSplit.length - 1])
          && splitted[splitted.length - 2]
          && (
            /^([0-9]{1,})$/.test(splitted[splitted.length - 2])
            || splitted[splitted.length - 2].includes('X'))
        ) {
          newDimension = `${splitted[splitted.length - 2]} ${dimension}`
        }
      }
      return newDimension
    }
    return productName
  } catch (e) {
    console.log('formatDimension', e)
    return ''
  }
}

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

// const parentRight = {
//   md: { span: 24 },
//   lg: { span: 14 }
// }

// const parentLeft = {
//   md: { span: 24 },
//   lg: { span: 10 }
// }

const parentThreeDivision = {
  md: { span: 24 },
  lg: { span: 8 }
}

class AdvancedForm extends Component {
  constructor (props) {
    super(props)
    this.changeName = this.changeName.bind(this)
    this.changeBrand = this.changeBrand.bind(this)
  }

  state = {
    name: '',
    typing: false,
    typingTimeout: 0,

    brandName: '',
    brandTyping: false,
    brandTypingTimeout: 0
  }

  changeBrand = (value) => {
    const self = this
    console.log('changeBrand', value)

    if (self.state.brandTypingTimeout) {
      clearTimeout(self.state.brandTypingTimeout)
    }

    self.setState({
      brandName: value,
      brandTyping: false,
      brandTypingTimeout: setTimeout(() => {
        self.searchShopeeBrand(self.state.brandName)
      }, 1000)
    })
  }

  changeName = (event) => {
    const self = this

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout)
    }

    self.setState({
      name: event.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        self.sendToParent(self.state.name)
      }, 1000)
    })
  }

  sendToParent = (productName) => {
    const {
      onGetShopeeCategory
    } = this.props
    if (productName && productName !== '') {
      onGetShopeeCategory(productName)
    }
  }

  searchShopeeBrand = (q) => {
    const {
      form: {
        getFieldValue
      },
      onGetShopeeBrand
    } = this.props
    const categoryId = getFieldValue('shopeeCategoryId')
    const category_id = categoryId && categoryId.key ? categoryId.key : null
    if (q && q !== '' && category_id) {
      onGetShopeeBrand(q, category_id)
    }
  }

  render () {
    const {
      lastTrans,
      listShopeeCategory,
      listShopeeBrand,
      getShopeeBrand,
      getShopeeAttribute,
      listShopeeAttribute,
      item = {},
      onSubmit,
      onCancel,
      onGetSupplier,
      disabled,
      loadingButton,
      modalVariantVisible,
      modalSpecificationVisible,
      modalProductVisible,
      listShopeeLogistic,
      listVariantStock,
      listGrabCategory,
      listInventory,
      onGetShopeeCategory,
      editItemProductById,
      supplierInformation,
      dispatch,
      modalType,
      button,
      listCategory,
      showCategories,
      listBrand,
      modalSupplierVisible,
      paginationSupplier,
      listSupplier,
      tmpSupplierData,
      searchTextSupplier,
      onChooseSupplier,
      onSearchSupplierData,
      onSearchSupplier,
      onChangeDate,
      listVariant,
      showBrands,
      showVariant,
      showVariantId,
      showSpecification,
      listSpecification,
      listSpecificationCode,
      showProductModal,
      listShopeeCategoryRecommend,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        getFieldValue,
        resetFields,
        setFieldsValue
      },
      ...props
    } = this.props

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

    // const onChangeCheckBox = (e) => {
    //   if (e.target.checked) {
    //     dispatch({
    //       type: 'variantStock/updateState',
    //       payload: {
    //         listVariantStock: []
    //       }
    //     })
    //   } else {
    //     resetFields(['variantId'])
    //   }
    // }

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
    // const existVariant = listVariantStock.map(x => x.variantId)

    // const availableVariant = listVariant.map((x) => {
    //   if (existVariant.indexOf(x.id) > -1) {
    //     return {}
    //   }
    //   return x
    // }).filter(x => !!x.id)

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
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            const data = getFieldsValue()

            data.shopeeCategoryname = data.shopeeCategoryId && data.shopeeCategoryId.label ? data.shopeeCategoryId.label : null
            data.shopeeCategoryId = data.shopeeCategoryId && data.shopeeCategoryId.key ? data.shopeeCategoryId.key : null

            data.shopeeBrandName = data.shopeeBrandId && data.shopeeBrandId.label ? data.shopeeBrandId.label : null
            data.shopeeBrandId = data.shopeeBrandId && data.shopeeBrandId.key ? data.shopeeBrandId.key : null

            data.grabCategoryName = data.grabCategoryId ? data.grabCategoryId.label : null
            data.grabCategoryId = data.grabCategoryId ? data.grabCategoryId.key : null
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
            data.supplierId = modalType === 'add' && supplierInformation && supplierInformation.id
              ? supplierInformation.id
              : supplierInformation.id || item.supplierId
            onSubmit(data.productCode, data, resetFields)
            // setTimeout(() => {
            // }, 500)
          },
          onCancel () { }
        })
      })
    }

    const brand = () => {
      showBrands()
    }

    // const handleShowSpecification = () => {
    //   showSpecification()
    // }

    const category = () => {
      // dispatch({
      //   type: 'specificationStock/updateState',
      //   payload: {
      //     listSpecificationCode: []
      //   }
      // })
      // dispatch({
      //   type: 'specification/updateState',
      //   payload: {
      //     listSpecification: []
      //   }
      // })
      showCategories()
    }

    const handleChangeCategoryId = (e) => {
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
      if (modalType === 'add' && (e || {}).key) {
        dispatch({
          type: 'specification/query',
          payload: {
            categoryId: e.key
          }
        })
      }
    }

    // const variant = () => {
    //   showVariantId()
    // }
    const shopeeLogistic = (listShopeeLogistic || []).length > 0 ? listShopeeLogistic.map(c => <Option value={c.logistics_channel_id} key={c.logistics_channel_id} title={`${c.logistics_channel_name} - ${c.logistics_description}`}>{`${c.logistics_channel_name}`}</Option>) : []
    const shopeeCategory = (listShopeeCategory || []).length > 0 ? listShopeeCategory.filter(filtered => !filtered.has_children).map(c => <Option value={c.category_id} key={c.category_id} title={`${c.original_category_name} | ${c.display_category_name}`}>{`${c.original_category_name} | ${c.display_category_name}`}</Option>) : []
    const shopeeBrand = (listShopeeBrand || []).length > 0 ? listShopeeBrand.map(c => <Option value={c.brand_id} key={c.brand_id} title={`${c.original_brand_name} | ${c.display_brand_name}`}>{`${c.original_brand_name} | ${c.display_brand_name}`}</Option>) : []
    const grabCategory = (listGrabCategory || []).length > 0 ? listGrabCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName} | ${c.subcategoryName}`}>{`${c.categoryName} | ${c.subcategoryName}`}</Option>) : []
    const productInventory = (listInventory || []).length > 0 ? listInventory.map(c => <Option value={c.code} key={c.code}>{c.type}</Option>) : []
    const productCategory = (listCategory || []).length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
    const productBrand = (listBrand || []).length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []
    // const productVariant = (availableVariant || []).length > 0 ? availableVariant.map(b => <Option value={b.id} key={b.id}>{b.name}</Option>) : []

    const changeProductCode = (e) => {
      const { value } = e.target
      setFieldsValue({ dummyCode: value })
    }

    const handleImportStock = () => {
      dispatch(routerRedux.push({
        pathname: '/master/product/stock/import'
      }))
    }

    const cardProps = {
      bordered: true,
      style: {
        padding: 8,
        marginLeft: 8,
        marginBottom: 8
      },
      title: (
        <Row>
          <Col md={12} lg={3}>
            <h3>Product Info</h3>
          </Col>
          <Col md={12} lg={9}>
            <Button
              type="default"
              onClick={handleImportStock}
            >
              Import
            </Button>
          </Col>
        </Row>
      )
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
      onRowClick () {
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

    const hdlGetSupplier = () => {
      onGetSupplier()
      dispatch({
        type: 'purchase/updateState',
        payload: {
          modalSupplierVisible: true
        }
      })
    }

    const buttonSupplierProps = {
      type: 'primary',
      onClick () {
        hdlGetSupplier()
      }
    }

    // const handleShowVariant = () => {
    //   if (item.variantId) {
    //     dispatch({
    //       type: 'variantStock/query',
    //       payload: {
    //         type: 'all',
    //         productParentId: item.productParentId
    //       }
    //     })
    //     showVariant(item)
    //   } else {
    //     message.info("this product doensn't have variant")
    //   }
    // }

    // const handleShowProduct = () => {
    //   dispatch({
    //     type: 'pos/getProducts',
    //     payload: {
    //       page: 1,
    //       lov: 'variant'
    //     }
    //   })
    //   showProductModal()
    // }
    // const variantIdFromItem = modalType === 'edit' && !!item.variantId

    const hdlSearchPagination = (page) => {
      const query = {
        q: searchTextSupplier,
        page: page.current,
        pageSize: page.pageSize
      }
      onSearchSupplierData(query)
    }

    const hdlSearch = (e) => {
      onSearchSupplier(e, tmpSupplierData)
    }

    const modalSupplierProps = {
      title: 'Supplier',
      visible: modalSupplierVisible,
      footer: null,
      hdlSearch,
      onCancel () {
        dispatch({
          type: 'purchase/updateState',
          payload: {
            modalSupplierVisible: false
          }
        })
      }
    }

    const onChangeShopeeCategory = (event) => {
      setFieldsValue({
        shopeeBrandId: {}
      })
      if (event && event.key) {
        getShopeeBrand(event.key)
        getShopeeAttribute(event.key)
      }
    }

    const handleMenuClick = (record) => {
      let a = getFieldValue('transDate')
      onChooseSupplier(record)
      dispatch({
        type: 'purchase/updateState',
        payload: {
          modalSupplierVisible: false
        }
      })
      if (record.paymentTempo) {
        message.success(`Supplier ${record.supplierName}  ${record.paymentTempo ? `has ${record.paymentTempo} ${parseFloat(record.paymentTempo) > 1 ? 'days' : 'day'}` : ''} tempo`)
        setFieldsValue({ tempo: record.paymentTempo })
        if (a) {
          onChangeDate(moment(a).add(record.paymentTempo, 'days').format('YYYY-MM-DD'))
        }
      }
    }

    const columns = [
      {
        title: 'ID',
        dataIndex: 'supplierCode',
        key: 'supplierCode',
        width: '20%'
      },
      {
        title: 'Name',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width: '45%'
      },
      {
        title: 'Address',
        dataIndex: 'address01',
        key: 'address01',
        width: '45%'
      }
    ]

    const getShopeeCategoryRecommendation = () => {
      const productName = getFieldValue('productName')
      if (productName !== '' && productName) {
        onGetShopeeCategory(productName)
      }
    }

    const onSetCategoryShopee = (id, name) => {
      setFieldsValue({
        shopeeCategoryId: {
          key: id,
          label: name
        },
        shopeeBrandId: {}
      })
      message.success(`Success set category shopee to ${name}`)
      if (id) {
        getShopeeBrand(id)
        getShopeeAttribute(id)
      }
    }

    return (
      <Form layout="horizontal">
        <FooterToolbar>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['productstock/add'] || loadingButton.effects['productstock/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" disabled={loadingButton && (loadingButton.effects['productstock/add'] || loadingButton.effects['productstock/edit'])} onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </FooterToolbar>
        <Card {...cardProps}>
          <BackTop visibilityHeight={10} />
          <Row>
            <Col {...column}>
              <FormItem label="Product Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('productCode', {
                  initialValue: modalType === 'add' && typeof lastTrans === 'string' ? lastTrans : item.productCode,
                  rules: [
                    {
                      required: true,
                      pattern: modalType === 'add' ? /^[a-z0-9/-]{3,30}$/i : /^[A-Za-z0-9-.,() _/]{3,30}$/i,
                      message: 'a-Z & 0-9'
                    }
                  ]
                })(<Input disabled={modalType === 'add' && typeof lastTrans === 'string' ? true : disabled} maxLength={30} onChange={e => changeProductCode(e)} autoFocus />)}
              </FormItem>
              <FormItem label="Product Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('productName', {
                  initialValue: item.productName,
                  rules: [
                    {
                      required: true,
                      message: 'a-Z & 0-9'
                    }
                  ]
                })(<Input maxLength={85} onChange={this.changeName} />)}
              </FormItem>
              <FormItem label="Inventory Type" hasFeedback help={listInventory && listInventory.length > 1 ? `Required For: ${listInventory.slice(1, listInventory.length).map(item => item.type)}` : null} {...formItemLayout}>
                {getFieldDecorator('inventoryType', {
                  initialValue: modalType === 'add' && productInventory.length > 0 ? 'DEF' : item.inventoryType,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productInventory}
                </Select>)}
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
              {/* <FormItem help={!(getFieldValue('categoryId') || {}).key ? 'Fill category field' : `${modalType === 'add' ? listSpecification.length : listSpecificationCode.length} Specification`} label="Manage" {...formItemLayout}>
                <Button.Group>
                  {modalType === 'edit' && variantIdFromItem && <Button disabled={modalType === 'add'} onClick={handleShowVariant} type="primary">Variant</Button>}
                  <Button disabled={getFieldValue('categoryId') ? !getFieldValue('categoryId').key : null} onClick={handleShowSpecification}>Specification</Button>
                </Button.Group>
              </FormItem> */}
            </Col>
            <Col {...column}>
              <FormItem label="Barcode 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barCode01', {
                  initialValue: modalType === 'edit' ? item.barCode01 : getFieldValue('productCode')
                })(<Input />)}
              </FormItem>
              <FormItem label="Barcode 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barCode02', {
                  initialValue: modalType === 'edit' ? item.barCode02 : getFieldValue('productCode')
                })(<Input />)}
              </FormItem>

              <FormItem label="Supplier" {...formItemLayout}>
                <Button {...buttonSupplierProps} size="default">{item.supplierId && item.supplierName ? `${item.supplierName.substring(0, 12)} (${item.supplierCode})` : 'Search Supplier'}</Button>
              </FormItem>

              {/* {(modalType === 'add' || !variantIdFromItem) &&
                <FormItem
                  label="Use Variant"
                  {...formItemLayout}
                >
                  {getFieldDecorator('useVariant', {
                    valuePropName: 'checked',
                    initialValue: !!item.useVariant || !!item.variantId
                  })(<Checkbox>Use Variant</Checkbox>)}
                </FormItem>} */}

              {/* {(modalType === 'add' || !variantIdFromItem) && getFieldValue('useVariant') &&
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
                )} */}
            </Col>
          </Row>
        </Card>
        <Row>
          <Col {...parentThreeDivision}>
            <Card {...cardProps} title={<h3>Pricing</h3>}>
              <Row>
                <FormItem label={getDistPriceName('sellPrice')} help={getDistPriceDescription('sellPrice')} hasFeedback {...formItemLayout}>
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
                <FormItem label={getDistPriceName('distPrice01')} help={getDistPriceDescription('distPrice01')} hasFeedback {...formItemLayout}>
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
                <FormItem label={getDistPriceName('distPrice02')} help={getDistPriceDescription('distPrice02')} hasFeedback {...formItemLayout}>
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
                <FormItem label={getDistPriceName('distPrice03')} help={getDistPriceDescription('distPrice03')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice03', {
                    initialValue: item.distPrice03,
                    rules: [
                      {
                        required: true,
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} />)}
                </FormItem>
                <FormItem label={getDistPriceName('distPrice04')} help={getDistPriceDescription('distPrice04')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice04', {
                    initialValue: item.distPrice04,
                    rules: [
                      {
                        required: true,
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} />)}
                </FormItem>
                <FormItem label={getDistPriceName('distPrice05')} help={getDistPriceDescription('distPrice05')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice05', {
                    initialValue: item.distPrice05,
                    rules: [
                      {
                        required: true,
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} />)}
                </FormItem>
                <FormItem label={getDistPriceName('distPrice06')} help={getDistPriceDescription('distPrice06')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice06', {
                    initialValue: item.distPrice06,
                    rules: [
                      {
                        required: true,
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} />)}
                </FormItem>
                <FormItem label={getDistPriceName('distPrice07')} help={getDistPriceDescription('distPrice07')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice07', {
                    initialValue: item.distPrice07,
                    rules: [
                      {
                        required: true,
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber {...InputNumberProps} />)}
                </FormItem>
                <FormItem label={getDistPriceName('distPrice08')} help={getDistPriceDescription('distPrice08')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice08', {
                    initialValue: item.distPrice08,
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
              </Row>
            </Card>
          </Col>
          <Col {...parentThreeDivision}>
            <Card {...cardProps} title={<h3>Shopee</h3>}>
              <FormItem label="Enable Shopee" {...formItemLayout}>
                {getFieldDecorator('enableShopee', {
                  valuePropName: 'checked',
                  initialValue: item.enableShopee === undefined
                    ? false
                    : item.enableShopee
                })(<Checkbox
                  disabled={modalType === 'edit' && item.enableShopee}
                  onFocus={() => {
                    getShopeeCategoryRecommendation()
                  }}
                >Publish</Checkbox>)}
              </FormItem>
              {getFieldValue('enableShopee') ? (<div>
                <FormItem label="Shopee Category" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('shopeeCategoryId', {
                    initialValue: item.shopeeCategoryId ? {
                      key: item.shopeeCategoryId,
                      label: item.shopeeCategoryName
                    } : {},
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    labelInValue
                    onChange={onChangeShopeeCategory}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                  >{shopeeCategory}
                  </Select>)}
                </FormItem>

                {listShopeeCategoryRecommend && listShopeeCategoryRecommend.length > 0 ? (
                  <div>
                    {'Recommend Category: '}
                    {listShopeeCategoryRecommend.map((item) => {
                      let categoryName = item
                      const filteredCategory = listShopeeCategory.filter(filtered => parseFloat(filtered.category_id) === parseFloat(item))
                      if (filteredCategory && filteredCategory[0]) {
                        const c = filteredCategory[0]
                        categoryName = `${c.original_category_name} | ${c.display_category_name}`
                      }
                      return (
                        <div><a onClick={() => onSetCategoryShopee(item, categoryName)}>{categoryName}</a></div>
                      )
                    })}
                  </div>) : null}

                {getFieldValue('shopeeCategoryId') && getFieldValue('shopeeCategoryId').key ? (
                  <FormItem label="Shopee Brand" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('shopeeBrandId', {
                      initialValue: item.shopeeBrandId ? {
                        key: item.shopeeBrandId,
                        label: item.shopeeBrandName
                      } : {},
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Select
                      showSearch
                      allowClear
                      onSearch={this.changeBrand}
                      optionFilterProp="children"
                      labelInValue
                      notFoundContent={loadingButton.effects['shopeeCategory/queryBrand'] ? <Spin size="small" /> : null}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                    >{shopeeBrand}
                    </Select>)}
                  </FormItem>
                ) : null}
                {getFieldValue('shopeeCategoryId')
                  && getFieldValue('shopeeCategoryId').key ? listShopeeAttribute.map((attribute) => {
                    if (attribute.input_type === 'COMBO_BOX' || attribute.input_type === 'DROP_DOWN' || attribute.input_type === 'MULTIPLE_SELECT_COMBO_BOX' || attribute.input_type === 'MULTIPLE_SELECT') {
                      return (<FormItem label={attribute.display_attribute_name} hasFeedback {...formItemLayout}>
                        {getFieldDecorator(`attribute-${attribute.attribute_id}`, {
                          initialValue: attribute.initialValue,
                          rules: [
                            {
                              required: attribute.is_mandatory
                            }
                          ]
                        })(<Select
                          showSearch
                          allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                        >{
                            (attribute.attribute_value_list || []).length > 0
                              ? attribute.attribute_value_list.map(c => <Option value={c.value_id} key={c.value_id} title={`${c.display_value_name}`}>{`${c.display_value_name}`}</Option>) : []}
                        </Select>)}
                      </FormItem>)
                    }

                    if (attribute.input_type === 'TEXT_FILED') {
                      if (attribute.input_validation_type === 'STRING_TYPE') {
                        return (<FormItem label={attribute.display_attribute_name} hasFeedback {...formItemLayout}>
                          {getFieldDecorator(`attribute-${attribute.attribute_id}`, {
                            initialValue: attribute.initialValue,
                            rules: [
                              {
                                required: attribute.is_mandatory
                              }
                            ]
                          })(<Input maxLength={100} />)}
                        </FormItem>)
                      }
                      if (attribute.input_validation_type === 'DATE_TYPE') {
                        if (attribute.date_format_type === 'YEAR_MONTH') {
                          return (<FormItem label={attribute.display_attribute_name} hasFeedback {...formItemLayout}>
                            {getFieldDecorator(`attribute-${attribute.attribute_id}`, {
                              initialValue: attribute.initialValue,
                              rules: [
                                {
                                  required: attribute.is_mandatory
                                }
                              ]
                            })(<MonthPicker placeholder="Select month" />)}
                          </FormItem>)
                        }
                        if (attribute.date_format_type === 'YEAR_MONTH_DATE') {
                          return (<FormItem label={attribute.display_attribute_name} hasFeedback {...formItemLayout}>
                            {getFieldDecorator(`attribute-${attribute.attribute_id}`, {
                              initialValue: attribute.initialValue,
                              rules: [
                                {
                                  required: attribute.is_mandatory
                                }
                              ]
                            })(<DatePicker placeholder="Select date" />)}
                          </FormItem>)
                        }
                      }
                    }
                    return null
                  }) : null}
                <FormItem label="Shopee Logistic" help={`${getFieldValue('shopeeLogistic') && getFieldValue('shopeeLogistic').length ? getFieldValue('shopeeLogistic').length : 0} Logistics Selected`} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('shopeeLogistic', {
                    initialValue: item.shopeeLogistic || [],
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    showSearch
                    size="large"
                    multiple
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                  >{shopeeLogistic}
                  </Select>)}
                </FormItem>
                <FormItem label="Dangerous Item" help="won't appear on the Android/IOS" {...formItemLayout}>
                  {getFieldDecorator('shopeeItemDangerous', {
                    valuePropName: 'checked',
                    initialValue: item.shopeeItemDangerous === undefined
                      ? false
                      : item.shopeeItemDangerous
                  })(<Checkbox>Dangerous</Checkbox>)}
                </FormItem>
              </div>) : null}
            </Card>
            <Card {...cardProps} title={<h3>Advance Product Utility</h3>}>
              <FormItem label="Publish on e-commerce" {...formItemLayout}>
                {getFieldDecorator('activeShop', {
                  valuePropName: 'checked',
                  initialValue: item.activeShop === undefined
                    ? getFieldValue('productImage') && getFieldValue('productImage').fileList && getFieldValue('productImage').fileList.length > 0
                    : item.activeShop
                })(<Checkbox>Publish</Checkbox>)}
              </FormItem>
              <FormItem label="Track Qty" {...formItemLayout}>
                {getFieldDecorator('trackQty', {
                  valuePropName: 'checked',
                  initialValue: item.trackQty == null ? true : !!item.trackQty
                })(<Checkbox>Track</Checkbox>)}
              </FormItem>
              <FormItem label="Alert Qty" hasFeedback {...formItemLayout}>
                {getFieldDecorator('alertQty', {
                  initialValue: item.alertQty == null ? 1 : item.alertQty,
                  rules: [
                    {
                      required: getFieldValue('trackQty'),
                      pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                      message: '0-9'
                    }
                  ]
                })(<InputNumber {...InputNumberProps} />)}
              </FormItem>
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
            </Card>
          </Col>
          <Col {...parentThreeDivision}>
            <Card {...cardProps} title={<h3>Grabmart</h3>}>
              <FormItem label="Grab Category" hasFeedback {...formItemLayout}>
                {getFieldDecorator('grabCategoryId', {
                  initialValue: item.grabCategoryId ? {
                    key: item.grabCategoryId,
                    label: item.grabCategoryName
                  } : {},
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  labelInValue
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{grabCategory}
                </Select>)}
              </FormItem>
              <FormItem
                label="Weight"
                help="Example: 500 g, 10 kg, 12 per pack, 12 ml, 1 L"
                {...formItemLayout}
              >
                {getFieldDecorator('weight', {
                  initialValue: modalType === 'edit' ? item.weight : formatWeight(formatDimension(getFieldValue('productName'))),
                  rules: [
                    {
                      required: true,
                      message: 'Example: 500 g, 10 kg, 12 per pack, 12 ml, 1 L',
                      pattern: /^([0-9]{1,5})[ ](g|kg|per pack|ml|L)$/
                    }
                  ]
                })(<Input maxLength={20} />)}
              </FormItem>
              <FormItem label="Image" {...formItemLayout}>
                {getFieldDecorator('productImage', {
                  initialValue: item.productImage
                    && item.productImage != null
                    && item.productImage !== '["no_image.png"]'
                    && item.productImage !== '"no_image.png"'
                    && item.productImage !== 'no_image.png' ?
                    {
                      fileList: JSON.parse(item.productImage).map((detail, index) => {
                        return ({
                          uid: index + 1,
                          name: detail,
                          status: 'done',
                          url: `${IMAGEURL}/${detail}`,
                          thumbUrl: `${IMAGEURL}/${detail}`
                        })
                      })
                    }
                    : [],
                  rules: [
                    {
                      required: getFieldValue('enableShopee')
                    }
                  ]
                })(
                  <Upload
                    {...props}
                    multiple
                    showUploadList={{
                      showPreviewIcon: true
                    }}
                    defaultFileList={item.productImage
                      && item.productImage != null
                      && item.productImage !== '["no_image.png"]'
                      && item.productImage !== '"no_image.png"'
                      && item.productImage !== 'no_image.png' ?
                      JSON.parse(item.productImage).map((detail, index) => {
                        return ({
                          uid: index + 1,
                          name: detail,
                          status: 'done',
                          url: `${IMAGEURL}/${detail}`,
                          thumbUrl: `${IMAGEURL}/${detail}`
                        })
                      })
                      : []}
                    listType="picture"
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
              <FormItem label="Dimension" {...formItemLayout}>
                {getFieldDecorator('dimension', {
                  initialValue: modalType === 'add' ?
                    formatDimension(getFieldValue('productName')) : item.dimension,
                  rules: [
                    {
                      required: true,
                      message: 'Required when product image is filled'
                    }
                  ]
                })(<Input maxLength={30} />)}
              </FormItem>
              <FormItem label="Per Box" {...formItemLayout} help="Isi Dalam 1 Karton Pengiriman">
                {getFieldDecorator('dimensionBox', {
                  initialValue: modalType === 'add' ? formatBox(formatDimension(getFieldValue('productName'))) : item.dimensionBox,
                  rules: [
                    {
                      required: true,
                      pattern: /^([0-9]{1,5})$/,
                      message: 'Required when product image is filled'
                    }
                  ]
                })(<Input maxLength={25} />)}
              </FormItem>
              <FormItem label="Per Pack" {...formItemLayout} help="Isi Dalam 1 Produk">
                {getFieldDecorator('dimensionPack', {
                  initialValue: modalType === 'add' ? formatPack(formatDimension(getFieldValue('productName'))) : item.dimensionPack,
                  rules: [
                    {
                      required: true,
                      pattern: /^([0-9]{1,5})$/,
                      message: 'Required when product image is filled'
                    }
                  ]
                })(<Input maxLength={25} />)}
              </FormItem>
              <FormItem label="Description" {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                  rules: [
                    {
                      pattern: getFieldValue('enableShopee') ? /^[\s\S]{20,65535}$/ : undefined,
                      required: getFieldValue('enableShopee') || (getFieldValue('productImage') && getFieldValue('productImage').fileList && getFieldValue('productImage').fileList.length > 0),
                      message: getFieldValue('enableShopee') ? 'Min 20 Character' : 'Required when product image is filled'
                    }
                  ]
                })(<TextArea maxLength={65535} autosize={{ minRows: 2, maxRows: 10 }} />)}
              </FormItem>
            </Card>
          </Col>
        </Row>
        {modalSupplierVisible && (
          <ModalSupplier {...modalSupplierProps}>
            <Table
              bordered
              pagination={paginationSupplier}
              scroll={{ x: 500 }}
              columns={columns}
              simple
              loading={loadingButton.effects['purchase/querySupplier']}
              dataSource={listSupplier}
              size="small"
              pageSize={10}
              onChange={hdlSearchPagination}
              onRowClick={_record => handleMenuClick(_record)}
            />
          </ModalSupplier>
        )}
        {modalVariantVisible && <Variant {...modalVariantProps} />}
        {modalSpecificationVisible && <Specification {...modalSpecificationProps} />}
        {modalProductVisible && <Stock {...modalProductProps} />}
      </Form>
    )
  }
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
