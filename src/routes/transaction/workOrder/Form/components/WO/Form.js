import React from 'react'
import { Row, Col, Modal, Form, Input, DatePicker, Select, Button, Checkbox } from 'antd'
import moment from 'moment'
import List from './List'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 }
  }
}

const FormWO = ({
  listCustomer,
  listUnit,
  transData,
  loadingButton,
  getCustomerUnit,
  CancelWo,
  search,
  resetAssetList,
  listWorkOrderCategory,
  customerOpt = (listCustomer || []).length > 0 ? listCustomer.map(c => <Option title={c.memberCode} value={c.id} key={c.id}>{`${c.memberName} (${c.memberCode})`}</Option>) : [],
  assetOpt = (listUnit || []).length > 0 ? listUnit.map(c => <Option value={c.id} key={c.id}>{`${c.policeNo} (${c.merk})`}</Option>) : [],
  onSubmitWo,
  customField,
  formMainType,
  dispatch,
  handleAddMember,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields
  },
  ...formProps
}) => {
  const listProps = {
    transData,
    ...formProps
  }
  const disabled = (formMainType === 'edit')
  const hdlCancel = () => {
    CancelWo()
    resetFields()
  }
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      const check = listWorkOrderCategory.map((x) => {
        return {
          checkId: x.id,
          value: x.value || 4,
          memo: x.memo
        }
      })
      data.memberId = data.memberId.key
      data.policeNoId = data.policeNoId.key
      onSubmitWo(data, check)
    })
  }
  const resetAsset = () => {
    resetFields(['policeNoId'])
    resetAssetList()
  }
  const handleChange = (value, type) => {
    if (type === 'memberId') {
      resetAsset()
    }
    search(value.key ? '' : value, type)
  }

  const handleAddMemberAsset = () => {
    if (getFieldValue('memberId').label) {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalAddUnit: true
        }
      })
      let member = getFieldValue('memberId')
      dispatch({
        type: 'customer/updateState',
        payload: {
          addUnit: {
            modal: false,
            info: { id: member.title, name: member.label }
          }
        }
      })
    } else {
      Modal.warning({
        title: 'Member Information is not found',
        content: 'Insert Member'
      })
    }
  }

  return (
    <div>
      <Row>
        <Col sm={13} md={14} lg={10}>
          <Form layout="horizontal">
            <FormItem label="Work Order No" hasFeedback {...formItemLayout}>
              <Input disabled={disabled} value={transData.woNo} />
            </FormItem>
            <FormItem label="Customer" hasFeedback {...formItemLayout}>
              <Row>
                <Col span={20}>
                  {getFieldDecorator('memberId', {
                    initialValue: transData.memberId ? {
                      key: transData.memberId,
                      label: `${transData.memberName} (${transData.memberCode})`,
                      title: transData.memberCode
                    } : {},
                    rules: [
                      { required: true }
                    ]
                  })(<Select
                    showSearch
                    allowClear
                    onChange={value => handleChange(value, 'memberId')}
                    onSearch={value => handleChange(value, 'memberId')}
                    optionFilterProp="children"
                    disabled={disabled}
                    labelInValue
                    placeholder="Type some text"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                  >{customerOpt}
                  </Select>)}
                </Col>
                <Col span={4}>
                  <Button type="primary" shape="circle" icon="plus" onClick={handleAddMember} />
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Asset" hasFeedback {...formItemLayout}>
              <Row>
                <Col span={20}>
                  {getFieldDecorator('policeNoId', {
                    initialValue: transData.policeNoId ? {
                      key: transData.policeNoId,
                      label: `${transData.policeNo} (${transData.merk})`
                    } : {},
                    rules: [{ required: true }]
                  })(<Select
                    showSearch
                    allowClear
                    placeholder="Choose member unit"
                    onChange={handleChange}
                    optionFilterProp="children"
                    disabled={disabled}
                    labelInValue
                    onFocus={() => getCustomerUnit(getFieldValue('memberId'))}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {assetOpt}
                  </Select>)}
                </Col>
                <Col span={4}>
                  <Button type="primary" shape="circle" icon="plus" onClick={handleAddMemberAsset} />
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Time In" hasFeedback {...formItemLayout}>
              {getFieldDecorator('timeIn', {
                initialValue: moment.utc(moment(transData.timeIn).format('YYYY-MM-DD HH:mm:ss')) || moment.utc(),
                rules: [{
                  required: true
                }]
              })(
                <DatePicker disabled={disabled} style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />)}
            </FormItem>
            <FormItem label="Take Away" {...formItemLayout}>
              {getFieldDecorator('takeAway', {
                initialValue: !!transData.takeAway
              })(<Checkbox disabled={disabled} defaultChecked={!!transData.takeAway} />)}
            </FormItem>
          </Form>
        </Col>
      </Row>
      <List {...listProps} />
      {formMainType === 'add' && <Button disabled={loadingButton.effects['workorder/addWorkOrder']} onClick={() => handleSubmit()} type="primary" size="large" style={{ float: 'right', marginBottom: 2, marginTop: 10 }}>Submit</Button>}
      {formMainType === 'edit' && <Button onClick={() => customField()} size="large" style={{ float: 'right', marginBottom: 2, marginTop: 10, marginRight: '8px' }}>Custom field</Button>}
      {formMainType === 'edit' && <Button onClick={() => hdlCancel()} type="primary" size="large" style={{ float: 'right', marginBottom: 2, marginTop: 10, marginRight: '8px' }}>New</Button>}
    </div>
  )
}

export default Form.create()(FormWO)
