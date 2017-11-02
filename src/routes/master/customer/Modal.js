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
import BrowseGroup from './BrowseGroup'
import BrowseCity from './BrowseCity'
import BrowseType from './BrowseType'

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
  listCity,
  listType,
  onClickRowunit,
  onChooseType,
  loading,
  disableItem,
  pagination,
  onOk,
  onChange,
  onChooseItem,
  onChooseCity,
  modalButtonCityClick,
  visiblePopoverGroup,
  visiblePopoverCity,
  visiblePopoverType,
  disabledItem = { memberCode: true, getEmployee: true },
  modalPopoverVisible,
  modalPopoverVisibleType,
  modalPopoverVisibleCity,
  modalPopoverClose,
  modalIsEmployeeChange,
  modalButtonCancelClick,
  modalButtonCancelClick2,
  modalButtonSaveClick,
  modalButtonSaveUnitClick,
  modalButtonEditUnitClick,
  modalButtonDeleteUnitClick,
  modalButtonTypeClick,
  modalButtonGroupClick,
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
      dataIndex: 'transDate',
      key: 'transDate',
      width: 200,
    },
    {
      title: 'KM terakhir',
      dataIndex: 'lastMeter',
      key: 'lastMeter',
      width: 200,
    },
  ]

  const hdlTableRowClick = (record) => {
    onChooseItem(record)
  }

  const hdlTableCityRowClick = (record) => {
    onChooseCity(record)
  }

  const hdlTableTypeRowClick = (record) => {
    onChooseType(record)
  }

  const hdlPopoverVisibleChange = () => {
    modalPopoverVisible()
  }

  const hdlPopoverVisibleCityChange = () => {
    modalPopoverVisibleCity()
  }

  const hdlPopoverVisibleTypeChange = () => {
    modalPopoverVisibleType()
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
      modalButtonCancelClick2()
    })
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
        },
      })
    })
  }

  const hdlButtonTypeClick = () => {
    modalButtonTypeClick()
  }

  const hdlButtonGroupClick = () => {
    modalButtonGroupClick()
  }

  const hdlButtonCityClick = () => {
    modalButtonCityClick()
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

  const contentPopoverCity = (
    <div>
      <BrowseCity pagination={false} dataSource={listCity}
      onRowClick={record => hdlTableCityRowClick(record)}/>
    </div>
  )

  const contentPopoverType = (
    <div>
      <BrowseType pagination={false} dataSource={listType}
      onRowClick={record => hdlTableTypeRowClick(record)}/>
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
              <Col span={24}>
                <FormItem label="Customer Group" hasFeedback {...formItemLayout}>
                  <Row gutter={1}>
                    <Col span={6}>
                    <Popover visible={visiblePopoverGroup}
                      onVisibleChange={() => hdlPopoverVisibleChange()}
                      title={titlePopover}
                      content={contentPopover}
                      trigger="click"
                    >
                        <Button
                          type="primary"
                          onClick={() => hdlButtonGroupClick()}
                        ><Icon type="down-square-o" />
                        </Button>
                      </Popover>
                    </Col>
                    <Col span={6}>
                      {getFieldDecorator('memberGroupId', {
                        initialValue: item.memberGroupId,
                        rules: [{ required: true, message: "Required" }],
                      })(
                        <Input disabled style={{width: 40}}/>
                      )}
                    </Col>
                    <Col span={9}>
                      {getFieldDecorator('memberGroupName', {
                        initialValue: item.memberGroupName,
                        rules: [{ required: true, message: "Required" }],
                      })(
                        <Input disabled style={{width: 100}}/>
                      )}
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="Customer Type" hasFeedback {...formItemLayout}>
                  <Row gutter={1}>
                    <Col span={6}>
                      <Popover visible={visiblePopoverType}
                        onVisibleChange={() => hdlPopoverVisibleTypeChange()}
                        title={titlePopover}
                        content={contentPopoverType}
                        trigger="click"
                      >
                        <Button
                          type="primary"
                          onClick={() => hdlButtonTypeClick()}
                        ><Icon type="down-square-o" />
                        </Button>
                      </Popover>
                    </Col>
                    <Col span={6}>
                      {getFieldDecorator('memberTypeId', {
                        initialValue: item.memberTypeId,
                        rules: [{ required: true, message: "Required" }],
                      })(
                        <Input disabled style={{width: 40}}/>
                      )}
                    </Col>
                    <Col span={6}>
                      {getFieldDecorator('memberTypeName', {
                        initialValue: item.memberTypeName,
                        rules: [{ required: true, message: "Required" }],
                      })(
                        <Input disabled style={{width: 100}}/>
                      )}
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="Customer ID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberCode', {
                    initialValue: item.memberCode,
                    rules: [{
                      required: true,
                      message: "Required",
                      pattern: /^[a-z0-9\_-]{3,15}$/i,
                      message: "a-Z & 0-9",
                    }],
                  })(
                    <Input maxLength={15}/>
                  )}
                </FormItem>
                <FormItem label="Identity Type" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('idType', {
                    initialValue: item.idType,
                    rules: [{
                      required: true,
                      message: "Required",
                      pattern: /^[a-z0-9\_\-]{3,10}$/i,
                      message: "a-Z & 0-9"
                    }],
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
                    rules: [{ 
                      pattern: /^[A-Za-z0-9-_. ]{3,30}$/i,
                      required: true,
                      message: "a-Z & 0-9"
                    }],
                  })(<Input maxLength={30} />)}
                </FormItem>
                <FormItem label="Customer Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberName', {
                    initialValue: item.memberName,
                    rules: [{
                      required: true,
                      min: 4,
                      message: "Required",
                      pattern: "/^[a-z0-9\_.,\- ]{3,50}$/i",
                      message: "a-Z & 0-9"
                    }],
                  })(<Input maxLength={15} />)}
                </FormItem>
                <FormItem label="Birthdate" hasFeedback {...formItemLayout}>
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
                  })(<Input maxLength="15" />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="Address 1" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address01', {
                    initialValue: item.address01,
                    rules: [
                      {
                        required: true,
                        message: "Required",
                        pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                        message: "a-Z & 0-9"
                      },
                    ],
                  })(<Input maxLength={50} />)}
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
                <Row>
                <Col span={6}>
                <Popover visible={visiblePopoverCity}
                  onVisibleChange={() => hdlPopoverVisibleCityChange()}
                  title={titlePopover}
                  content={contentPopoverCity}
                  trigger="click"
                >
                  <Button
                    type="primary"
                    style={{width:40}}
                    onClick={() => hdlButtonCityClick()}
                  ><Icon type="environment" />
                  </Button>
                </Popover>
                </Col>
                <Col span={6}>
                  {getFieldDecorator('cityId', {
                    initialValue: item.cityId,
                    rules: [
                      {
                        required: true,
                        message: "Required"
                      },
                    ],
                  })(<Input style={{width: 40}} disabled/>)}
                  </Col>
                  <Col span={6}>
                  {getFieldDecorator('cityName', {
                    initialValue: item.cityName,
                    rules: [
                      {
                        required: true,
                        message: "Required"
                      },
                    ],
                  })(<Input style={{width: 96}} disabled/>)}
                  </Col>
                  </Row>
                </FormItem>
                <FormItem label="Province" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('state', {
                    initialValue: item.state,
                    rules: [
                      {
                        required: false,
                        validate: /^[a-z0-9\_\-]{3,20}$/i,
                        message: "a-Z & 0-9"
                      },
                    ],
                  })(<Input maxLength={20} />)}
                </FormItem>
                <FormItem label="Gender" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    initialValue: item.gender,
                    rules: [
                      {
                        required: true,
                        message: 'Required',
                      },
                    ],
                  })(<Select style={{ width: 120 }}>
                    <Option value="M">Male</Option>
                    <Option value="F">Female</Option>
                  </Select>)}
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
                  })(<Input />)}
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
                  })(<Input />)}
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
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>

        <TabPane tab="Detail Kendaraan" key={2}>
          <Row>
            <Col span={24}>
              <Form layout="horizontal">
                <FormItem label="No Polisi" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('policeNo', {
                    initialValue: item.policeNo,
                    rules: [{
                      required: false,
                      pattern: /^[A-Z0-9]{1,10}\S+$/,
                      message: "No Space & Capital Letters"
                     }],
                  })(<Input maxLength={10}/>)}
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
            <Col span={24}>
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
          <Button key="submit" type="danger" onClick={() => hdlButtonDeleteUnitClick()}>Delete Unit</Button>
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
  onChooseCity: PropTypes.func,
  enablePopover: PropTypes.func,
  modalIsEmployeeChange: PropTypes.func,
  loading: PropTypes.func,
  onClickRowunit: PropTypes.func,
}

export default Form.create()(modal)
