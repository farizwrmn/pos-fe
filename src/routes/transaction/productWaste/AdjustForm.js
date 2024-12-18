import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  message,
  Input,
  Button,
  Select,
  Modal,
  // Popover, Table, Icon,
  Row,
  Col,
  DatePicker
} from 'antd'
import { DataQuery } from 'components'
import { lstorage, alertModal } from 'utils'
import moment from 'moment'
import Browse from './Browse'
// import styles from '../../../themes/index.less'

const { checkPermissionMonthTransaction } = alertModal
const dateFormat = 'YYYY/MM/DD'
const FormItem = Form.Item
// const { TextArea } = Input
const { Stock } = DataQuery
// const { Search } = Input

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 9 }, md: { span: 9 }, lg: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 10 }, md: { span: 10 }, lg: { span: 10 } },
  style: { marginBottom: 3 }
}
const formItemLayout1 = {
  labelCol: { xs: { span: 24 }, sm: { span: 9 }, md: { span: 9 }, lg: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 14 }, lg: { span: 15 } },
  style: { marginBottom: 3 }
}

const { Option } = Select

class AdjustForm extends Component {
  componentDidMount () {
    const { changeDisabledItem, loadData, templistType } = this.props
    const variable = templistType.filter(x => x.code === 'AJOUT')
    if (!variable[0]) {
      return
    }
    const { miscVariable } = variable[0]
    let disabledItem = {}
    let adjust = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
    if (miscVariable === 'IN') {
      disabledItem.disabledItemOut = true
      disabledItem.disabledItemIn = false
      if (Object.keys(adjust).length > 0) {
        for (let n = 0; n < adjust.length; n += 1) {
          adjust[n].Out = 0
        }
        localStorage.setItem('adjust', JSON.stringify(adjust))
      }
    } else if (miscVariable === 'OUT') {
      disabledItem.disabledItemOut = false
      disabledItem.disabledItemIn = true
      if (Object.keys(adjust).length > 0) {
        for (let n = 0; n < adjust.length; n += 1) {
          adjust[n].In = 0
        }
        localStorage.setItem('adjust', JSON.stringify(adjust))
      }
    }
    changeDisabledItem(disabledItem)
    loadData()
  }
  render () {
    const {
      modalProductVisible,
      loadingButton,
      dispatch,
      showProductModal,
      lastTrans,
      loadData,
      changeDisabledItem,
      templistType,
      onChooseItem,
      onResetAll,
      onGetEmployee,
      itemEmployee,
      listType,
      listEmployee,
      item,
      onOk,
      listReason,
      form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields,
        resetFields
      },
      dataBrowse,
      listAccountCode,
      ...adjustProps
    } = this.props

    const adjustOpts = {
      dataBrowse,
      ...adjustProps
    }
    const handleButtonSaveClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          pic: itemEmployee !== null ? itemEmployee.employeeName : '',
          picId: itemEmployee !== null ? itemEmployee.employeeId : '',
          storeId: lstorage.getCurrentUserStore()
        }

        const checkPermission = checkPermissionMonthTransaction(moment(data.transDate).format('YYYY-MM-DD'))
        if (checkPermission) {
          return
        }

        data.transType = data.transType
        data.accountId = data.accountId && data.accountId.key ? data.accountId.key : null
        Modal.confirm({
          title: 'Save Adjustment',
          content: 'Are you sure ?',
          onOk () {
            onOk(data, resetFields)
          }
        })
      })
    }

    const changeCascader = (value) => {
      const variable = templistType.filter(x => x.code === value)
      if (!variable[0]) {
        return
      }
      const { miscVariable } = variable[0]
      let disabledItem = {}
      let adjust = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      if (miscVariable === 'IN') {
        disabledItem.disabledItemOut = true
        disabledItem.disabledItemIn = false
        if (Object.keys(adjust).length > 0) {
          for (let n = 0; n < adjust.length; n += 1) {
            adjust[n].Out = 0
          }
          localStorage.setItem('adjust', JSON.stringify(adjust))
        }
      } else if (miscVariable === 'OUT') {
        disabledItem.disabledItemOut = false
        disabledItem.disabledItemIn = true
        if (Object.keys(adjust).length > 0) {
          for (let n = 0; n < adjust.length; n += 1) {
            adjust[n].In = 0
          }
          localStorage.setItem('adjust', JSON.stringify(adjust))
        }
      }
      changeDisabledItem(disabledItem)
      loadData()
    }
    const handleButtonDeleteClick = () => {
      Modal.confirm({
        title: 'Delete All Item ?',
        content: 'Are you sure ?',
        onOk () {
          localStorage.removeItem('adjust')
          message.warning('Transaction has been canceled and reset')
          onResetAll()
        }
      })
    }

    const handleShowProduct = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        dispatch({
          type: 'pos/getProducts',
          payload: {
            page: 1
          }
        })
        showProductModal()
      })
    }

    const modalProductProps = {
      location,
      loading: loadingButton,
      visible: modalProductVisible,
      maskClosable: false,
      lov: 'list',
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
        onChooseItem(item)
      }
    }

    const listFilter = listType.filter(filtered => filtered.value !== 'RBB' && filtered.value !== 'RJJ' && filtered.value !== 'AJIN')
    const totalQtyIn = dataBrowse.reduce((prev, next) => prev + (next.In || 0), 0)
    const totalQtyOut = dataBrowse.reduce((prev, next) => prev + (next.Out || 0), 0)
    const totalPrice = dataBrowse.reduce((prev, next) => prev + ((next.price * next.In) + (next.price * next.Out)), 0)
    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
    const listAccountOpt = (listAccountCode || []).length > 0
      ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>)
      : []
    const reasonData = listReason && listReason.map(item => (<Option value={item.paramValue}>{item.paramValue}</Option>))

    return (
      <Form style={{ padding: 3 }}>
        <Row>
          <Col md={24} lg={12}>
            <FormItem label="Trans No" {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: lastTrans,
                rules: [{
                  required: true
                }]
              })(<Input disabled maxLength={25} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Account Code">
              {getFieldDecorator('accountId', {
                initialValue: item.accountId || (listAccountCode && listAccountCode[0] ? {
                  key: listAccountCode[0].id,
                  name: `${listAccountCode[0].accountName} (${listAccountCode[0].accountCode})`
                } : undefined),
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<Select
                disabled
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{listAccountOpt}
              </Select>)}
            </FormItem>
            <FormItem label="Type" {...formItemLayout}>
              {getFieldDecorator('transType', {
                initialValue: listFilter && listFilter.length > 0 ? listFilter[0].value : undefined,
                rules: [{
                  required: true
                }]
              })(
                <Select
                  disabled
                  onSelect={value => changeCascader(value)}
                >
                  {listType
                    .filter(filtered => filtered.value !== 'RBB' && filtered.value !== 'RJJ' && filtered.value !== 'AJIN')
                    .map(item => <Select.Option value={item.value} key={item.value}>{item.value}</Select.Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Date" {...formItemLayout}>
              {getFieldDecorator('transDate', {
                initialValue: moment(),
                rules: [{
                  required: true
                }]
              })(<DatePicker disabled format={dateFormat} />)}
            </FormItem>
            <FormItem label="Reference Date" {...formItemLayout}>
              {getFieldDecorator('referenceDate', {
                initialValue: moment(),
                rules: [{
                  required: false
                }]
              })(<DatePicker format={dateFormat} />)}
            </FormItem>
          </Col>
          <Col md={24} lg={12}>
            <FormItem label="Reference" {...formItemLayout1}>
              {getFieldDecorator('memo', {
                initialValue: listReason && listReason.length > 0 ? listReason[0].paramValue : undefined,
                rules: [{
                  required: true
                }]
              })(<Select
                style={{ width: '100%' }}
                showSearch
                filterOption={filterOption}
              >
                {reasonData}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <br />
        <Button type="primary" size="large" onClick={handleShowProduct} style={{ marginBottom: '8px' }}>Product</Button>
        {modalProductVisible && <Stock {...modalProductProps} />}
        <div style={{ marginBottom: '8px' }}>
          <Browse {...adjustOpts} />
        </div>
        <Form>
          <div style={{ float: 'right' }}>
            <Row>
              <FormItem label="Total In" {...formItemLayout1}>
                <Input value={totalQtyIn.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
            <Row>
              <FormItem label="Total Out" {...formItemLayout1}>
                <Input value={totalQtyOut.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
            <Row>
              <FormItem label="Total Price" {...formItemLayout1}>
                <Input value={totalPrice.toLocaleString()} style={{ fontSize: 20 }} />
              </FormItem>
            </Row>
          </div>
        </Form>
        <Button type="primary" disabled={loadingButton.effects['adjust/add']} style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonSaveClick()}>PROCESS</Button>
        <Button type="danger" disabled={loadingButton.effects['adjust/add']} style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonDeleteClick()}>Delete All</Button>
      </Form>
    )
  }
}


AdjustForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  item: PropTypes.object,
  onGetEmployee: PropTypes.func,
  dispatch: PropTypes.func,
  loadData: PropTypes.func,
  changeDisabledItem: PropTypes.func,
  templistType: PropTypes.array.isRequired,
  dataSource: PropTypes.array
}

export default Form.create()(AdjustForm)
