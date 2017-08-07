import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Icon,
  Input,
  Modal,
  Cascader,
  Checkbox,
  Button,
  Tabs,
  Row,
  Col,
  Popover,
  Table,
  Collapse,
  DatePicker,
  Popconfirm,
  Select,
} from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import { DropOption } from 'components'
import Unit from './Unit'

const dateFormat = 'YYYY-MM-DD'

const confirm = Modal.confirm

const FormItem = Form.Item

const Panel = Collapse.Panel

const TabPane = Tabs.TabPane

const ButtonGroup = Button.Group

const changeTab = (key, value) => {
  this.setState({ [key]: value })
}

function callback (key) {
}

function onChangeTime (date, dateString) {
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

const modal = ({
  item = {},
  listMisc = [],
  listGroup,
  listData = [],
  listUnit,
  onClickRowunit,
  loading,
  disableItem,
  pagination,
  onOk,
  onChange,
  onChooseItem,
  visiblePopover = false,
  disabledItem = { memberCode: true, getEmployee: true },
  modalPopoverVisible,
  modalPopoverClose,
  modalIsEmployeeChange,
  modalButtonCancelClick,
  modalButtonCancelClick2,
  modalButtonSaveClick,
  modalButtonSaveUnitClick,
  modalButtonEditUnitClick,
  modalButtonDeleteUnitClick,
  modalButtonTypeClick,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.customerRole = data.customerRole.join(' ')
      onOk(data)
    })
  }

  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.policeNo)
        },
      })
    }
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const columnsHistory = [
    {
      title: 'Transaksi terakhir',
      dataIndex: 'lastTrans',
      key: 'lastTrans',
      width: 200,
    },
    {
      title: 'KM terakhir',
      dataIndex: 'lastSpeedIndex',
      key: 'lastSpeedIndex',
      width: 200,
    },
  ]

  const hdlTableRowClick = (record) => {
    onChooseItem(record)
  }

  const hdlPopoverVisibleChange = () => {
    modalPopoverVisible()
  }

  const hdlPopoverClose = () => {
    modalPopoverClose()
  }

  const hdlCheckboxChange = (e) => {
    modalIsEmployeeChange(e.target.checked)
  }

  const hdlButtonCancelClick = () => {
    modalButtonCancelClick2()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      // if (data.customerRole !== undefined) {
      //   data.customerRole = data.customerRole.toString()
      // } else {
      //   data.customerRole = ''
      // }
      // data.active = data.active !== undefined ? true : false
      modalButtonSaveClick(data.memberCode, data)
    })
  }

  const hdlButtonSaveUnitClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      modalButtonSaveUnitClick(data.policeNo, data)
    })
    modalButtonCancelClick2()
    modalButtonCancelClick()
  }

  const hdlButtonEditUnitClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      modalButtonEditUnitClick(data.policeNo, data)
    })
    modalButtonCancelClick2()
    modalButtonCancelClick()
  }

  const hdlButtonDeleteUnitClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          modalButtonDeleteUnitClick(data.policeNo, data)
          modalButtonCancelClick2()
          modalButtonCancelClick()
        },
      })
    })
  }

  const hdlButtonTypeClick = () => {
    modalButtonTypeClick()
  }

  const hdlCheckPassword = (rule, value, callback) => {
    const fieldPassword = getFieldsValue(['password'])
    if (value && value !== fieldPassword.password) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }
  const hdlCheckConfirm = (rule, value, callback) => {
    if (value) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }
  const titlePopover = (
    <Row>
      <Col span={8}>Choose</Col>
      <Col span={1} offset={15}>
        <Button shape="circle"
          icon="close-circle"
          size="small"
          onClick={() => hdlPopoverClose()}
        />
      </Col>
    </Row>
  )

  const BrowseGroupprops = {
    pagination: false,
    size: 'small',
    dataSource: listGroup,
  }

  const contentPopover = (
    <div>
      <BrowseGroup
        {...BrowseGroupprops}
        onRowClick={record => hdlTableRowClick(record)}
      />
    </div>
  )

  const unitProps = {
    dataSource: listUnit,
    location,
  }

  const onCourseClick = (record) => {
    onClickRowunit(record)
  }
  return (

    <Modal {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()}>Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary">Save</Button>,
      ]}
    >
      <Tabs type="card" ActiveKey="2" onChange={callback} size="small" tabPosition="top">
        <TabPane tab="View" key="1">
          <Form layout="horizontal">
            <Row gutter={3}>
              <Col span={12}>
                <FormItem label="Customer Group" hasFeedback {...formItemLayout}>
                  <Row gutter={1}>
                    <Col span={6}>
                      <Popover visible={visiblePopover}
                        onVisibleChange={() => hdlPopoverVisibleChange()}
                        title={titlePopover}
                        content={contentPopover}
                        trigger="click"
                      >
                        <Button
                          type="primary"
                          onClick={() => hdlButtonTypeClick()}
                        >Type
                        </Button>
                      </Popover>
                    </Col>
                    <Col span={13} offset={2}>
                      {getFieldDecorator('memberGroup', {
                        initialValue: item.memberGroup,
                        rules: [{ required: true }],
                      })(
                        <Input />
                      )}
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="Customer ID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberCode', {
                    initialValue: item.memberCode,
                    rules: [{ required: true, min: 6 }],
                  })(
                    <Input disabled={disableItem.code} />
                  )}
                </FormItem>
                <FormItem label="Identity Type" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('idType', {
                    initialValue: item.idType,
                    rules: [{ required: true }],
                  })(<Select
                    value={item.idType}
                    size="large"
                    style={{ width: '32%' }}
                  >
                    <Option value="KTP">KTP</Option>
                    <Option value="SIM">SIM</Option>
                  </Select>)}
                </FormItem>
                <FormItem label="Identity Number" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('idNo', {
                    initialValue: item.idNo,
                    rules: [{ required: true }],
                  })(<Input defaultvalue="12313123132131" />)}
                </FormItem>
                <FormItem label="Customer Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberName', {
                    initialValue: item.memberName,
                    rules: [{ required: true, min: 4 }],
                  })(<Input defaultvalue="veirry" />)}
                </FormItem>
                <FormItem label="Birthday" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('birthDate', {
                    initialValue: item.birthDate ? moment.utc(item.birthDate, dateFormat) : moment.utc('2000-01-01', dateFormat),
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<DatePicker
                    defaultValue={moment.utc('2000-01-01', 'LL')}
                    format="YYYY-MM-DD"
                    onChange={onChangeTime}
                  />)
                  }
                </FormItem>
                <FormItem label="Address 1" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address01', {
                    initialValue: item.address01,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem label="Address 2" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address02', {
                    initialValue: item.address02,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem label="City" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('city', {
                    initialValue: item.city,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Province" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('state', {
                    initialValue: item.state,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem label="Post Code" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('zipCode', {
                    initialValue: item.zipCode,
                    rules: [
                      {
                        required: false,
                        pattern: /^\d{5}$/,
                        message: 'invalid data',
                      },
                    ],
                  })(<Input maxLength="5" />)}
                </FormItem>
                <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('taxId', {
                    initialValue: item.taxId,
                    rules: [
                      {
                        required: false,
                        pattern: /^\d{15}$/,
                        message: 'invalid NPWP',
                      },
                    ],
                  })(<Input maxLength="15" defaultvalue="123456789012345" />)}
                </FormItem>
                <FormItem label="E-mail" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('email', {
                    initialValue: item.email,
                    rules: [
                      {
                        required: false,
                        pattern: /^([a-zA-Z0-9._-a-zA-Z0-9])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                        message: 'The input is not valid E-mail!',
                      },
                    ],
                  })(<Input value="veirry@gmail.com" />)}
                </FormItem>
                <FormItem label="Phone" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: item.phoneNumber,
                    rules: [
                      {
                        required: false,
                        pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                        message: 'Input a Phone No.[xxxx xxxx xxxx]',
                      },
                    ],
                  })(<Input defaultvalue="0811658292" />)}
                </FormItem>
                <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('mobileNumber', {
                    initialValue: item.mobileNumber,
                    rules: [
                      {
                        required: true,
                        pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                        message: 'Input a Phone No.[xxxx xxxx xxxx]',
                      },
                    ],
                  })(<Input defaultvalue="0811658292" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>

        <TabPane tab="Detail Kendaraan" key={2}>
          <Row>
            <Col span={12}>
              <Form layout="horizontal">
                <FormItem label="No Polisi" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('policeNo', {
                    initialValue: item.policeNo,
                    rules: [{ required: false }],
                  })(<Input />)}
                </FormItem>
                <FormItem label="Merk" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('merk', {
                    initialValue: item.merk,
                    rules: [{ required: false }],
                  })(<Input />)}
                </FormItem>
                <FormItem label="Model" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('model', {
                    initialValue: item.model,
                    rules: [{ required: false }],
                  })(<Input />)}
                </FormItem>
              </Form>
            </Col>
            <Col span={12}>
              <FormItem label="Tipe" hasFeedback {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [{ required: false }],
                })(<Input />)}
              </FormItem>
              <FormItem label="Tahun" hasFeedback {...formItemLayout}>
                {getFieldDecorator('year', {
                  initialValue: item.year,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="Nomor Rangka" hasFeedback {...formItemLayout}>
                {getFieldDecorator('chassisNo', {
                  initialValue: item.chassisNo,
                  rules: [{ required: false }],
                })(<Input />)}
              </FormItem>
              <FormItem label="Nomor Mesin" hasFeedback {...formItemLayout}>
                {getFieldDecorator('machineNo', {
                  initialValue: item.machineNo,
                  rules: [{ required: false }],
                })(<Input />)}
              </FormItem>
            </Col >
          </Row>
          <ButtonGroup>
            <Button key="submit" type="primary" onClick={() => hdlButtonSaveUnitClick()}>Add Unit</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button key="submit" onClick={() => hdlButtonEditUnitClick()}>Edit Unit</Button>
          </ButtonGroup>
          <Button key="submit" style={{ marginLeft: '60%' }} type="danger" onClick={() => hdlButtonDeleteUnitClick()}>Delete Unit</Button>
          <Row>
            <Col>
              <Unit
                {...unitProps}
                onRowClick={record => onCourseClick(record)}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="History Kendaraan" key="3">
          <Table
            columns={columnsHistory}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onChooseItem: PropTypes.func,
  enablePopover: PropTypes.func,
  modalIsEmployeeChange: PropTypes.func,
  loading: PropTypes.func,
  onClickRowunit: PropTypes.func,
}

export default Form.create()(modal)
