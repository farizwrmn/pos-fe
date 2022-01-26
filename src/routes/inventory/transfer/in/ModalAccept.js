/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import { Form, Modal, Button, DatePicker, Select, Input, Row, Col } from 'antd'
import moment from 'moment'
import List from './ListItem'
import ModalConfirm from './ModalConfirm'
import PrintShelf from '../../../master/product/printSticker/PrintShelf'
import PrintAvancedShelf from '../../../master/product/printSticker/PrintAvancedShelf'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 12 }
  }
}
class ModalAccept extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('Product')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      item,
      disableButton,
      sequenceNumber,
      listTransDetail,
      listEmployee,
      getEmployee,
      hideEmployee,
      onOk,
      onOkPrint,
      onEnter,
      user,
      storeInfo,
      listItem,
      modalConfirmVisible,
      form: {
        getFieldDecorator,
        resetFields,
        validateFields,
        getFieldsValue
      },
      printMode,
      selectedRowKeys,
      onPrintBarcode,
      dispatch,
      ...formConfirmProps
    } = this.props
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        dispatch({
          type: 'transferIn/editSelected',
          payload: {
            selectedRowKeys,
            resetChild: this.clickChild
          }
        })
      }
    }

    const modalAcceptProps = this.props

    const listDetailProps = {
      dataSource: listTransDetail
    }

    if (printMode === 'select') {
      listDetailProps.selectedRowKeys = selectedRowKeys
      listDetailProps.rowSelection = rowSelection
    }

    const childrenEmployee = listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []
    const formConfirmOpts = {
      user,
      storeInfo,
      onOkPrint,
      itemPrint: {
        transNo: getFieldsValue().transNo
      },
      itemHeader: {
        storeId: {
          label: getFieldsValue().storeName
        },
        transNo: getFieldsValue().transNo,
        storeName: {
          label: getFieldsValue().storeNameReceiver
        },
        storeNameSender: {
          label: getFieldsValue().storeNameReceiver
        },
        transDate: moment(getFieldsValue().transDate).format('DD-MM-YYYY'),
        employeeId: {
          key: item.employeeId,
          label: item.employeeName
        },
        employeeReceiver: getFieldsValue().employeeId ? getFieldsValue().employeeId.label : '',
        referenceTrans: item.transNo,
        ...getFieldsValue()
      },
      listItem,
      ...formConfirmProps
    }
    // const handleReset = () => {
    //   resetFields()
    //   resetItem()
    //   onListReset()
    // }

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        const dataHeader = {
          storeIdSender: item.storeId,
          // receiveDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          reference: item.id,
          transType: 'MUIN',
          employeeId: data.employeeId.key,
          carNumber: item.carNumber,
          totalColly: item.totalColly,
          description: item.description
        }
        const storeId = item.storeIdReceiver
        const detail = listTransDetail
        onOk(dataHeader, detail, storeId)
      })
    }

    const modalOpts = {
      ...modalAcceptProps,
      title: item.transNo,
      onOk: handleOk
    }

    // const resetSelectedField = (value) => {
    //   resetFields([value])
    // }

    const onEnterProduct = (e, kodeUtil) => {
      const { value } = e.target
      if (value && value !== '') {
        if (kodeUtil === 'barcode') {
          const data = {
            barCode01: value,
            transNo: item.transNo,
            storeId: item.id,
            storeIdReceiver: item.storeIdReceiver
          }
          onEnter(data)
          resetFields(['Product'])
        }
      }
    }

    let listSticker

    const printStickerProps = {
      aliases: {
        check1: true,
        alias1: 'RETAIL PRICE',
        price1: 'sellPrice'
      },
      user,
      storeInfo
    }

    if (listTransDetail && listTransDetail.length > 0 && selectedRowKeys && selectedRowKeys.length > 0) {
      listSticker = listTransDetail.filter(filtered => selectedRowKeys.includes(filtered.no)).map((item) => {
        return ({
          info: item,
          name: item.productName,
          qty: 1
        })
      })
    }

    return (
      <div>
        <Modal
          onCancel={modalAcceptProps.onCancel}
          footer={[
            <Button disabled={disableButton} key="submit" type="primary" onClick={() => handleOk()} >Process</Button>
          ]}
          {...modalOpts}
        >
          <Form layout="horizontal">
            <Row>
              <Col lg={12} md={24}>
                <FormItem label="No Trans" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('transNo', {
                    initialValue: sequenceNumber,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="Date" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('transDate', {
                    initialValue: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<DatePicker placeholder="Select Period" disabled />)}
                </FormItem>
                <FormItem label="reference" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('transNoReference', {
                    initialValue: item.transNo,
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="Type" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('transType', {
                    initialValue: 'MUIN',
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="Received By" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('employeeId', {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Select
                      labelInValue
                      onFocus={getEmployee}
                      onBlur={hideEmployee}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      placeholder="Choose Employee"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                    >
                      {childrenEmployee}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={24}>
                <FormItem label="From Store" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('storeName', {
                    initialValue: item.storeName,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="To Store" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('storeNameReceiver', {
                    initialValue: item.storeNameReceiver,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="Car Number" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('carNumber', {
                    initialValue: item.carNumber,
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="Total Pack" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('totalColly', {
                    initialValue: item.totalColly,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="Description" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('description', {
                    initialValue: item.description,
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={16} md={24}>
                <FormItem label="Scanner" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('Product', {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(
                    <Input
                      id="input-product"
                      size="medium"
                      autoFocus
                      style={{ fontSize: 24, marginBottom: 8 }}
                      placeholder="Scanner"
                      onPressEnter={(event) => {
                        onEnterProduct(event, 'barcode')
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={24}>
                {printMode === 'default' && <Button type="primary" style={{ marginLeft: '10px' }} icon="barcode" onClick={() => onPrintBarcode()}>Print Barcode</Button>}
                {selectedRowKeys && selectedRowKeys.length > 0 && (
                  <span style={{ marginLeft: '10px' }}>
                    <PrintShelf stickers={listSticker} user={user} {...printStickerProps} />
                    <PrintAvancedShelf setClick={click => this.clickChild = click} stickers={listSticker} user={user} {...printStickerProps} />
                  </span>
                )}
              </Col>
            </Row>
          </Form>
          <List dataSource={listTransDetail} {...listDetailProps} />
          {modalConfirmVisible && <ModalConfirm {...formConfirmOpts} />}
        </Modal>
      </div >
    )
  }
}

export default Form.create()(ModalAccept)
