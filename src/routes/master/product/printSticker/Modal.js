import React from 'react'
import { Form, Modal, AutoComplete, InputNumber, message, DatePicker, Select } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const Option = Select.Option

const FormItem = Form.Item
const ModalSticker = ({
  onCloseModalProduct,
  showModalProduct,
  listSticker,
  listItem,
  update,
  period,
  modalProductType,
  onAutoSearch,
  getItem,
  changeItem,
  selectedSticker,
  onSearchUpdateSticker,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  let listItemName = listItem.length > 0 ? listItem.map(x => `${x.productName} (${x.productCode})`) : []

  let productNames = listItem.length > 0 ? listItem.map(x => (<Option key={x.productName} title={`${x.productCode} - ${x.productName}`}>{x.productName}</Option>)) : []

  const handleFields = (fields) => {
    const { updatedAt } = fields
    if (updatedAt.length) {
      fields.updatedAt = [updatedAt[0].format('YYYY-MM-DD'), updatedAt[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    delete fields.name
    delete fields.qty
    onSearchUpdateSticker(fields)
  }

  let timeout
  const autoCompleteProps = {
    style: { width: '100%' },
    disabled: Object.keys(selectedSticker).length !== 0,
    dataSource: listItemName,
    onSearch (value) {
      if (modalProductType === 'all') {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }

        timeout = setTimeout(() => {
          const last = getFieldsValue()
          if (value === last.name) {
            onAutoSearch(value)
          }
        }, 200)
      }
    }
  }
  const inputNumberProps = {
    style: { width: '100%' },
    min: 1,
    max: 100,
    defaultValue: 1
  }

  const modalProps = {
    visible: showModalProduct,
    title: !update ? (modalProductType === 'all' ? 'All Product' : 'Update Product') : 'Edit Product',
    width: 400,
    onOk () {
      const data = {
        ...getFieldsValue()
      }
      data.qty = data.qty || 1
      if (listItemName.indexOf(data.name) === -1 && !update) {
        message.warning('Please select the correct product!')
        return false
      }
      const check = listSticker.map(item => item.name).indexOf(data.name)
      if (check !== -1 && Object.keys(selectedSticker).length === 0) {
        message.warning('The Product has been selected!')
        return false
      }
      if (Object.keys(selectedSticker).length === 0) {
        const listProduct = listItem.find(x => `${x.productName} (${x.productCode})` === data.name)
        data.info = listProduct
        getItem(data)
      } else {
        data.info = selectedSticker.info
        changeItem(selectedSticker, data)
      }
      onCloseModalProduct()
    },
    onCancel () {
      onCloseModalProduct()
    }
  }

  let currentPeriod = period.length > 0 ? [moment(period[0]), moment(period[1])] : []
  let fieldName
  if (modalProductType === 'all' || update) {
    fieldName = (<AutoComplete {...autoCompleteProps} />)
  } else if (modalProductType === 'update' && !update) {
    fieldName = (<Select
      showSearch
      disabled={!!update}
      style={{ width: '100%' }}
      placeholder="Select product name"
      optionFilterProp="children"
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      {productNames}
    </Select>)
  }

  return (
    <Modal {...modalProps}>
      {modalProductType === 'update' &&
        <FormItem label="Period" >
          {getFieldDecorator('updatedAt', { initialValue: currentPeriod })(<RangePicker onChange={handleChange.bind(null, 'updatedAt')} />)}
        </FormItem>}
      <FormItem label="Name" >
        {getFieldDecorator('name', { initialValue: selectedSticker.name })(fieldName)}
      </FormItem>
      <FormItem label="Qty" >
        {getFieldDecorator('qty', { initialValue: selectedSticker.qty })(<InputNumber {...inputNumberProps} />)}
      </FormItem>
    </Modal>
  )
}

export default Form.create()(ModalSticker)
