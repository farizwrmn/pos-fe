import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Card, InputNumber, Button, Row, Col, Modal, DatePicker, Tag, Checkbox, message } from 'antd'
import moment from 'moment'
import has from 'lodash/has'
import ListReward from './ListReward'
import ModalLov from './ModalLov'

// const { apiCompanyURL } = rest
// const { Option } = Select

const FormItem = Form.Item

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

class FormCounter extends Component {
  state = {
    isDisableType: false
  }

  componentDidMount () {
    const { modalType } = this.props
    if (modalType === 'edit') {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isDisableType: true })
    }
  }

  render () {
    const {
      listReward,
      item = {},
      onSubmit,
      onCancel,
      modalType,
      button,
      showModal,
      showModalEdit,
      modalProductVisible,
      loading,
      getProduct,
      getService,
      listRules,
      typeModal,
      hideModal,
      updateListRules,
      updateListReward,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        getFieldValue,
        resetFields
      }
    } = this.props

    const modalProductProps = {
      type: getFieldValue('type'),
      isModal: false,
      visible: modalProductVisible,
      loading: loading.effects['productstock/query'] || loading.effects['service/query'],
      getProduct,
      getService,
      listRules,
      listReward,
      typeModal,
      onCancel () {
        hideModal()
      },
      onRowClick (item) {
        let type = has(item, 'productCode') ? 'P' : has(item, 'serviceCode') ? 'S' : null
        let categoryCode = null
        let categoryName = null
        if (type === null) {
          if (has(item, 'categoryCode')) {
            categoryCode = item.categoryCode
            categoryName = item.categoryName
            type = 'P'
          }
          if (has(item, 'miscCode')) {
            categoryCode = item.miscName
            categoryName = item.miscDesc
            type = 'S'
          }
        }
        if (typeModal === 'Rules') {
          let arrayProd = []
          const listByCode = listRules
          const checkExists = listByCode.filter(el => el.productCode === item.productCode || el.productCode === item.serviceCode)
          if (checkExists.length === 0) {
            arrayProd = listByCode
            const data = {
              no: arrayProd.length + 1,
              type,
              productId: item.id,
              productCode: type === 'P' ? item.productCode : item.serviceCode,
              productName: type === 'P' ? item.productName : item.serviceName,
              qty: 1
            }
            arrayProd.push(data)
            updateListRules(arrayProd)
            message.success('1 item has been added')
            showModalEdit(data, 0)
          } else {
            Modal.warning({
              title: 'Cannot add product',
              content: 'Already Exists in list'
            })
          }
        } else if (typeModal === 'Reward') {
          let arrayProd = []
          const listByCode = listReward
          const checkExists = listByCode.filter(el => el.productCode === item.productCode || el.productCode === item.serviceCode)
          let checkExistsCategory = []
          if (item.categoryCode) {
            checkExistsCategory = listByCode.filter(filtered => filtered.categoryCode === item.categoryCode)
          } else if (item.miscCode) {
            checkExistsCategory = listByCode.filter(filtered => filtered.categoryCode === item.miscCode)
          }
          if (checkExistsCategory && checkExistsCategory.length > 0) {
            Modal.warning({
              title: 'Already exists',
              content: 'Category already exists in list'
            })
            return
          }
          if (checkExists.length === 0) {
            arrayProd = listByCode

            const data = {
              no: arrayProd.length + 1,
              type,
              productId: item.id,
              productCode: categoryCode === null ? (type === 'P' ? item.productCode : item.serviceCode) : categoryCode,
              productName: categoryName === null ? (type === 'P' ? item.productName : item.serviceName) : categoryName,
              categoryCode: categoryCode !== null ? categoryCode : undefined,
              qty: 1
            }

            arrayProd.push(data)
            updateListReward(arrayProd)
            message.success('1 item has been added')
          } else {
            Modal.warning({
              title: 'Cannot add product',
              content: 'Already Exists in list'
            })
          }
        }
      }
    }

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
        data.availableStore = (data.availableStore || []).length > 0 ? data.availableStore.toString() : null
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data, resetFields)
          },
          onCancel () { }
        })
      })
    }

    const cardProps = {
      bordered: true,
      style: {
        padding: 8,
        marginLeft: 8,
        marginBottom: 8
      }
    }

    const columnsReward = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '100'
      },
      {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode',
        width: '175'
      },
      {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '175'
      }
    ]

    const columnsRewardGetDiscount = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '100'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '100',
        render: (text) => {
          return (
            <span>
              <Tag color={text === 'P' ? 'green' : 'blue'}>
                {text === 'P' ? 'Product' : 'Service'}
              </Tag>
            </span>
          )
        }
      },
      {
        title: 'Code',
        dataIndex: 'productCode',
        key: 'productCode',
        width: '175'
      },
      {
        title: 'Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '175'
      }
    ]

    const handleGetService = (type) => {
      showModal(type)
    }

    const listRewardProps = {
      dataSource: listReward,
      type: getFieldValue('type'),
      columns: (getFieldValue('type') === '2' || getFieldValue('type') === '3') ? columnsRewardGetDiscount : columnsReward,
      onRowClick (item) {
        if (modalType === 'add') {
          showModalEdit(item, 1)
        }
      }
    }

    return (
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col {...column}>
            <Card {...cardProps} title={<h3>Coupon</h3>}>
              <FormItem label="Coupon Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('couponName', {
                  initialValue: item.couponName,
                  rules: [{ required: true, message: 'Please enter the coupon name' }]
                })(<Input maxLength={50} />)}
              </FormItem>

              <FormItem label="Start Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('startDate', {
                  initialValue: moment(item.startDate),
                  rules: [{ required: true, message: 'Please select a start date' }]
                })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>

              <FormItem label="End Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('endDate', {
                  initialValue: moment(item.endDate),
                  rules: [{ required: true, message: 'Please select an end date' }]
                })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>

              <FormItem label="Active" {...formItemLayout}>
                {getFieldDecorator('active', {
                  initialValue: true,
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </FormItem>

              <FormItem label="Minimum Payment" hasFeedback {...formItemLayout}>
                {getFieldDecorator('minimumPayment', {
                  initialValue: item.minimumPayment,
                  rules: [{ required: true, message: 'Enter minimum payment amount' }]
                })(<InputNumber min={0} style={{ width: '100%' }} />)}
              </FormItem>

              <FormItem label="Multiplier Payment" hasFeedback {...formItemLayout}>
                {getFieldDecorator('multiplierPayment', {
                  initialValue: item.multiplierPayment,
                  rules: [{ required: true, message: 'Enter multiplier payment amount' }]
                })(<InputNumber min={0} style={{ width: '100%' }} />)}
              </FormItem>
            </Card>

            <Card {...cardProps}>
              <FormItem {...tailFormItemLayout}>
                {modalType === 'edit' && (
                  <Button type="danger" style={{ marginRight: 10 }} onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="primary" onClick={handleSubmit}>
                  {button}
                </Button>
              </FormItem>
            </Card>
          </Col>

          <Col {...column}>
            <Card {...cardProps} title={<h3>Items</h3>}>
              <div>
                <Row>
                  <Col span={12} />
                  <Col span={12}>
                    <Button
                      // disabled={modalType !== 'add'}
                      className="button-add-items-right"
                      type="primary"
                      icon="plus"
                      onClick={() => handleGetService('Reward')}
                    >
                      Add Items
                    </Button>
                  </Col>
                </Row>
                <ListReward {...listRewardProps} />
              </div>
            </Card>
          </Col>
        </Row>
        {modalProductVisible && <ModalLov {...modalProductProps} />}
      </Form>
    )
  }
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
