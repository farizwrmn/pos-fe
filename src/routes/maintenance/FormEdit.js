import React from 'react'
import PropTypes from 'prop-types'
import config from 'config'
import { lstorage } from 'utils'
import { Modal, Button, Input, Form, Row, Col, DatePicker, Select } from 'antd'
import moment from 'moment'
import ModalBrowse from './ModalBrowse'

const FormItem = Form.Item
const { prefix } = config
const { MonthPicker } = DatePicker
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
  style: {
    marginBottom: '5px',
    marginTop: '5px'
  }
}

const FormEdit = ({
  onOk,
  listTrans,
  listUnit,
  listMember,
  listMechanic,
  item,
  modalType,
  onChangePeriod,
  setFormItem,
  setItem,
  onShowModal,
  onHideModal,
  optionPos,
  period,
  modalVisible,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue },
  ...formEditProps
}) => {
  const setItemForForm = (e) => {
    setFieldsValue({
      ...e
    })
    // setItem()
  }
  const setPoliceNo = () => {
    setFieldsValue({
      lastMeter: null,
      policeNo: null,
      policeNoId: null
    })
  }
  const modalProps = {
    visible: modalVisible,
    listUnit,
    listMember,
    listMechanic,
    onHideModal,
    modalType,
    setItemForForm,
    width: '1000px',
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      onHideModal()
    }
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Warning',
        content: 'Action cannot be undone',
        onOk () {
          data.storeId = lstorage.getCurrentUserStore()
          data.transNo = item.transNo
          data.memberCode = data.memberId
          data.woReference = data.woReference === null || data.woReference === '' ? null : data.woReference
          data.usingWo = !(data.woReference === null || data.woReference === '')
          onOk(data)
          setFormItem({})
          resetFields()
        },
        onCancel () {
          console.log('cancel')
        }
      })
    })
  }
  const onSelectTrans = (value) => {
    const selectedTrans = listTrans.filter(el => el.id === parseFloat(value))
    if (selectedTrans.length <= 0) {
      setFormItem({})
      resetFields()
      return
    }
    if (selectedTrans[0].status === 'C') {
      Modal.warning({
        title: 'Warning!',
        content: 'Invoice has been canceled'
      })
      setFormItem({})
      resetFields()
      return
    }
    setFormItem(selectedTrans[0])
    resetFields()
  }
  const handleShowModal = (e) => {
    const data = {
      ...getFieldsValue()
    }
    let memberId = ''
    switch (e) {
      case 'unit': memberId = data.memberCode
        break
      default:
    }
    onShowModal(e, memberId)
  }
  const onChange = (date, dateString) => {
    let dateFormat = moment(dateString).format('YYYY-MM-DD')
    let lastDate = moment(moment(dateFormat).endOf('month')).format('YYYY-MM-DD')
    onChangePeriod(dateFormat, lastDate)
    setFormItem({})
    resetFields()
  }
  let defaultRole = ''
  const localId = localStorage.getItem(`${prefix}udi`)
  if (localId && localId.indexOf('#') > -1) {
    defaultRole = localId.split(/[# ]+/).pop()
  }

  return (
    <Form {...formEditProps}>
      <Row>
        <Col md={12}>
          <FormItem label="Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
            })(<MonthPicker defaultValue={moment.utc(`${period.period}-${period.year}`, 'MM-YYYY')} onChange={onChange} placeholder="Select Period" />)}
          </FormItem>
          <FormItem label="Transaction No" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={12}>
                {getFieldDecorator('transNoId', {
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(
                  <Select
                    mode="combobox"
                    style={{ width: '100%', height: '32px' }}
                    placeholder="Select Trans"
                    onChange={onSelectTrans}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {optionPos}
                  </Select>)}
              </Col>
              <Col span={12}>
                {getFieldDecorator('transNo', {
                  initialValue: item.transNo,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ width: '100%', height: '32px', backgroundColor: '#ffffff' }} disabled />)}
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem label="Mechanic" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={12}>
                {getFieldDecorator('technicianName', {
                  initialValue: item.technicianName,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ backgroundColor: '#ffffff', width: '100%' }} disabled />)}
              </Col>
              <Col span={8}>
                {getFieldDecorator('technicianId', {
                  initialValue: item.technicianId,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ width: '100%', backgroundColor: '#ffffff' }} disabled />)}
              </Col>
              <Col span={4}>
                <Button type="dashed" className="bgcolor-green" icon="edit" onClick={() => handleShowModal('mechanic')} style={{ width: '100%', height: '32px' }} />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Member" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={12}>
                {getFieldDecorator('memberCode', {
                  initialValue: item.memberCode,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(
                  <Input disabled style={{ backgroundColor: '#ffffff', width: '100%', height: '32px' }} />
                )}

              </Col>
              <Col span={8}>
                {getFieldDecorator('memberId', {
                  initialValue: item.memberId,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(
                  <Input disabled style={{ backgroundColor: '#ffffff', width: '100%', height: '32px' }} />
                )}

              </Col>
              <Col span={4}>
                <Button type="dashed" className="bgcolor-green" icon="edit" onClick={() => handleShowModal('member')} style={{ width: '100%', height: '32px' }} />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Member Name" {...formItemLayout}>
            {getFieldDecorator('memberName', {
              initialValue: item.memberName,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input disabled style={{ backgroundColor: '#ffffff', width: '100%', height: '32px' }} />)}
          </FormItem>
          <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transDate', {
              initialValue: moment.utc(item.transDate, 'YYYY-MM-DD'),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<DatePicker disabled style={{ background: '#ffffff', width: '100%' }} />)}
          </FormItem>
          <FormItem label="Last Meter" hasFeedback {...formItemLayout}>
            {getFieldDecorator('lastMeter', {
              initialValue: item.lastMeter
            })(<Input style={{ backgroundColor: '#ffffff' }} />)}
          </FormItem>
          <FormItem label="Payment Via" hasFeedback {...formItemLayout}>
            {getFieldDecorator('paymentVia', {
              initialValue: item.paymentVia,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input disabled style={{ backgroundColor: '#ffffff' }} />)}
          </FormItem>
          <FormItem label="Police No" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={20}>
                {getFieldDecorator('policeNo', {
                  initialValue: item.policeNo
                })(<Input disabled style={{ backgroundColor: '#ffffff', width: '100%', height: '32px' }} />)}
              </Col>
              <Col span={4}>
                <Button type="dashed" className="bgcolor-green" icon="edit" onClick={() => handleShowModal('unit')} style={{ width: '100%', height: '32px' }} />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Police Id" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={12}>
                {getFieldDecorator('policeNoId', {
                  initialValue: item.policeNoId
                })(<Input disabled style={{ backgroundColor: '#ffffff', width: '100%', height: '32px' }} />)}
              </Col>
              <Col span={12}>
                <Button onClick={() => setPoliceNo()} type="dashed" className="bgcolor-red" icon="close" style={{ width: '100%', height: '32px' }} >No Unit</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Ref" help={item.woReference === '' || item.woReference === null || item.woReference === undefined ? 'you are not using Work Order' : 'you are using Work Order'} {...formItemLayout}>
            {getFieldDecorator('woReference', {
              initialValue: item.woReference
            })(<Input disabled={defaultRole !== 'OWN'} style={{ width: '100%', height: '32px', backgroundColor: '#ffffff' }} />)}
          </FormItem>
        </Col>
      </Row>
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Button style={{ float: 'right' }} type="primary" size="large" onClick={() => handleOk()}>Submit</Button>
    </Form >
  )
}

FormEdit.propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
  setFormItem: PropTypes.func,
  onChangePeriod: PropTypes.func,
  onShowModal: PropTypes.func
}

export default Form.create()(FormEdit)
