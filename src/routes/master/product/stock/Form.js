import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Button, Tabs, Row, Col, Checkbox, Upload, Icon, Select, Menu, Dropdown, Modal, message } from 'antd'
import List from './List'
import Filter from './Filter'
import Sticker from './Sticker'
import Shelf from './Shelf'
import PrintPDF from './PrintPDF'
import PrintShelf from './PrintShelf'
import PrintSticker from './PrintSticker'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 11 },
    md: { span: 13 },
    lg: { span: 16 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 7, offset: 0, push: 17 },
    sm: { span: 3, offset: 0, push: 16 },
    md: { span: 3, offset: 0, push: 17 },
    lg: { span: 2, offset: 0, push: 22 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 8 }
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
  changed,
  getAllStock,
  showBrands,
  showPDFModal,
  mode,
  onShowPDFModal,
  onHidePDFModal,
  list,
  listPrintAllStock,
  stockLoading,
  // logo,
  changeTab,
  ...listProps,
  ...filterProps,
  ...printProps,
  ...tabProps,
  ...modalProductProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const { showModalProduct, listItem, update, period, listSticker, modalProductType, onShowModalProduct, onCloseModalProduct,
    onAutoSearch, pushSticker, selectedSticker, onSelectSticker, onSearchUpdateSticker } = modalProductProps
  const { show } = filterProps
  const {
    onShowHideSearch,
    // onCloseModal,
    // showModal,
    changeQty
    // stickerQty
  } = tabProps
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
      data.active = data.active === undefined || data.active === 0 || data.active === false ? 0 : 1
      data.trackQty = data.trackQty === undefined || data.trackQty === 0 || data.trackQty === false ? 0 : 1
      data.exception01 = data.exception01 === undefined || data.exception01 === 0 || data.exception01 === false ? 0 : 1
      if (data.productCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.productCode, data)
          },
          onCancel () { }
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

  const openPDFModal = (mode) => {
    onShowPDFModal(mode)
  }


  // const getDataUri = (url, callback) => {
  //   let image = new Image()

  //   image.onload = function () {
  //     let canvas = document.createElement('canvas')
  //     canvas.width = this.naturalWidth
  //     canvas.height = this.naturalHeight

  //     canvas.getContext('2d').drawImage(this, 0, 0)

  //     // Get raw image data
  //     callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''))

  //     // ... or get as Data URI
  //     callback(canvas.toDataURL('image/png'))
  //   }

  //   image.src = url
  // }

  // const getLogo = () => {
  //   getDataUri(config.logo, (dataUri) => {
  //     convertImage(dataUri)
  //   })
  // }

  // const btnSticker = {
  //   style: { backgroundColor: 'transparent', border: 'none', padding: 0 },
  //   onClick () {
  //     if (dataSource.length === 0) {
  //       Modal.warning({
  //         title: 'Empty Data',
  //         content: 'No Data in Storage'
  //       })
  //     } else {
  //       onShowModal()
  //       getLogo()
  //     }
  //   }
  // }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => openPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      {/* <Menu.Item key="3"><Button {...btnSticker}><Icon type="tag-o" />Sticker</Button></Menu.Item> */}
      <Menu.Item key="2"><Button onClick={() => openPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
      {/* <Menu.Item key="3"><PrintShelf {...printProps} /></Menu.Item> */}
    </Menu>
  )

  let moreButtonTab
  switch (activeKey) {
  case '0':
    moreButtonTab = (<Button onClick={() => browse()}>Browse</Button>)
    break
  case '1':
    moreButtonTab = (
      <div>
        <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button>
        <Dropdown overlay={menu}>
          <Button style={{ marginLeft: 8 }} icon="printer">
              Print
          </Button>
        </Dropdown>
      </div>
    )
    break
  case '2':
    moreButtonTab = (<PrintSticker stickers={listSticker} {...printProps} />)
    break
  case '3':
    moreButtonTab = (<PrintShelf stickers={listSticker} {...printProps} />)
    break
  default:
    break
  }

  const productCategory = listCategory.length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  const productBrand = listBrand.length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []

  // const modalProps = {
  //   visible: showModal,
  //   title: 'Sticker Qty',
  //   width: 250,
  //   footer: [
  //     <Button key="back" onClick={onCloseModal}>Cancel</Button>
  // <PrintSticker total={stickerQty} logo={logo} {...printProps} />
  //   ],
  //   onCancel () {
  //     onCloseModal()
  //   }
  // }

  const stickerProps = {
    onShowModalProduct,
    onCloseModalProduct,
    showModalProduct,
    listItem,
    update,
    period,
    listSticker,
    modalProductType,
    onAutoSearch,
    pushSticker,
    onSearchUpdateSticker,
    changeQty,
    selectedSticker,
    onSelectSticker
  }

  const shelfProps = stickerProps

  const PDFModalProps = {
    visible: showPDFModal,
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      onHidePDFModal()
    }
  }


  const changeButton = () => {
    getAllStock()
  }

  let buttonClickPDF = changed ? (<PrintPDF data={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" size="large" onClick={changeButton} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)
  let buttonClickXLS = changed ? (<PrintXLS data={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" size="large" onClick={changeButton} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)
  let notification = changed ? "Click 'Print All Stock' to print!" : "Click 'Get All Stock' to get all data!"
  let printmode
  if (mode === 'pdf') {
    printmode = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}> <PrintPDF data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    printmode = (<div>{buttonClickXLS}
      <span style={{ padding: '0px 10px' }} />
      <PrintXLS data={list} name="Print Current Page" {...printProps} /></div>)
  }

  return (
    <div>
      {/* {showModal && <Modal {...modalProps}>
        <span style={{ padding: '10px 20px' }}>Qty: <InputNumber {...inputNumberProps} /></span>
      </Modal>} */}
      {showPDFModal && <Modal footer={[]} {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          <Form layout="horizontal">
            <Row>
              <Col {...column}>
                <FormItem label="Product Code" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('productCode', {
                    initialValue: item.productCode,
                    rules: [
                      {
                        required: true,
                        pattern: modalType === 'add' ? /^[a-z0-9/-]{3,30}$/i : /^[A-Za-z0-9-.() _/]{3,30}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input disabled={disabled} maxLength={30} />)}
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
                <FormItem label="Similar Name 1" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('otherName01', {
                    initialValue: item.otherName01
                  })(<Input />)}
                </FormItem>
                <FormItem label="Similar Name 2" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('otherName02', {
                    initialValue: item.otherName02
                  })(<Input />)}
                </FormItem>
                <FormItem label="Category ID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('categoryId', {
                    initialValue: item.categoryId,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    optionFilterProp="children"
                    onFocus={() => category()}
                    mode="default"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >{productCategory}
                  </Select>)}
                </FormItem>
                <FormItem label="Merk" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('brandId', {
                    initialValue: item.brandId,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    optionFilterProp="children"
                    onFocus={() => brand()}
                    mode="default"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >{productBrand}
                  </Select>)}
                </FormItem>
                <FormItem label="barCode 1" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('barCode01', {
                    initialValue: item.barCode01
                  })(<Input />)}
                </FormItem>
                <FormItem label="barCode 2" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('barCode02', {
                    initialValue: item.barCode02
                  })(<Input />)}
                </FormItem>
                <FormItem label="Status" {...formItemLayout}>
                  {getFieldDecorator('active', {
                    valuePropName: 'checked',
                    initialValue: item.active
                  })(<Checkbox>Active</Checkbox>)}
                </FormItem>
              </Col>
              <Col {...column} >
                <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('sellPrice', {
                    initialValue: item.sellPrice,
                    rules: [
                      {
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
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
                  })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
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
                  })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
                </FormItem>
                <FormItem label="Dist Price 1" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice01', {
                    initialValue: item.distPrice01,
                    rules: [
                      {
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
                </FormItem>
                <FormItem label="Dist Price 2" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('distPrice02', {
                    initialValue: item.distPrice02,
                    rules: [
                      {
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
                </FormItem>
                <FormItem label="Track Qty" {...formItemLayout}>
                  {getFieldDecorator('trackQty', {
                    valuePropName: 'checked',
                    initialValue: item.trackQty
                  })(<Checkbox>Track</Checkbox>)}
                </FormItem>
                <FormItem label="Alert Qty" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('alertQty', {
                    initialValue: item.alertQty,
                    rules: [
                      {
                        pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                        message: '0-9'
                      }
                    ]
                  })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
                </FormItem>
              </Col>
              <Col {...column} >
                <FormItem label="Dummy Code" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('dummyCode', {
                    initialValue: item.dummyCode,
                    rules: [
                      {
                        required: true,
                        pattern: modalType === 'add' ? /^[A-Za-z0-9-._/]{3,30}$/i : /^[A-Za-z0-9-.() _/]{3,30}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={30} />)}
                </FormItem>
                <FormItem label="Dummy Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('dummyName', {
                    initialValue: item.dummyName,
                    rules: [
                      {
                        required: true,
                        pattern: /^[A-Za-z0-9-._/ ]{3,50}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={50} />)}
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
                <FormItem label="Exception" {...formItemLayout}>
                  {getFieldDecorator('exception01', {
                    valuePropName: 'checked',
                    initialValue: item.exception01
                  })(<Checkbox>Exception</Checkbox>)}
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
              </Col>
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
        <TabPane tab="Sticker" key="2" >
          <Sticker {...stickerProps} />
        </TabPane>
        <TabPane tab="Shelf" key="3" >
          <Shelf {...shelfProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

formProductCategory.propTypes = {
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

export default Form.create()(formProductCategory)
