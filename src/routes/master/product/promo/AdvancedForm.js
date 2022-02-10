import React from 'react'
import PropTypes from 'prop-types'
// import { routerRedux } from 'dva/router'
import { Form, Input, Button, Row, Col, Upload, Card, Table, Tag, Icon, message } from 'antd'
// InputNumber, Checkbox, Select, Modal, BackTop
// import { DataQuery } from 'components'
import moment from 'moment'
import { IMAGEURL, rest } from 'utils/config.company'
// import { getDistPriceName } from 'utils/string'
import ModalProduct from './ModalProduct'
import styles from '../../../../themes/index.less'

const { apiCompanyURL } = rest
// const { Stock } = DataQuery
const { TextArea } = Input
const FormItem = Form.Item

// const formatWeight = (dimension) => {
//   try {
//     if (dimension) {
//       let newDimension
//       const splitted = dimension.split('X')
//       if (splitted && splitted.length > 0) {
//         newDimension = splitted[splitted.length - 1]
//       }
//       return newDimension
//     }
//     if (dimension === '') {
//       return '100 g'
//     }
//     return dimension
//   } catch (error) {
//     console.log('formatWeight', error)
//     return '100 g'
//   }
// }

// const formatBox = (dimension) => {
//   try {
//     if (dimension && dimension.includes('X')) {
//       let newDimension
//       const splitted = dimension.split('X')
//       if (splitted && splitted.length === 3) {
//         newDimension = splitted[0]
//       }
//       return newDimension
//     }
//     if (dimension === '') {
//       return '1'
//     }
//     return '1'
//   } catch (error) {
//     console.log('formatBox', error)
//     return '1'
//   }
// }

// const formatPack = (dimension) => {
//   try {
//     if (dimension) {
//       let newDimension
//       const splitted = dimension.split('X')
//       if (splitted && splitted.length === 3) {
//         newDimension = splitted[1]
//       }
//       if (splitted && splitted.length === 2) {
//         newDimension = splitted[0]
//       }
//       return newDimension
//     }
//     if (dimension === '') {
//       return '1'
//     }
//     return dimension
//   } catch (error) {
//     console.log('formatPack', error)
//     return '1'
//   }
// }

// const formatDimension = (productName) => {
//   try {
//     let newDimension = ''
//     if (productName) {
//       const splitted = productName.split(' ')
//       if (splitted && splitted.length > 0) {
//         const dimension = splitted[splitted.length - 1]
//         const dimensionSplit = dimension.split('X')
//         if (dimension
//           && /^(g|kg|per pack|ml|L)$/.test(dimensionSplit[dimensionSplit.length - 1])
//           && splitted[splitted.length - 2]
//           && (
//             /^([0-9]{1,})$/.test(splitted[splitted.length - 2])
//             || splitted[splitted.length - 2].includes('X'))
//         ) {
//           newDimension = `${splitted[splitted.length - 2]} ${dimension}`
//         }
//       }
//       return newDimension
//     }
//     return productName
//   } catch (e) {
//     console.log('formatDimension', e)
//     return ''
//   }
// }

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

const AdvancedForm = ({
  lastTrans,
  item = {},
  onSubmit,
  onCancel,
  onGetSupplier,
  disabled,
  loadingButton,
  modalVariantVisible,
  modalSpecificationVisible,
  modalProductVisible,
  listVariantStock,
  listGrabCategory,
  listInventory,
  editItemProductById,
  supplierInformation,
  dispatch,
  modalType,
  button,
  listCategory,
  showCategories,
  listBrand,
  modalSupplierVisible,
  paginationProduct,
  listSupplier,
  tmpSupplierData,
  searchTextSupplier,
  onChooseSupplier,
  onSearchSupplierData,
  onSearchSupplier,
  // product
  searchText,
  onGetProduct,
  tmpProductData,
  searchTextProduct,
  listItem,
  productInformation,
  onSearchProductData,
  onSearchProduct,
  item: currentItem,
  //
  onChangeDate,
  listVariant,
  showBrands,
  showVariant,
  showVariantId,
  showSpecification,
  listSpecification,
  listSpecificationCode,
  showProductModal,
  form: {
    // getFieldDecorator,
    // validateFields,
    // getFieldsValue,
    getFieldValue,
    // resetFields,
    setFieldsValue
  },
  ...props
}) => {
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

  // const handleCancel = () => {
  //   onCancel()
  //   dispatch({
  //     type: 'variantStock/updateState',
  //     payload: {
  //       listVariantStock: []
  //     }
  //   })

  //   dispatch({
  //     type: 'specificationStock/updateState',
  //     payload: {
  //       listSpecificationCode: []
  //     }
  //   })
  //   dispatch({
  //     type: 'specification/updateState',
  //     payload: {
  //       listSpecification: []
  //     }
  //   })
  //   resetFields()
  // }
  // const existVariant = listVariantStock.map(x => x.variantId)

  // const availableVariant = listVariant.map((x) => {
  //   if (existVariant.indexOf(x.id) > -1) {
  //     return {}
  //   }
  //   return x
  // }).filter(x => !!x.id)

  // const handleSubmit = () => {
  //   validateFields((errors) => {
  //     if (errors) {
  //       return
  //     }
  //     const data = {
  //       ...getFieldsValue()
  //     }
  //     if (!getFieldValue('variant') && getFieldValue('useVariant') && !item.productParentId) {
  //       message.warning('Must Choose Product')
  //       return
  //     }
  //     if (getFieldValue('useVariant') && !data.variantId.key) {
  //       message.warning('Must Choose Variant')
  //       return
  //     }
  //     Modal.confirm({
  //       title: 'Do you want to save this item?',
  //       onOk () {
  //         const data = getFieldsValue()
  //         data.grabCategoryName = data.grabCategoryId ? data.grabCategoryId.label : null
  //         data.grabCategoryId = data.grabCategoryId ? data.grabCategoryId.key : null
  //         data.categoryName = data.categoryId ? data.categoryId.label : null
  //         data.categoryId = data.categoryId ? data.categoryId.key : null
  //         data.brandName = data.brandId ? data.brandId.label : null
  //         data.brandId = data.brandId ? data.brandId.key : null
  //         data.variantName = data.variantId ? data.variantId.label : null
  //         data.variantId = data.variantId ? data.variantId.key : null
  //         data.productParentId = item.productParentId
  //         data.productParentName = item.productParentName
  //         data.active = !data.active || data.active === 0 || data.active === false ? 0 : 1
  //         data.trackQty = !data.trackQty || data.trackQty === 0 || data.trackQty === false ? 0 : 1
  //         data.exception01 = !data.exception01 || data.exception01 === 0 || data.exception01 === false ? 0 : 1
  //         data.usageTimePeriod = data.usageTimePeriod || 0
  //         data.usageMileage = data.usageMileage || 0
  //         data.supplierId = modalType === 'add' && supplierInformation && supplierInformation.id
  //           ? supplierInformation.id
  //           : supplierInformation.id || item.supplierId
  //         onSubmit(data.productCode, data, resetFields)
  //         // setTimeout(() => {
  //         // }, 500)
  //       },
  //       onCancel () { }
  //     })
  //   })
  // }

  // const brand = () => {
  //   showBrands()
  // }

  // const handleShowSpecification = () => {
  //   showSpecification()
  // }

  // const category = () => {
  //   // dispatch({
  //   //   type: 'specificationStock/updateState',
  //   //   payload: {
  //   //     listSpecificationCode: []
  //   //   }
  //   // })
  //   // dispatch({
  //   //   type: 'specification/updateState',
  //   //   payload: {
  //   //     listSpecification: []
  //   //   }
  //   // })
  //   showCategories()
  // }

  // const handleChangeCategoryId = (e) => {
  //   dispatch({
  //     type: 'specificationStock/updateState',
  //     payload: {
  //       listSpecificationCode: []
  //     }
  //   })
  //   dispatch({
  //     type: 'specification/updateState',
  //     payload: {
  //       listSpecification: []
  //     }
  //   })
  //   if (modalType === 'add' && (e || {}).key) {
  //     dispatch({
  //       type: 'specification/query',
  //       payload: {
  //         categoryId: e.key
  //       }
  //     })
  //   }
  // }

  // const variant = () => {
  //   showVariantId()
  // }

  // const grabCategory = (listGrabCategory || []).length > 0 ? listGrabCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName} | ${c.subcategoryName}`}>{`${c.categoryName} | ${c.subcategoryName}`}</Option>) : []
  // const productInventory = (listInventory || []).length > 0 ? listInventory.map(c => <Option value={c.code} key={c.code}>{c.type}</Option>) : []
  // const productCategory = (listCategory || []).length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  // const productBrand = (listBrand || []).length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []
  // const productVariant = (availableVariant || []).length > 0 ? availableVariant.map(b => <Option value={b.id} key={b.id}>{b.name}</Option>) : []

  // const changeProductCode = (e) => {
  //   const { value } = e.target
  //   setFieldsValue({ dummyCode: value })
  // }

  // const InputNumberProps = {
  //   placeholder: '0',
  //   style: { width: '100%' },
  //   maxLength: 20
  // }

  // const buttonSupplierProps = {
  //   type: 'primary',
  //   onClick () {
  //     hdlGetSupplier()
  //   }
  // }

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
      q: searchTextProduct,
      page: page.current,
      pageSize: page.pageSize
    }
    onSearchProductData(query)
  }

  const hdlSearch = (e) => {
    onSearchProduct(e, tmpProductData)
  }

  const modalProductProps = {
    title: 'Product',
    visible: modalProductVisible,
    footer: null,
    hdlSearch,
    searchText,
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    }
  }

  const handleMenuClick = (record) => {
    let a = getFieldValue('transDate')
    onChooseSupplier(record)
    dispatch({
      type: 'productstock/updateState',
      payload: {
        modalSupplierVisible: false
      }
    })
    if (record.paymentTempo) {
      message.success(`Product ${record.productName}  ${record.paymentTempo ? `has ${record.paymentTempo} ${parseFloat(record.paymentTempo) > 1 ? 'days' : 'day'}` : ''} tempo`)
      setFieldsValue({ tempo: record.paymentTempo })
      if (a) {
        onChangeDate(moment(a).add(record.paymentTempo, 'days').format('YYYY-MM-DD'))
      }
    }
  }

  // const tailFormItemLayout = {
  //   wrapperCol: {
  //     span: 24,
  //     xs: {
  //       offset: modalType === 'edit' ? 10 : 18
  //     },
  //     sm: {
  //       offset: modalType === 'edit' ? 17 : 22
  //     },
  //     md: {
  //       offset: modalType === 'edit' ? 18 : 22
  //     },
  //     lg: {
  //       offset: modalType === 'edit' ? 11 : 19
  //     }
  //   }
  // }


  const hdlGetProduct = () => {
    onGetProduct()
    dispatch({
      type: 'productstock/updateState',
      payload: {
        modalProductVisible: true
      }
    })
  }

  const columns = [
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'Active' : 'Non-Active'}</Tag>
      }
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      width: '50px',
      className: styles.alignRight,
      render: (text) => {
        if (!loadingButton.effects['pos/showProductQty']) {
          return text || 0
        }
        return <Icon type="loading" />
      }
    }
  ]

  const buttonProductProps = {
    type: 'primary',
    onClick () {
      hdlGetProduct()
    }
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
          <h3>Suba Promo</h3>
        </Col>
      </Row>
    )
  }

  return (
    <Form layout="horizontal">
      {/* <FooterToolbar>
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['productstock/add'] || loadingButton.effects['productstock/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" disabled={loadingButton && (loadingButton.effects['productstock/add'] || loadingButton.effects['productstock/edit'])} onClick={handleSubmit}>{button}</Button>
        </FormItem>
      </FooterToolbar> */}
      <Card {...cardProps}>
        {/* <BackTop visibilityHeight={10} /> */}
        <Row>
          <Col {...column}>
            <FormItem label="Program" hasFeedback {...formItemLayout}>
              {/* {getFieldDecorator('program', {
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9/\n _-]{20,100}$/i,
                    message: 'At least 20 character'
                  }
                ]
              })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 3 }} />)} */}
              <TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 6 }} />
            </FormItem>
            <FormItem label="Level" hasFeedback {...formItemLayout}>
              {/* {getFieldDecorator('level', {
                // initialValue: item.productName,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={3} />)} */}
              <Input maxLength={3} />
            </FormItem>
            {/* cari product promo */}
            <FormItem label="Search Product" {...formItemLayout}>
              <Button {...buttonProductProps} size="default">{item.productCode && item.productName ? `${item.productName.substring(0, 12)} (${item.productCode})` : 'Search Product'}</Button>
            </FormItem>
            <FormItem label="Product Code" {...formItemLayout}>
              <p>{item.productCode}</p>
            </FormItem>
            <FormItem label="Product Name" {...formItemLayout}>
              <p>{item.productName}</p>
            </FormItem>
            <FormItem label="Product Image" {...formItemLayout}>
              <Upload
                {...props}
                multiple
                showUploadList={{
                  showPreviewIcon: true
                }}
                defaultFileList={
                  [
                    {
                      uid: 1,
                      name: 'image1',
                      status: 'done',
                      url: `${IMAGEURL}/uploads/products/Nov2021/5d6b852886529f886a9a7b87258b6256.jpg`,
                      thumbUrl: `${IMAGEURL}/uploads/products/Nov2021/5d6b852886529f886a9a7b87258b6256.jpg`
                    },
                    {
                      uid: 2,
                      name: 'image2',
                      status: 'done',
                      url: `${IMAGEURL}/uploads/products/Nov2021/5d6b852886529f886a9a7b87258b6256.jpg`,
                      thumbUrl: `${IMAGEURL}/uploads/products/Nov2021/5d6b852886529f886a9a7b87258b6256.jpg`
                    },
                    {
                      uid: 3,
                      name: 'image3',
                      status: 'done',
                      url: `${IMAGEURL}/uploads/products/Nov2021/5d6b852886529f886a9a7b87258b6256.jpg`,
                      thumbUrl: `${IMAGEURL}/uploads/products/Nov2021/5d6b852886529f886a9a7b87258b6256.jpg`
                    }
                  ]
                }
                // defaultFileList={item.productImage
                //   && item.productImage != null
                //   && item.productImage !== '["no_image.png"]'
                //   && item.productImage !== '"no_image.png"'
                //   && item.productImage !== 'no_image.png' ?
                //   JSON.parse(item.productImage).map((detail, index) => {
                //     return ({
                //       uid: index + 1,
                //       name: detail,
                //       status: 'done',
                //       url: `${IMAGEURL}/${detail}`,
                //       thumbUrl: `${IMAGEURL}/${detail}`
                //     })
                //   })
                //   : []}
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
              />
            </FormItem>
          </Col>
        </Row>
      </Card>
      {modalProductVisible && (
        <ModalProduct {...modalProductProps}>
          <Table
            bordered
            pagination={paginationProduct}
            scroll={{ x: 500 }}
            columns={columns}
            simple
            loading={loadingButton.effects['productstock/query']}
            dataSource={listItem}
            size="small"
            pageSize={10}
            onChange={hdlSearchPagination}
            onRowClick={_record => handleMenuClick(_record)}
          />
        </ModalProduct>
      )}
      {/* {modalProductVisible && <Stock {...modalProductProps} />} */}
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
