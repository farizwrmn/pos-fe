import React from 'react'
import { Row, Col, Modal, Form, Input, DatePicker, Select, Button, Checkbox } from 'antd'
import { DataQuery } from 'components'
import moment from 'moment'
import List from './List'

const { Customer, Asset } = DataQuery
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
  modalCustomerVisible,
  modalCustomerAssetVisible,
  CancelWo,
  search,
  resetAssetList,
  listWorkOrderCategory,
  customerOpt = (listCustomer || []).length > 0 ? listCustomer.map(c => <Option title={c.memberCode} value={c.id} key={c.id}>{`${c.memberName} (${c.memberCode})`}</Option>) : [],
  assetOpt = (listUnit || []).length > 0 ? listUnit.map(c => <Option value={c.id} key={c.id}>{`${c.policeNo} (${c.merk})`}</Option>) : [],
  onSubmitWo,
  customField,
  formMainType,
  searchText,
  resetAssetState,
  dispatch,
  handleAddMember,
  handleShowMember,
  handleShowMemberAsset,
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
    formMainType,
    transData,
    ...formProps
  }
  const disabledDate = (current) => {
    return current > moment().add(0, 'days').endOf('day')
  }
  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i += 1) {
      result.push(i)
    }
    return result
  }


  const disabledDateTime = () => {
    return {
      disabledHours: () => range(parseFloat(moment().format('HH')), 24).splice(2, 22),
      disabledMinutes: () => range(parseFloat(moment().format('mm')), 60).splice(1, 59),
      disabledSeconds: () => range(parseFloat(moment().format('ss')), 60).splice(1, 59)
    }
  }
  const disabled = (formMainType === 'edit')
  const handleResetForm = () => {
    resetAssetState()
    dispatch({
      type: 'workorder/updateState',
      payload: {
        searchText: '',
        listCustomFields: [],
        listWorkOrderCategory: [],
        listWorkOrderCategoryTemp: [],
        activeKey: '0'
      }
    })
    dispatch({
      type: 'workorder/querySequence'
    })
    dispatch({
      type: 'workorder/queryWOCategory',
      payload: {
        field: 'id,productCategoryId,categoryCode,categoryName,categoryParentId,categoryParentCode,categoryParentName'
      }
    })
    dispatch({
      type: 'workorder/queryWOCustomFields',
      payload: {
        field: 'id,fieldName,sortingIndex,fieldParentId,fieldParentName'
      }
    })
  }
  const hdlCancel = () => {
    handleResetForm()
    resetAssetState()
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
    dispatch({
      type: 'customerunit/updateState',
      payload: {
        modalCustomerVisible: false,
        unitItem: {}
      }
    })
    resetFields(['policeNoId'])
    resetAssetList()
  }
  const handleChange = (value, type) => {
    if (type === 'memberId') {
      resetAsset()
    }
    if (value) {
      search(value.key ? '' : value, type)
    }
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

  const modalCustomerProps = {
    location,
    loading: loadingButton.effects['customer/query'],
    visible: modalCustomerVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalCustomerVisible: false
        }
      })
    },
    onRowClick (item) {
      const data = getFieldsValue()
      data.memberId = item.id
      data.memberCode = item.memberCode
      data.memberName = item.memberName
      data.policeNoId = null
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalCustomerVisible: false,
          currentItem: {
            woNo: transData.woNo,
            ...data
          }
        }
      })
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          modalCustomerVisible: false,
          unitItem: {}
        }
      })
      resetFields()
    }
  }

  const modalCustomerAssetProps = {
    location,
    loading: loadingButton.effects['customerunit/getMemberAssets'],
    visible: modalCustomerAssetVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalCustomerAssetVisible: false
        }
      })
    },
    onRowClick (item) {
      const data = getFieldsValue()
      data.memberId = item.id
      data.memberCode = item.memberCode
      data.memberName = item.memberName
      data.policeNoId = null
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalCustomerAssetVisible: false,
          currentItem: {
            woNo: transData.woNo,
            ...data
          }
        }
      })
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          modalCustomerVisible: false,
          unitItem: {}
        }
      })
      dispatch({
        type: 'customerunit/lov',
        payload: {
          id: item.memberCode,
          policeNo: item.policeNo
        }
      })
      resetFields()
    }
  }
  const formatDate = (value) => {
    if (value) {
      return moment.utc(moment(value).utcOffset('+0000').format('YYYY-MM-DD HH:mm:ss')).utcOffset('+0700')
    }
    return moment.utc(moment().utcOffset('+0000').format('YYYY-MM-DD HH:mm:ss')).utcOffset('+0700')
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
                <Col span={16}>
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
                <Col span={3}>
                  <Button type="default" shape="circle" icon="bars" onClick={handleShowMember} />
                </Col>
                <Col span={3}>
                  <Button type="primary" shape="circle" icon="plus" onClick={handleAddMember} />
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Asset" hasFeedback {...formItemLayout}>
              <Row>
                <Col span={16}>
                  {getFieldDecorator('policeNoId', {
                    initialValue: transData.policeNoId ? {
                      key: transData.policeNoId,
                      label: `${transData.policeNo} (${transData.merk})`
                    } : { label: null },
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
                <Col span={3}>
                  <Button type="default" shape="circle" icon="bars" onClick={handleShowMemberAsset} />
                </Col>
                <Col span={3}>
                  <Button type="primary" shape="circle" icon="plus" onClick={handleAddMemberAsset} />
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Time In" hasFeedback {...formItemLayout}>
              {getFieldDecorator('timeIn', {
                initialValue: formatDate(transData.timeIn),
                rules: [{
                  required: true
                }]
              })(
                <DatePicker disabled={disabled} disabledTime={disabledDateTime} disabledDate={disabledDate} style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />
              )}
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
      {modalCustomerVisible && <Customer {...modalCustomerProps} />}
      {modalCustomerAssetVisible && <Asset {...modalCustomerAssetProps} />}
    </div>
  )
}

export default Form.create()(FormWO)
