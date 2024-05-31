import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { Form, Input, Button, DatePicker, Row, Col, Card, Modal } from 'antd'
import styles from './form.less'

const FormItem = Form.Item

const gridStyle = {
  width: '100%',
  textAlign: 'center'
}

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  dispatch,
  onSubmit,
  onCancel,
  location,
  modalType,
  button,
  storeInfo,
  listActive,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeName', {
              initialValue: storeInfo.storeName,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input disabled maxLength={255} />)}
          </FormItem>
          <FormItem label="Start Time" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transDate', {
              initialValue: moment(),
              rules: [
                {
                  required: false
                }
              ]
            })(<DatePicker disabled format="YYYY-MM-DD HH:mm" />)}
          </FormItem>
          <FormItem label="Schedule For" hasFeedback {...formItemLayout}>
            {getFieldDecorator('scheduleStart', {
              initialValue: moment().add(1, 'd'),
              rules: [
                {
                  required: false
                }
              ]
            })(<DatePicker
              disabled={location.pathname === '/stock-opname-partial'}
              disabledDate={(current) => {
                return current <= moment().add(1, 'd').startOf('day')
              }}
              format="YYYY-MM-DD"
            />)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: !item.description && location.pathname === '/stock-opname-partial' ? 'PARTIAL' : item.description,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input disabled={location.pathname === '/stock-opname-partial'} maxLength={255} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        <Col {...column}>
          <h1>Active Stock Opname</h1>
          {listActive && listActive.map((item, index) => {
            return (
              <Card.Grid
                style={gridStyle}
                key={index}
                className={styles.card}
                onClick={() => {
                  if (location.pathname === '/stock-opname-partial') {
                    dispatch(routerRedux.push({
                      pathname: `/stock-opname-partial/${item.id}`
                    }))
                  } else {
                    dispatch(routerRedux.push({
                      pathname: `/stock-opname/${item.id}`
                    }))
                  }
                }}
              >
                <div>
                  <h4>{item && item.store ? item.store.storeName : ''}</h4>
                  <h4>{item && item.startDate ? moment(item.startDate).format('YYYY-MM-DD HH:mm:ss') : ''}</h4>
                </div>
              </Card.Grid>
            )
          })}
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
