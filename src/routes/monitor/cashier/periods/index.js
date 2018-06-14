import React from 'react'
import { connect } from 'dva'
import { CashRegister } from 'components'
import { Row, Col, Button, Form, Select, Icon, DatePicker } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

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
  cashier,
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
  const { listServiceReminder, listUnitUsage } = pos
  const { listUnit, customerInfo } = customerunit

  const { list, listCashier, modalVisible,searchText, pagination } = cashier

  let units = []
  if (listUnit && listUnit.length) {
    units = listUnit.map(x => (<Option value={x.id}>{x.policeNo}</Option>))
  }

  const modalProps = {
    listCashier,
    searchText,
    pagination,
    loading,
    modalVisible,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cashier/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    onSearch () {
      dispatch({
        type: 'cashier/query',
        payload: {
          page: 1,
          q: searchText
        }
      })
    },
    onReset () {
      dispatch({
        type: 'cashier/query'
      })
      dispatch({
        type: 'cashier/updateState',
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
        type: 'cashier/updateState',
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
        type: 'cashier/updateState',
        payload: {
          searchText: text
        }
      })
    },
    onChange (page) {
      dispatch({
        type: 'cashier/query',
        payload: {
          q: searchText,
          page: page.current,
          pageSize: page.pageSize
        }
      })
    }
  }

  const openModal = () => {
    console.log('zzz0')
    dispatch({
      type: 'cashier/updateState',
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

  console.log('zzz1', modalVisible)
  return (
    <div className="content-inner">
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Row type="flex" justify="start" className="collapse-form-reminder">
        <Col {...column}>
          <FormItem label="Cashier Id" hasFeedback {...formItemLayout}>
            <Button type="primary" size="large" onClick={openModal} style={{ marginBottom: 15, width: '100%' }}>{buttonName}</Button>
          </FormItem>
          <FormItem label="Period" {...formItemLayout} >
            {getFieldDecorator('rangePicker', {
              rules: [{ required: true }]
            })(<RangePicker size="large"
                // defaultValue={[moment(paramDate[0], 'YYYY/MM/DD'), moment(paramDate[1], 'YYYY/MM/DD')]}
                            //onChange={value => handleChangeDate(value)}
                            format="DD-MMM-YYYY"
              />
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
        <CashRegister {...reminderProps} />
      </div>
    </div >
  )
}

export default connect(({ cashier, customer, customerunit, pos, loading }) => ({ cashier, customer, customerunit, pos, loading }))(Form.create()(History))
