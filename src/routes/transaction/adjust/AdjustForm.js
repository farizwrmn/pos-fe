import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, message, Input, Button,
  // Popover, Table, Icon,
  Row, Col, DatePicker, Cascader, AutoComplete
} from 'antd'
import { DataQuery } from 'components'
import { lstorage, alertModal } from 'utils'
import Browse from './Browse'
// import styles from '../../../themes/index.less'

const { checkPermissionMonthTransaction } = alertModal
const dateFormat = 'YYYY/MM/DD'
const FormItem = Form.Item
const { TextArea } = Input
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
const AdjustForm = ({ modalProductVisible, loadingButton, pagination, dispatch, showProductModal, lastTrans, loadData, changeDisabledItem, templistType, onChooseItem, onResetAll, onGetEmployee, itemEmployee, listType, listEmployee, onSearchProduct, item,
  popoverVisible, onHidePopover, onOk, onChangeSearch, tmpProductList, dataSource, form: { getFieldDecorator, getFieldsValue, validateFields, resetFields }, dataBrowse, ...adjustProps }) => {
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

      const checkPermission = checkPermissionMonthTransaction(data.transDate)
      if (checkPermission) {
        return
      }

      data.transType = data.transType[0]
      onOk(data)
      resetFields()
    })
  }

  const handleGetEmployee = (e) => {
    onGetEmployee(e)
  }

  // const hdlSearch = (e) => {
  //   onSearchProduct(e, tmpProductList)
  // }

  // const hidePopover = () => {
  //   onHidePopover()
  // }

  // const handleChangeSearch = (e) => {
  //   const { value } = e.target
  //   onChangeSearch(value)
  // }

  // const handleMenuClick = (e) => {
  //   onChooseItem(e)
  // }
  const changeCascader = (e) => {
    const value = e[0]
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
    localStorage.removeItem('adjust')
    message.warning('Transaction has been canceled and reset')
    onResetAll()
  }
  // const columns = [
  //   {
  //     title: 'code',
  //     dataIndex: 'productCode',
  //     key: 'productCode',
  //     width: '25%'
  //   },
  //   {
  //     title: 'Product',
  //     dataIndex: 'productName',
  //     key: 'productName',
  //     width: '55%'
  //   },
  //   {
  //     title: 'Cost',
  //     dataIndex: 'costPrice',
  //     key: 'costPrice',
  //     width: '20%',
  //     className: styles.alignRight,
  //     render: text => (text || '-').toLocaleString()
  //   }
  // ]
  // const contentPopover = (
  //   <Table
  //     pagination={pagination}
  //     scroll={{ x: 600, y: 150 }}
  //     columns={columns}
  //     dataSource={dataSource}
  //     simple
  //     // locale={{
  //     //   emptyText: <Button type="primary" onClick={() => hdlGetProduct()}>Reset</Button>
  //     // }}
  //     size="small"
  //     rowKey={record => record.productCode}
  //     onRowClick={record => handleMenuClick(record)}
  //     {...adjustProps}
  //   />
  // )

  const handleShowProduct = () => {
    dispatch({
      type: 'pos/getProducts',
      payload: {
        page: 1
      }
    })
    showProductModal()
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

  const totalQtyIn = dataBrowse.reduce((prev, next) => prev + (next.In || 0), 0)
  const totalQtyOut = dataBrowse.reduce((prev, next) => prev + (next.Out || 0), 0)
  const totalPrice = dataBrowse.reduce((prev, next) => prev + ((next.price * next.In) + (next.price * next.Out)), 0)

  return (
    <Form style={{ padding: 3 }}>
      <Row>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="Trans No" {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: lastTrans,
              rules: [{
                required: true
              }]
            })(<Input disabled maxLength={25} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="Type" {...formItemLayout}>
            {getFieldDecorator('transType', {
              rules: [{
                required: true
              }]
            })(
              <Cascader
                size="large"
                style={{ width: '100%' }}
                options={listType}
                placeholder="Pick a Type"
                onChange={value => changeCascader(value)}
              />
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="Date" {...formItemLayout}>
            {getFieldDecorator('transDate', {
              rules: [{
                required: true
              }]
            })(<DatePicker format={dateFormat} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="Reference" {...formItemLayout1}>
            {getFieldDecorator('reference', {
              rules: [{
                pattern: /^[a-z0-9/_-]{6,40}$/i,
                required: true,
                message: 'not a valid pattern'
              }]
            })(<Input maxLength={40} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="Memo" {...formItemLayout1}>
            {getFieldDecorator('memo', {
              rules: [{
                required: false
              }]
            })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 4 }} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="Employee" {...formItemLayout}>
            {getFieldDecorator('employeeName', {
              rules: [{
                required: true
              }]
            })(
              <AutoComplete
                style={{ width: 200 }}
                dataSource={listEmployee}
                onChange={value => handleGetEmployee(value)}
                placeholder="Select Employee"
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              />
            )}
          </FormItem>
        </Col>
        <Col xs={0} sm={24} md={24} lg={0} xl={0} />
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="PIC" {...formItemLayout}>
            <Input value={itemEmployee !== null ? itemEmployee.employeeName : ''} />
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <FormItem label="PIC ID" {...formItemLayout}>
            <Input value={itemEmployee !== null ? itemEmployee.employeeId : ''} />
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
      <Button type="primary" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonSaveClick()}>PROCESS</Button>
      <Button type="danger" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonDeleteClick()}>Delete All</Button>
    </Form>
  )
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
