import React from 'react'
import { connect } from 'dva'
import { Reminder } from 'components'
import { Row, Col, Button, Form, Select, Icon } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 9 },
    lg: { span: 9 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const column2 = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const History = ({
  customer,
  customerunit,
  loading,
  pos,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldValue,
    resetFields,
    validateFields
  }
}) => {
  const { list, listCustomer, modalVisible, searchText, pagination } = customer
  const { listServiceReminder, listUnitUsage } = pos
  const { listUnit, customerInfo } = customerunit

  let units = []
  if (listUnit && listUnit.length) {
    units = listUnit.map(x => (<Option value={x.id}>{x.policeNo}</Option>))
  }

  const modalProps = {
    listCustomer,
    searchText,
    pagination,
    loading,
    modalVisible,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    onSearch () {
      dispatch({
        type: 'customer/query',
        payload: {
          page: 1,
          q: searchText
        }
      })
    },
    onReset () {
      dispatch({
        type: 'customer/query'
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: ''
        }
      })
    },
    onClickRow (record) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          customerInfo: record
        }
      })
      dispatch({
        type: 'customerunit/query',
        payload: {
          code: record.memberCode
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false,
          activeKey: '1',
          dataCustomer: record
        }
      })
      dispatch({
        type: 'pos/updateState',
        payload: {
          listUnitUsage: []
        }
      })
      resetFields()
    },
    changeText (text) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: text
        }
      })
    },
    onChange (page) {
      dispatch({
        type: 'customer/query',
        payload: {
          q: searchText,
          page: page.current,
          pageSize: page.pageSize
        }
      })
    }
  }

  const openModal = () => {
    dispatch({
      type: 'customer/updateState',
      payload: {
        modalVisible: true,
        listCustomer: list
      }
    })
  }

  const showReminder = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const unit = getFieldValue('unit')
      dispatch({
        type: 'pos/getServiceUsageReminder',
        payload: {
          policeNo: unit.key
        }
      })
    })
  }

  const reminderProps = {
    unitId: getFieldValue('unit') ? getFieldValue('unit').key : null,
    unitPoliceNo: getFieldValue('unit') ? getFieldValue('unit').label : '...',
    listServiceReminder,
    listUnitUsage
  }

  let buttonName = 'Find Customer'
  if (customerInfo.memberName) {
    let name = customerInfo.memberName
    buttonName = name
    if (name.length > 17) {
      buttonName = `${name.slice(0, 17)}...`
    }
  }

  return (
    <div className="content-inner">
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Row type="flex" justify="start" className="collapse-form-reminder">
        <Col {...column}>
          <FormItem label="Member Code" hasFeedback {...formItemLayout}>
            <Button type="primary" size="large" onClick={openModal} style={{ marginBottom: 15, width: '100%' }}>{buttonName}</Button>
          </FormItem>
          <FormItem label="Member Unit(s)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('unit', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              labelInValue
              style={{ width: '100%' }}
              placeholder="Select Unit"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {units}
            </Select>
            )}
          </FormItem>
        </Col>
        <Col {...column2} style={{ textAlign: 'right' }}>
          <Button
            type="dashed"
            size="large"
            style={{ marginLeft: '5px' }}
            className="button-width02 button-extra-large"
            onClick={() => showReminder()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
        </Col>
      </Row>
      <div className="reminder">
        <Reminder {...reminderProps} />
      </div>
    </div >
  )
}

export default connect(({ customer, customerunit, pos, loading }) => ({ customer, customerunit, pos, loading }))(Form.create()(History))
