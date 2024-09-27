import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import {
  Form,
  Card,
  Input,
  Upload,
  Icon,
  message,
  Button,
  Row,
  Col,
  Tag,
  Tree,
  Select,
  DatePicker,
  TimePicker,
  Checkbox,
  Modal,
  InputNumber
} from 'antd'
import moment from 'moment'
import has from 'lodash/has'
import { posTotal } from 'utils'
import { IMAGEURL, rest } from 'utils/config.company'
import { FooterToolbar } from 'components'
import ModalLov from './ModalLov'
import ModalRules from './ModalRules'
import ModalReward from './ModalReward'

import ListReward from './ListReward'
import ListRules from './ListRules'
import styles from '../../../themes/index.less'

const Option = Select.Option
const TreeNode = Tree.TreeNode
const { TextArea } = Input
const FormItem = Form.Item
const { RangePicker } = DatePicker
const { apiCompanyURL } = rest

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

class FormCounter extends Component {
  state = {
    isDisableType: false
  }

  render () {
    const {
      showRules = false,
      item = {},
      listGrabCategory = [],
      listAllStores = [],
      listPaymentOption = [],
      listBundlingCategory = [],
      listBank = [],
      onSubmit,
      showModal,
      hideModal,
      getProduct,
      getService,
      listRules,
      listReward,
      typeModal,
      updateListRules,
      updateListReward,
      onCancel,
      modalType,
      button,
      loading,
      confirmEditModal,
      deleteList,
      hideEditModal,
      itemEditListRules,
      itemEditListReward,
      modalEditRulesVisible,
      modalEditRewardVisible,
      showModalEdit,
      modalProductVisible,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        getFieldValue,
        resetFields
      },
      ...props
    } = this.props

    const modalProductProps = {
      type: getFieldValue('type'),
      isModal: false,
      visible: modalProductVisible,
      loading: loading.effects['productstock/query'] || loading.effects['service/query'],
      getProduct,
      getService,
      listRules,
      listReward,
      typeModal,
      onCancel () {
        hideModal()
      },
      onRowClick (item) {
        let type = has(item, 'productCode') ? 'P' : has(item, 'serviceCode') ? 'S' : null
        let categoryCode = null
        let categoryName = null
        if (type === null) {
          if (has(item, 'categoryCode')) {
            categoryCode = item.categoryCode
            categoryName = item.categoryName
            type = 'P'
          }
          if (has(item, 'miscCode')) {
            categoryCode = item.miscName
            categoryName = item.miscDesc
            type = 'S'
          }
        }
        if (typeModal === 'Rules') {
          let arrayProd = []
          const listByCode = listRules
          const checkExists = listByCode.filter(el => el.productCode === item.productCode || el.productCode === item.serviceCode)
          if (checkExists.length === 0) {
            arrayProd = listByCode
            const data = {
              no: arrayProd.length + 1,
              type,
              productId: item.id,
              productCode: type === 'P' ? item.productCode : item.serviceCode,
              productName: type === 'P' ? item.productName : item.serviceName,
              qty: 1
            }
            arrayProd.push(data)
            updateListRules(arrayProd)
            message.success('1 item has been added')
            showModalEdit(data, 0)
          } else {
            Modal.warning({
              title: 'Cannot add product',
              content: 'Already Exists in list'
            })
          }
        } else if (typeModal === 'Reward') {
          let arrayProd = []
          const listByCode = listReward
          const checkExists = listByCode.filter(el => el.productCode === item.productCode || el.productCode === item.serviceCode)
          let checkExistsCategory = []
          if (item.categoryCode) {
            checkExistsCategory = listByCode.filter(filtered => filtered.categoryCode === item.categoryCode)
          } else if (item.miscCode) {
            checkExistsCategory = listByCode.filter(filtered => filtered.categoryCode === item.miscCode)
          }
          if (checkExistsCategory && checkExistsCategory.length > 0) {
            Modal.warning({
              title: 'Already exists',
              content: 'Category already exists in list'
            })
            return
          }
          if (checkExists.length === 0) {
            arrayProd = listByCode

            const data = {
              no: arrayProd.length + 1,
              type,
              productId: item.id,
              productCode: categoryCode === null ? (type === 'P' ? item.productCode : item.serviceCode) : categoryCode,
              productName: categoryName === null ? (type === 'P' ? item.productName : item.serviceName) : categoryName,
              categoryCode: categoryCode !== null ? categoryCode : undefined,
              qty: 1,
              sellPrice: categoryCode === null ? (type === 'P' ? item.sellPrice : item.serviceCost) : 0,
              sellingPrice: categoryCode === null ? (type === 'P' ? item.sellPrice : item.serviceCost) : 0,
              distPrice01: categoryCode === null ? (type === 'P' ? item.distPrice01 : item.serviceCost) : 0,
              distPrice02: categoryCode === null ? (type === 'P' ? item.distPrice02 : item.serviceCost) : 0,
              distPrice03: categoryCode === null ? (type === 'P' ? item.distPrice03 : item.serviceCost) : 0,
              distPrice04: categoryCode === null ? (type === 'P' ? item.distPrice04 : item.serviceCost) : 0,
              distPrice05: categoryCode === null ? (type === 'P' ? item.distPrice05 : item.serviceCost) : 0,
              distPrice06: categoryCode === null ? (type === 'P' ? item.distPrice06 : item.serviceCost) : 0,
              distPrice07: categoryCode === null ? (type === 'P' ? item.distPrice07 : item.serviceCost) : 0,
              distPrice08: categoryCode === null ? (type === 'P' ? item.distPrice08 : item.serviceCost) : 0,
              distPrice09: categoryCode === null ? (type === 'P' ? item.distPrice09 : item.serviceCost) : 0,
              discount: 0,
              disc1: 0,
              disc2: 0,
              disc3: 0
            }
            data.total = posTotal(data)
            arrayProd.push(data)
            updateListReward(arrayProd)
            message.success('1 item has been added')
            showModalEdit(data, 1)
          } else {
            Modal.warning({
              title: 'Cannot add product',
              content: 'Already Exists in list'
            })
          }
        }
      }
    }

    const modalRulesProps = {
      item: itemEditListRules,
      visible: modalEditRulesVisible,
      onOkList (data) {
        message.info('1 item has been edited')
        confirmEditModal(data, 0)
      },
      onCancelList () {
        hideEditModal()
      },
      onCancel () {
        hideEditModal()
      },
      onDeleteItem (id) {
        let arrayProd = listRules.slice()
        Array.prototype.remove = function () {
          let what
          let a = arguments
          let L = a.length
          let ax
          while (L && this.length) {
            what = a[L -= 1]
            while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1)
            }
          }
          return this
        }

        let ary = arrayProd
        ary.remove(arrayProd[id])
        arrayProd = []
        for (let n = 0; n < ary.length; n += 1) {
          arrayProd.push({
            no: n + 1,
            type: ary[n].type,
            productId: ary[n].productId,
            productCode: ary[n].productCode,
            productName: ary[n].productName,
            qty: ary[n].qty
          })
        }
        deleteList(arrayProd, 0)
      }
    }

    const modalRewardProps = {
      type: getFieldValue('type'),
      item: itemEditListReward,
      visible: modalEditRewardVisible,
      onOkList (data) {
        message.info('1 item has been edited')
        confirmEditModal(data, 1)
      },
      onCancelList () {
        hideEditModal()
      },
      onCancel () {
        hideEditModal()
      },
      onDeleteItem (id) {
        let arrayProd = listReward.slice()
        Array.prototype.remove = function () {
          let what
          let a = arguments
          let L = a.length
          let ax
          while (L && this.length) {
            what = a[L -= 1]
            while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1)
            }
          }
          return this
        }

        let ary = arrayProd
        ary.remove(arrayProd[id])
        arrayProd = []
        for (let n = 0; n < ary.length; n += 1) {
          const data = {
            no: n + 1,
            id: ary[n].id,
            type: ary[n].type,
            productId: ary[n].productId,
            productCode: ary[n].productCode,
            productName: ary[n].productName,
            qty: ary[n].qty,
            sellPrice: ary[n].sellPrice,
            sellingPrice: ary[n].sellingPrice,
            discount: ary[n].discount,
            disc1: ary[n].disc1,
            disc2: ary[n].disc2,
            disc3: ary[n].disc3
          }
          data.total = posTotal(data)
          arrayProd.push(data)
        }
        deleteList(arrayProd, 1)
      }
    }

    const handleCancel = () => {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          onCancel()
          resetFields()
        },
        onCancel () {
          console.log('cancel')
        }
      })
    }

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        data.grabCategoryName = data.grabCategoryId ? data.grabCategoryId.label : null
        data.grabCategoryId = data.grabCategoryId ? data.grabCategoryId.key : null
        data.startDate = (data.Date || []).length > 0 ? moment(data.Date[0]).format('YYYY-MM-DD') : null
        data.endDate = (data.Date || []).length > 0 ? moment(data.Date[1]).format('YYYY-MM-DD') : null
        data.availableDate = (data.availableDate || []).length > 0 ? data.availableDate.toString() : null
        data.availableStore = (data.availableStore || []).length > 0 ? data.availableStore.toString() : null
        data.startHour = data.startHour ? moment(data.startHour).format('HH:mm') : null
        data.endHour = data.endHour ? moment(data.endHour).format('HH:mm') : null
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data, listRules, listReward, resetFields)
          },
          onCancel () { }
        })
      })
    }

    const handleGetService = (type) => {
      showModal(type)
    }

    const renderTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode {...item} />
      })
    }
    const columns = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '100'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '100',
        render: (text) => {
          return (
            <span>
              <Tag color={text === 'P' ? 'green' : 'blue'}>
                {text === 'P' ? 'Product' : 'Service'}
              </Tag>
            </span>
          )
        }
      },
      {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode',
        width: '175'
      },
      {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '175'
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        className: styles.alignRight,
        width: '75'
      }
    ]
    const columnsReward = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '100'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '100',
        render: (text) => {
          return (
            <span>
              <Tag color={text === 'P' ? 'green' : 'blue'}>
                {text === 'P' ? 'Product' : 'Service'}
              </Tag>
            </span>
          )
        }
      },
      {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode',
        width: '175'
      },
      {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '175'
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        className: styles.alignRight,
        width: '75'
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        className: styles.alignRight,
        width: '75'
      }
    ]

    const columnsRewardGetDiscount = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '100'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '100',
        render: (text) => {
          return (
            <span>
              <Tag color={text === 'P' ? 'green' : 'blue'}>
                {text === 'P' ? 'Product' : 'Service'}
              </Tag>
            </span>
          )
        }
      },
      {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode',
        width: '175'
      },
      {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '175'
      }
    ]

    const listRulesProps = {
      dataSource: listRules,
      columns,
      onRowClick (item) {
        if (modalType === 'add') {
          showModalEdit(item, 0)
        }
      }
    }

    const listRewardProps = {
      dataSource: listReward,
      type: getFieldValue('type'),
      columns: getFieldValue('type') === '2' ? columnsRewardGetDiscount : columnsReward,
      onRowClick (item) {
        // if (modalType === 'add') {
        showModalEdit(item, 1)
        // }
      }
    }
    let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []
    const disabledDate = (current) => {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    }

    const grabCategory = (listGrabCategory || []).length > 0 ? listGrabCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName} | ${c.subcategoryName}`}>{`${c.categoryName} | ${c.subcategoryName}`}</Option>) : []
    const paymentOptionList = (listPaymentOption || []).length > 0 ? listPaymentOption.map(c => <Option value={c.typeCode} key={c.typeCode} title={c.typeName}>{`${c.typeName} (${c.typeCode})`}</Option>) : []
    const paymentBankList = (listBank || []).length > 0 ? listBank.map(c => <Option value={c.id} key={c.id} title={c.bankName}>{c.bankName}</Option>) : []
    const filterOption = (input, option) => {
      return option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
    }

    const cardProps = {
      bordered: true,
      style: {
        padding: 8,
        marginLeft: 8,
        marginBottom: 8
      }
    }

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

    const categoryBundle = (listBundlingCategory || []).length > 0 ? listBundlingCategory.map(c => <Option value={c.id} key={c.id} title={`${c.categoryName}`}>{`${c.categoryName}`}</Option>) : []

    return (
      <Form layout="horizontal">

        <FooterToolbar>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button size="large" type="danger" className="button-add-items-right" style={{ margin: '0px 5px' }} onClick={handleCancel}>Cancel</Button>}
            <Button size="large" disabled={item.status === '0' || loading.effects['bundling/add'] || loading.effects['bundling/edit']} type="primary" className="button-add-items-right" style={{ margin: '0px 5px' }} onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </FooterToolbar>
        <Row>
          <Col {...column}>
            <Card {...cardProps} title={<h3>Bundle Info</h3>}>
              <FormItem label="Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type || '0',
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select onChange={() => this.setState({ isDisableType: true })} disabled={this.state.isDisableType || modalType === 'edit'}>
                  <Option value="0">Choose Type</Option>
                  <Option value="1">Bundling</Option>
                  <Option value="2">Buy X Get Discount</Option>
                </Select>)}
              </FormItem>
            </Card>
          </Col>
        </Row>
        {getFieldValue('type') !== '0' && <Row>
          <Col {...column}>
            <Card {...cardProps} title={<h3>Bundle Info</h3>}>
              <FormItem label="Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled maxLength={50} />)}
              </FormItem>
              <FormItem label="Barcode" hasFeedback {...formItemLayout}>
                {getFieldDecorator('barcode01', {
                  initialValue: modalType === 'edit' ? item.barcode01 : item.code,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input maxLength={50} />)}
              </FormItem>
              <FormItem label="Promo Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input maxLength={60} />)}
              </FormItem>
              <FormItem label={(<Link target="_blank" to="/marketing/promo-category">Category</Link>)} hasFeedback {...formItemLayout}>
                {getFieldDecorator('bundlingCategoryId', {
                  initialValue: modalType === 'add' ? undefined : item.bundlingCategoryId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{categoryBundle}
                </Select>)}
              </FormItem>
              {getFieldValue('type') === '1' && <FormItem label="Publish on e-commerce" {...formItemLayout}>
                {getFieldDecorator('activeShop', {
                  valuePropName: 'checked',
                  initialValue: item.activeShop === undefined
                    ? getFieldValue('productImage') && getFieldValue('productImage').fileList && getFieldValue('productImage').fileList.length > 0
                    : item.activeShop
                })(<Checkbox disabled={modalType === 'edit' && Number(item.activeShop)} >Publish</Checkbox>)}
              </FormItem>}
            </Card>
          </Col>
          <Col {...column}>
            {!getFieldValue('buildComponent') && (
              <Card {...cardProps} title={<h3>Items</h3>}>
                {showRules && (
                  <div>
                    <Row>
                      <Col span={12}><h2 className="h2-add-items">Rules</h2></Col>
                      <Col span={12}><Button disabled={modalType !== 'add'} className="button-add-items-right" type="primary" icon="plus" onClick={() => handleGetService('Rules')}>Add Items</Button></Col>
                    </Row>
                    <ListRules {...listRulesProps} />
                  </div>
                )}
                <div>
                  <Row>
                    <Col span={12} />
                    <Col span={12}><Button disabled={modalType !== 'add'} className="button-add-items-right" type="primary" icon="plus" onClick={() => handleGetService('Reward')}>Add Items</Button></Col>
                  </Row>
                  <ListReward {...listRewardProps} />
                  Product is using Non-Member Price
                </div>
              </Card>)}
          </Col>
        </Row>}
        {getFieldValue('type') !== '0' && <Row>
          <Col {...column}>
            <Card {...cardProps} title={<h3>Availability</h3>}>
              <FormItem label="Available Period" hasFeedback {...formItemLayout}>
                {getFieldDecorator('Date', {
                  initialValue: item.startDate ? [
                    moment(item.startDate),
                    moment(item.endDate)
                  ] : null,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<RangePicker disabledDate={disabledDate} allowClear />)}
              </FormItem>
              <FormItem label="Available Hour" hasFeedback {...formItemLayout}>
                <Row gutter={12}>
                  <Col span={12}>
                    {getFieldDecorator('startHour', {
                      initialValue: item.startHour ? moment(item.startHour, 'HH:mm') : moment('00:00', 'HH:mm'),
                      rules: [
                        {
                          required: false
                        }
                      ]
                    })(<TimePicker defaultValue={moment('00:00', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('endHour', {
                      initialValue: item.endHour ? moment(item.endHour, 'HH:mm') : moment('23:59', 'HH:mm'),
                      rules: [
                        {
                          required: false
                        }
                      ]
                    })(<TimePicker defaultValue={moment('23:59', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
                  </Col>
                </Row>
              </FormItem>
              <FormItem
                label="Available Days"
                hasFeedback
                help={(getFieldValue('availableDate') || '').length > 0 ? `${(getFieldValue('availableDate') || '').length} ${(getFieldValue('availableDate') || '').length === 1 ? 'day' : 'days'}` : 'clear it if available every day'}
                {...formItemLayout}
              >
                {getFieldDecorator('availableDate', {
                  initialValue: item.availableDate ? (item.availableDate || '').split(',') : [],
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
                  <Option value="1">Monday</Option>
                  <Option value="2">Tuesday</Option>
                  <Option value="3">Wednesday</Option>
                  <Option value="4">Thursday</Option>
                  <Option value="5">Friday</Option>
                  <Option value="6">Saturday</Option>
                  <Option value="7">Sunday</Option>
                </Select>)}
              </FormItem>
              <FormItem
                label="Store"
                hasFeedback
                help={(getFieldValue('availableStore') || '').length > 0 ? `${(getFieldValue('availableStore') || '').length} ${(getFieldValue('availableStore') || '').length === 1 ? 'store' : 'stores'}` : 'clear it if available all stores'}
                {...formItemLayout}
              >
                {getFieldDecorator('availableStore', {
                  initialValue: item.availableStore ? (item.availableStore || '').split(',') : []
                })(
                  <Select
                    mode="multiple"
                    allowClear
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Choose Store"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {childrenTransNo}
                  </Select>
                )}
              </FormItem>
              <FormItem label="Apply Multiple" hasFeedback {...formItemLayout}>
                {getFieldDecorator('applyMultiple', {
                  valuePropName: 'checked',
                  // eslint-disable-next-line eqeqeq
                  initialValue: item.applyMultiple ? (item.applyMultiple == 0 ? 0 : 1) : item.applyMultiple
                })(<Checkbox />)}
              </FormItem>
              {getFieldValue('type') === '1' && <FormItem label="POS Highlight" hasFeedback {...formItemLayout}>
                {getFieldDecorator('isPosHighlight', {
                  valuePropName: 'checked',
                  initialValue: item.isPosHighlight ? (item.isPosHighlight === '0' ? 0 : 1) : item.isPosHighlight
                })(<Checkbox />)}
              </FormItem>}
            </Card>
          </Col>
          <Col {...column}>
            {getFieldValue('type') === '1' && (
              <Card {...cardProps} title={<h3>Advance Bundle Utility</h3>}>
                <FormItem {...formItemLayout} label="Minimum Payment" help="Usage in before payment Offering (ex. Promo DBS Kartu Kredit jika lebih dari 200 ribu maka mendapatkan 1 minuman gratis)">
                  {getFieldDecorator('minimumPayment', {
                    initialValue: modalType === 'add' ? 0 : item.minimumPayment,
                    rules: [{
                      required: true,
                      message: 'Required',
                      pattern: /^([0-9.]{0,11})$/i
                    }]
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                    />
                  )}
                </FormItem>
                {getFieldValue('minimumPayment') > 0 && <FormItem label="Payment Option" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('paymentOption', {
                    initialValue: item.paymentOption,
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={filterOption}
                  >{paymentOptionList}
                  </Select>)}
                </FormItem>}
                {getFieldValue('minimumPayment') > 0 && <FormItem label="Payment Bank" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('paymentBankId', {
                    initialValue: item.paymentBankId,
                    rules: [
                      {
                        required: !!getFieldValue('paymentOption')
                      }
                    ]
                  })(<Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={filterOption}
                  >{paymentBankList}
                  </Select>)}
                </FormItem>}
                <FormItem label="Always On" {...formItemLayout}>
                  {getFieldDecorator('alwaysOn', {
                    valuePropName: 'checked',
                    initialValue: item.alwaysOn === undefined
                      ? false
                      : item.alwaysOn
                  })(<Checkbox>Always On</Checkbox>)}
                </FormItem>
              </Card>
            )}

            {getFieldValue('type') === '2' && (
              <Card {...cardProps} title={<h3>Bundle Price</h3>}>
                <FormItem {...formItemLayout} label="Qty Required" help="Usage in selling 3 item but get discount, the price will be set pro rate">
                  {getFieldDecorator('targetCostPrice', {
                    initialValue: modalType === 'add' ? 0 : item.targetCostPrice,
                    rules: [{
                      required: true,
                      message: 'Required',
                      pattern: /^([0-9.]{0,11})$/i
                    }]
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="Final Price Per Bundle" help="Usage in selling 3 item but get discount, the price will be set pro rate">
                  {getFieldDecorator('targetRetailPrice', {
                    initialValue: modalType === 'add' ? 0 : item.targetRetailPrice,
                    rules: [{
                      required: true,
                      message: 'Required',
                      pattern: /^([0-9.]{0,11})$/i
                    }]
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                    />
                  )}
                </FormItem>
                <FormItem label="Always On" {...formItemLayout}>
                  {getFieldDecorator('alwaysOn', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(<Checkbox disabled>Always On</Checkbox>)}
                </FormItem>
              </Card>
            )}
          </Col>
        </Row>}
        {getFieldValue('type') !== '0' && getFieldValue('type') === '1' && <Row>
          <Col {...column}>
            <Card {...cardProps} title={<h3>Grabmart</h3>}>
              <FormItem label="Grab Category" hasFeedback {...formItemLayout}>
                {getFieldDecorator('grabCategoryId', {
                  initialValue: item.grabCategoryId ? {
                    key: item.grabCategoryId,
                    label: item.grabCategoryName
                  } : {},
                  rules: [
                    {
                      required: false
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
              <FormItem label="Weight" {...formItemLayout}>
                {getFieldDecorator('weight', {
                  initialValue: item.weight,
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
                    : []
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
                      required: getFieldValue('productImage') && getFieldValue('productImage').fileList && getFieldValue('productImage').fileList.length > 0,
                      message: 'Required when product image is filled'
                    }
                  ]
                })(<TextArea maxLength={65535} autosize={{ minRows: 2, maxRows: 6 }} />)}
              </FormItem>
            </Card>
          </Col>
        </Row>}
        {getFieldValue('type') !== '0' && getFieldValue('type') === '1' && (<Row>
          <Col {...column}>
            <Card {...cardProps} title={<h3>Build Component</h3>}>
              <FormItem label="Build your own component" help="You don't need to define the list, build it in transaction form" {...formItemLayout}>
                {getFieldDecorator('buildComponent', {
                  valuePropName: 'checked',
                  initialValue: item.buildComponent === undefined
                    ? false
                    : item.buildComponent
                })(<Checkbox>Build Component</Checkbox>)}
              </FormItem>
              <FormItem label="Have Target Price" {...formItemLayout}>
                {getFieldDecorator('haveTargetPrice', {
                  valuePropName: 'checked',
                  initialValue: item.haveTargetPrice === undefined
                    ? false
                    : item.haveTargetPrice
                })(<Checkbox>Target Price</Checkbox>)}
              </FormItem>
              {getFieldValue('haveTargetPrice') && (<FormItem {...formItemLayout} label="Cost Price">
                {getFieldDecorator('targetCostPrice', {
                  initialValue: item.targetCostPrice,
                  rules: [{
                    required: true,
                    message: 'Required',
                    pattern: /^([0-9.]{0,11})$/i
                  }]
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                  />
                )}
              </FormItem>)}
              {getFieldValue('haveTargetPrice') && (<FormItem {...formItemLayout} label="Retail Price">
                {getFieldDecorator('targetRetailPrice', {
                  initialValue: item.targetRetailPrice,
                  rules: [{
                    required: true,
                    message: 'Required',
                    pattern: /^([0-9.]{0,11})$/i
                  }]
                })(
                  <InputNumber
                    style={{ width: '100%', marginBottom: '20px' }}
                    min={0}
                  />
                )}
              </FormItem>)}
            </Card>
          </Col>
          <Col {...column} />
        </Row>)}
        {modalEditRulesVisible && <ModalRules {...modalRulesProps} />}
        {modalEditRewardVisible && <ModalReward {...modalRewardProps} />}
        {modalProductVisible && <ModalLov {...modalProductProps} />}
      </Form >
    )
  }
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
