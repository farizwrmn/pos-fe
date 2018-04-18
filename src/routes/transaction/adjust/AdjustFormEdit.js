import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Button, DatePicker, Cascader } from 'antd'
import moment from 'moment'
import Browse from './Browse'

const dateFormat = 'YYYY/MM/DD'
const FormItem = Form.Item
const { TextArea } = Input
// const { Search } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const AdjustForm = ({ onChooseItem, onResetAll, disableItem, onGetEmployee, itemEmployee, listType, listEmployee, onSearchProduct, onGetProduct, item,
  popoverVisible, onHidePopover, onEdit, onChangeSearch, dataSource, form: { getFieldDecorator, getFieldsValue, validateFields }, ...adjustProps }) => {
  if (item) {
    itemEmployee.employeeId = item.picId
    itemEmployee.employeeName = item.pic
  }
  const handleButtonSaveClick = () => {
    Modal.confirm({
      title: `Update ${item.transNo} ?`,
      content: 'Action cannot be undone',
      onOk () {
        validateFields((errors) => {
          if (errors) {
            return
          }
          const data = {
            ...getFieldsValue(),
            transNo: item.transNo,
            transType: item.transType,
            pic: itemEmployee !== null ? itemEmployee.employeeName : '',
            picId: itemEmployee !== null ? itemEmployee.employeeId : ''
          }
          data.transType = data.transType[0]
          onEdit(data)
        })
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  // const hdlGetProduct = () => {
  //   onGetProduct()
  // }

  // const handleButtonDeleteClick = () => {
  //   localStorage.removeItem('adjust')
  //   onResetAll()
  // }

  // const hdlSearch = (e) => {
  //   onSearchProduct(e, dataSource)
  // }

  // const hidePopover = () => {
  //   onHidePopover()
  // }

  // const handleChangeSearch = (e) => {
  //   const { value } = e.target
  //   onChangeSearch(value)
  // }

  // const handleMenuClick = (item) => {
  //   onChooseItem(item)
  // }
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
  //     width: '20%'
  //   }
  // ]
  // const contentPopover = (
  //   <Table
  //     pagination={{ total: dataSource.length, pageSize: 5 }}
  //     scroll={{ x: 600, y: 150 }}
  //     columns={columns}
  //     simple
  //     dataSource={dataSource}
  //     // locale={{
  //     //   emptyText: <Button type='primary' onClick={() => hdlGetProduct()}>Reset</Button>,
  //     // }}
  //     size="small"
  //     rowKey={record => record.productCode}
  //     onRowClick={record => handleMenuClick(record)}
  //   />
  // )
  const adjustOpts = {
    item,
    ...adjustProps
  }
  return (
    <Form style={{ padding: 3 }}>
      <FormItem label="Trans No" {...formItemLayout}>
        <Input value={item.transNo} maxLength={25} />
      </FormItem>
      <FormItem label="Type" {...formItemLayout}>
        {getFieldDecorator('transType', {
          initialValue: item ? [item.transType] : '',
          rules: [{
            required: true
          }]
        })(<Cascader
          size="large"
          disabled
          style={{ width: '100%' }}
          options={listType}
          placeholder="Pick a Type"
        />)}
      </FormItem>
      <FormItem label="Date" {...formItemLayout}>
        <DatePicker disabled value={moment.utc(item.transDate, 'YYYY/MM/DD')} format={dateFormat} />
      </FormItem>
      <FormItem label="Reference" {...formItemLayout}>
        <Input maxLength={40} value={item.reference} />
      </FormItem>
      <FormItem label="Memo" {...formItemLayout}>
        <TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 4 }} value={item.memo} />
      </FormItem>
      <FormItem label="PIC" {...formItemLayout}>
        <Input value={itemEmployee !== null ? itemEmployee.employeeName : ''} />
      </FormItem>
      <FormItem label="PIC ID" {...formItemLayout}>
        <Input value={itemEmployee !== null ? itemEmployee.employeeId : ''} />
      </FormItem>
      {/* <FormItem label="Search" {...formItemLayout}>
        <Popover visible={popoverVisible} title={<a onClick={() => hidePopover()}><Icon type="close" /> Close</a>} placement="bottomLeft" content={contentPopover} trigger={'focus'}>
          <Search prefix={<Icon type="barcode" />}
            autoFocus
            size="large"
            placeholder="Search Product By Code or Name"
            onEnter={value => hdlSearch(value)}
            onSearch={value => hdlSearch(value)}
            onChange={value => handleChangeSearch(value)}
            onFocus={() => hdlGetProduct()}
            onClick={() => hdlGetProduct()}
          />
        </Popover>
      </FormItem> */}
      <FormItem>
        <Browse {...adjustOpts} />
      </FormItem>
      <FormItem {...formItemLayout}>
        <Button type="primary" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonSaveClick()}>PROCESS</Button>
        {/* <Button type="danger" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonDeleteClick()}>Delete All</Button> */}
      </FormItem>
    </Form>
  )
}

AdjustForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  item: PropTypes.object,
  onGetEmployee: PropTypes.func,
  dispatch: PropTypes.func
}

export default Form.create()(AdjustForm)
