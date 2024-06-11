import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Form, Input, Spin, InputNumber, Button, Row, Col, Checkbox, Upload, Icon, Select, Modal, Card, message, Table, BackTop } from 'antd'
import { DataQuery, FooterToolbar } from 'components'
import moment from 'moment'
import { IMAGEURL, rest } from 'utils/config.company'
import { getCountryTaxPercentage, getVATPercentage } from 'utils/tax'
import ModalGrabmartCampaign from 'components/ModalGrabmartCampaign'
import { getDistPriceName, getDistPricePercent, getDistPriceDescription } from 'utils/string'
import { formatWeight, formatBox, formatPack, formatDimension } from 'utils/dimension'
import ModalSupplier from './ModalSupplier'

const { apiCompanyURL } = rest
const { Variant, Specification, Stock } = DataQuery
const { TextArea } = Input
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

const parentThreeDivision = {
  md: { span: 24 },
  lg: { span: 8 }
}

class AdvancedForm extends Component {
  state = {
    name: '',
    typing: false,
    typingTimeout: 0,

    brandName: '',
    brandTyping: false,
    brandTypingTimeout: 0
  }

  render () {
    const {
      listStockPickingLine,
      listPickingLine,
      openPickingLineModal,
      deleteStockPickingLine,
      lastTrans,
      listK3ExpressCategory,
      listK3ExpressBrand,
      item = {},
      onSubmit,
      onCancel,
      onClickPlanogram,
      listTag,
      listSource,
      listDivision,
      listDepartment,
      listSubdepartment,
      onGetSupplier,
      disabled,
      loadingButton,
      modalVariantVisible,
      modalSpecificationVisible,
      modalProductVisible,
      listVariantStock,
      listGrabCategory,
      listInventory,
      listProductCountry,
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
      modalGrabmartCampaignProps,
      listStockLocation,
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

            data.grabCategoryName = data.grabCategoryId ? data.grabCategoryId.label : null
            data.grabCategoryId = data.grabCategoryId ? data.grabCategoryId.key : null
            data.expressCategoryName = data.expressCategoryId ? data.expressCategoryId.label : null
            data.expressCategoryId = data.expressCategoryId ? data.expressCategoryId.key : null
            data.expressBrandName = data.expressBrandId ? data.expressBrandId.label : null
            data.expressBrandId = data.expressBrandId ? data.expressBrandId.key : null
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
    const productLocation = (listStockLocation || []).length > 0 ? listStockLocation.map(c => <Option value={c.id} key={c.id} title={`${c.locationName}`}>{`${c.locationName}`}</Option>) : []
    const productCountry = (listProductCountry || []).length > 0 ? listProductCountry.map(c => <Option value={c.countryName} key={c.countryName} title={`${c.countryCode} - ${c.countryName}`}>{`${c.countryCode} - ${c.countryName}`}</Option>) : []
    const k3expressCategory = (listK3ExpressCategory || []).length > 0 ? listK3ExpressCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName} | ${c.categoryCode}`}>{`${c.categoryName} | ${c.categoryName}`}</Option>) : []
    const k3expressBrand = (listK3ExpressBrand || []).length > 0 ? listK3ExpressBrand.map(c => <Option value={c.id} key={c.id} title={`${c.brandName} | ${c.brandCode}`}>{`${c.brandName} | ${c.brandCode}`}</Option>) : []
    const grabCategory = (listGrabCategory || []).length > 0 ? listGrabCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName} | ${c.subcategoryName}`}>{`${c.categoryName} | ${c.subcategoryName}`}</Option>) : []
    const productCategory = (listCategory || []).length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
    const productBrand = (listBrand || []).length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []
    const productStockPickingLine = (listPickingLine || []).length > 0 ? listPickingLine.map(b => <Option value={b.id} key={b.id}>{b.lineName}</Option>) : []
    // const productVariant = (availableVariant || []).length > 0 ? availableVariant.map(b => <Option value={b.id} key={b.id}>{b.name}</Option>) : []

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

    const onDistPrice = () => {
      const sellPrice = getFieldValue('sellPrice')
      if (sellPrice > 0) {
        setFieldsValue({
          distPrice01: (1 + (getDistPricePercent('distPrice01') / 100)) * sellPrice,
          distPrice02: (1 + (getDistPricePercent('distPrice02') / 100)) * sellPrice,
          distPrice03: (1 + (getDistPricePercent('distPrice03') / 100)) * sellPrice,
          distPrice04: (1 + (getDistPricePercent('distPrice04') / 100)) * sellPrice,
          distPrice05: (1 + (getDistPricePercent('distPrice05') / 100)) * sellPrice,
          distPrice06: (1 + (getDistPricePercent('distPrice06') / 100)) * sellPrice,
          distPrice07: (1 + (getDistPricePercent('distPrice07') / 100)) * sellPrice,
          distPrice08: (1 + (getDistPricePercent('distPrice08') / 100)) * sellPrice,
          distPrice09: (1 + (getDistPricePercent('distPrice09') / 100)) * sellPrice
        })
      }
    }

    const productTag = (listTag || []).length > 0 ? listTag.map(c => <Option value={c.tagCode} key={c.tagCode} title={c.tagDescription}>{c.tagCode} ({c.tagDescription})</Option>) : []
    const productSource = (listSource || []).length > 0 ? listSource.map(c => <Option value={c.id} key={c.id} title={c.sourceName}>{c.sourceName}</Option>) : []
    const productDivision = (listDivision || []).length > 0 ? listDivision.map(c => <Option value={c.id} key={c.id} title={c.divisionName}>{c.divisionName}</Option>) : []
    const productDepartment = (listDepartment || []).length > 0 ? listDepartment.filter(filtered => filtered.divisionId === getFieldValue('divisionId')).map(c => <Option value={c.id} key={c.id} title={c.departmentName}>{c.departmentName}</Option>) : []
    const productSubdepartment = (listSubdepartment || []).length > 0 ? listSubdepartment.filter(filtered => filtered.departmentId === getFieldValue('departmentId')).map(c => <Option value={c.id} key={c.id} title={c.subdepartmentName}>{c.subdepartmentName}</Option>) : []

    return (
      <Form layout="horizontal">
        <Button type="primary" disabled={loadingButton && (loadingButton.effects['planogram/add'] || loadingButton.effects['planogram/edit'])} onClick={onClickPlanogram}>Planogram</Button>
        <Link target="_blank" to="/stock-uom"><Button type="default" style={{ marginLeft: '10px' }}>UOM</Button></Link>
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
                      message: 'a-Z & 0-9',
                      pattern: /^[A-Za-z0-9-.,%'"=><$@^&*!() _/]{3,85}$/i
                    }
                  ]
                })(<Input maxLength={85} onChange={this.changeName} />)}
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
                      required: false
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
              <FormItem label="Description" {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                  rules: [
                    {
                      pattern: getFieldValue('expressActive') ? /^[\s\S]{20,65535}$/ : undefined,
                      required: getFieldValue('expressActive') || (getFieldValue('productImage') && getFieldValue('productImage').fileList && getFieldValue('productImage').fileList.length > 0),
                      message: getFieldValue('expressActive') ? 'Min 20 Character' : 'Required when product image is filled'
                    }
                  ]
                })(<TextArea maxLength={65535} autosize={{ minRows: 2, maxRows: 10 }} />)}
              </FormItem>
            </Col>
            <Col {...column}>
              <FormItem label="Barcode Product" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barCode01', {
                  initialValue: modalType === 'edit' ? item.barCode01 : getFieldValue('productCode')
                })(<Input />)}
              </FormItem>
              <FormItem label="Barcode Box" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barCode02', {
                  initialValue: modalType === 'edit' ? item.barCode02 : getFieldValue('productCode')
                })(<Input />)}
              </FormItem>

              <FormItem label="Master Active Supplier" {...formItemLayout}>
                <Button {...buttonSupplierProps} size="default">{item.supplierId && item.supplierName ? `${item.supplierName.substring(0, 12)} (${item.supplierCode})` : 'Search Supplier'}</Button>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Row>
          <Col {...parentThreeDivision}>
            <Card {...cardProps} title={<h3>Category & Brand</h3>}>
              <FormItem label={(<Link target="_blank" to="/stock-tag">Tag</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('productTag', {
                  initialValue: item.productTag,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productTag}
                </Select>)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/stock-source">Source</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('supplierSource', {
                  initialValue: item.supplierSource,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productSource}
                </Select>)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/stock-division">Division</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('divisionId', {
                  initialValue: item.divisionId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  onChange={() => setFieldsValue({ departmentId: null, subdepartmentId: null })}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productDivision}
                </Select>)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/stock-department">Department</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('departmentId', {
                  initialValue: item.departmentId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  onChange={() => setFieldsValue({ subdepartmentId: null })}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productDepartment}
                </Select>)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/stock-subdepartment">Subdepartment</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('subdepartmentId', {
                  initialValue: item.subdepartmentId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productSubdepartment}
                </Select>)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/master/product/category">Category</Link>)} hasFeedback {...formItemLayout}>
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
              <FormItem label={(<Link target="_blank" to="/master/product/brand">Brand</Link>)} hasFeedback {...formItemLayout}>
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
            </Card>
            <Card {...cardProps} title={<h3>Global Pricing</h3>}>
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
                <Button type="primary" size="small" onClick={() => onDistPrice()}>Auto Fill</Button>
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
                <FormItem label={getDistPriceName('distPrice09')} help={getDistPriceDescription('distPrice09')} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice09', {
                    initialValue: item.distPrice09,
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
            <Card {...cardProps} title={<h3>Purchase Price</h3>} />
            <Card {...cardProps} title={<h3>Sell Price</h3>} />
          </Col>
          <Col {...parentThreeDivision}>
            <Card {...cardProps} title={<h3>Advance Product Utility</h3>}>
              <FormItem label="Publish on e-commerce" {...formItemLayout}>
                {getFieldDecorator('activeShop', {
                  valuePropName: 'checked',
                  initialValue: item.activeShop === undefined
                    ? getFieldValue('productImage') && getFieldValue('productImage').fileList && getFieldValue('productImage').fileList.length > 0
                    : item.activeShop
                })(<Checkbox>Publish</Checkbox>)}
              </FormItem>
              <FormItem label="Stock Opname" {...formItemLayout}>
                {getFieldDecorator('isStockOpname', {
                  valuePropName: 'checked',
                  initialValue: item.isStockOpname == null ? true : item.isStockOpname
                })(<Checkbox>Enable</Checkbox>)}
              </FormItem>
              <FormItem label="Halal" {...formItemLayout}>
                {getFieldDecorator('isHalal', {
                  initialValue: item.isHalal
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                  >
                    <Option value={1} key={1}>Blank</Option>
                    <Option value={2} key={2}>Halal</Option>
                    <Option value={3} key={3}>Non-halal</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxType', {
                  initialValue: modalType === 'add' ? 'E' : item.taxType,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Select>
                  <Option value="E">Exclude (0%)</Option>
                  <Option value="I">Include ({getVATPercentage()}%)</Option>
                  {/* <Option value="S">Exclude ({getVATPercentage()}%)</Option> */}
                  <Option value="O">Include ({getCountryTaxPercentage()}%)</Option>
                  {/* <Option value="X">Exclude ({getCountryTaxPercentage()}%)</Option> */}
                </Select>)}
              </FormItem>
              <FormItem label="Country" hasFeedback help="Usage in price tag" {...formItemLayout}>
                {getFieldDecorator('countryName', {
                  initialValue: modalType === 'add' ? undefined : item.countryName,
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productCountry}
                </Select>)}
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

            <Card {...cardProps} title={<h3>Planogram</h3>}>
              <FormItem label="Dimension Product" {...formItemLayout}>
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
              <FormItem label="Dimension Box" {...formItemLayout}>
                {getFieldDecorator('dimensionBatch', {
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
            </Card>

            <Card {...cardProps} title={<h3>Picking Line</h3>}>
              {listStockPickingLine && listStockPickingLine.length > 0 ? listStockPickingLine.map(pickingLine => (
                <div>
                  <span>Line: {pickingLine.lineName} <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteStockPickingLine(pickingLine.id, item.id)}>X</span></span>
                </div>
              )) : null}
              <FormItem label={(<Link target="_blank" to="/picking-line">Picking Line</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('pickingLineId', {
                  initialValue: listStockPickingLine && listStockPickingLine.length > 0 ? listStockPickingLine[0].pickingLineId : undefined,
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Select
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  showSearch
                >{productStockPickingLine}
                </Select>)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/master/product/location">Store Location</Link>)} hasFeedback help="Usage in transfer out" {...formItemLayout}>
                {getFieldDecorator('locationId', {
                  initialValue: modalType === 'add' ? undefined : item.locationId,
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{productLocation}
                </Select>)}
              </FormItem>
            </Card>
          </Col>
          <Col {...parentThreeDivision}>
            <Card {...cardProps} title={<h3>K3Express</h3>}>
              <FormItem label="Enable K3Express" {...formItemLayout}>
                {getFieldDecorator('expressActive', {
                  valuePropName: 'checked',
                  initialValue: item.expressActive === undefined
                    ? false
                    : item.expressActive
                })(<Checkbox
                  disabled={modalType === 'edit' && item.expressActive}
                >Publish</Checkbox>)}
              </FormItem>
              {getFieldValue('expressActive') ? (<div>
                <FormItem label={(<Link target="_blank" to={'/k3express/product-category'}>Category</Link>)} hasFeedback {...formItemLayout}>
                  {getFieldDecorator('expressCategoryId', {
                    initialValue: item.expressCategoryId ? {
                      key: item.expressCategoryId,
                      label: item.expressCategoryName
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
                  >{k3expressCategory}
                  </Select>)}
                </FormItem>

                {getFieldValue('expressCategoryId') && getFieldValue('expressCategoryId').key ? (
                  <FormItem label={(<Link target="_blank" to={'/k3express/product-brand'}>Brand</Link>)} hasFeedback {...formItemLayout}>
                    {getFieldDecorator('expressBrandId', {
                      initialValue: item.expressBrandId ? {
                        key: item.expressBrandId,
                        label: item.expressBrandName
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
                      notFoundContent={loadingButton.effects['expressProductBrand/queryLove'] ? <Spin size="small" /> : null}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                    >{k3expressBrand}
                    </Select>)}
                  </FormItem>
                ) : null}
              </div>) : null}
            </Card>
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
            </Card>
          </Col>
        </Row>
        {
          modalSupplierVisible && (
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
          )
        }
        {modalVariantVisible && <Variant {...modalVariantProps} />}
        {modalSpecificationVisible && <Specification {...modalSpecificationProps} />}
        {modalProductVisible && <Stock {...modalProductProps} />}
        {modalGrabmartCampaignProps.visible && <ModalGrabmartCampaign {...modalGrabmartCampaignProps} />}
      </Form >
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
