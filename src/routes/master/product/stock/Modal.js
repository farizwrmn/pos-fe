import React from 'react'
import { Form, Modal, AutoComplete, InputNumber, message, DatePicker } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker

const FormItem = Form.Item
const ModalSticker = ({
  onCloseModalProduct,
  showModalProduct,
  listSticker,
  auto,
  dummy,
  updateDummy,
  period,
  modalProductType,
  onAutoSearch,
  getItem,
  changeItem,
  changeQty,
  selectedSticker,
  onSearchUpdateSticker,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const name = auto.length > 0 ? auto.map(x => x.productName) : []

  const handleSearch = (value) => {
    onAutoSearch(value)
  }

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

  const autoCompleteProps = {
    disabled: Object.keys(selectedSticker).length !== 0,
    dataSource: name,
    onSearch (value) {
      handleSearch(value)
    }
  }
  const inputNumberProps = {
    style: { width: '120px' },
    min: 1,
    max: 100,
    defaultValue: 1,
    onChange (value) {
      changeQty(value)
    }
  }

  const modalProps = {
    visible: showModalProduct,
    title: modalProductType === 'all' ? 'All Product' : 'Update Product',
    width: 250,
    onOk () {
      const data = {
        ...getFieldsValue()
      }
      if (modalProductType === 'all') {
        if (dummy.indexOf(data.name) === -1) {
          message.warning('Please select the correct product!')
          return false
        }
      }
      if (updateDummy.indexOf(data.name) === -1) {
        message.warning('Please select the correct product!')
        return false
      }

      const check = listSticker.map(item => item.name).indexOf(data.name)
      if (check !== -1 && Object.keys(selectedSticker).length === 0) {
        message.warning('The Product has been selected!')
        return false
      }
      if (Object.keys(selectedSticker).length === 0) {
        const price = auto.filter(x => x.productName === data.name).map(x => x.sellPrice)
        data.price = price.toString()
        getItem(data)
      } else {
        data.price = selectedSticker.price
        changeItem(selectedSticker, data)
      }
      onCloseModalProduct()
    },
    onCancel () {
      onCloseModalProduct()
    }
  }

  let currentPeriod = period.length > 0 ? [moment(period[0]), moment(period[1])] : []

  return (
    <Modal {...modalProps}>
      {modalProductType === 'update' &&
        <FormItem label="Period" >
          {getFieldDecorator('updatedAt', { initialValue: currentPeriod })(<RangePicker onChange={handleChange.bind(null, 'updatedAt')} />)}
        </FormItem>}
      <FormItem label="Name" >
        {getFieldDecorator('name', { initialValue: selectedSticker.name })(<AutoComplete {...autoCompleteProps} />)}
      </FormItem>
      <FormItem label="Qty" >
        {getFieldDecorator('qty', { initialValue: selectedSticker.qty })(<InputNumber {...inputNumberProps} />)}
      </FormItem>
    </Modal>
  )
}

export default Form.create()(ModalSticker)
