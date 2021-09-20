import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Input, Modal, Checkbox, Button, Row, Col, Popover, Table, Collapse,
  Tabs, Transfer, Tree,
  // Switch, Icon, Card,
  Select
} from 'antd'
import styles from './Modal.less'
// import Fingerprint from './Fingerprint'

const FormItem = Form.Item
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane
const confirm = Modal.confirm
const TreeNode = Tree.TreeNode
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const paddingTop10 = {
  paddingTop: '10px',
  display: 'block'
}

const modal = ({
  item = {},
  storeItem = {},
  roleItem = {},
  listAllStores = [],
  listUserStores = [],
  listLovEmployee = [],
  listRole = [],
  listUserRole = [],
  listUserRoleTarget = [],
  currentUserRole = [],
  listUserRoleChange = {},
  listCheckedStores = [],
  modalType,
  dispatch,
  onOk,
  onChooseItem,
  visiblePopover = false,
  disabledItem = { userId: true, getEmployee: true },
  activeTab,
  totpChecked,
  // totp = { key: '', url: '' },
  modalPopoverVisible,
  modalPopoverClose,
  modalButtonCancelClick,
  modalButtonSaveClick,
  modalActiveTab,
  modalRoleLoad,
  modalRoleAdd,
  modalSwitchChange,
  modalTotpLoad,
  modalChangeDefaultStore,
  modalChangeDefaultRole,
  modalNodeCheckedStore,
  modalAllStoresLoad,
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
        key: item.key
      }
      data.userRole = data.userRole.join(' ')

      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }
  const columns = [{
    title: 'Employee Id',
    dataIndex: 'employeeId',
    key: 'employeeId',
    width: 100
  }, {
    title: 'Name',
    dataIndex: 'employeeName',
    key: 'employeeName',
    width: 200
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 250
  }, {
    title: 'Position',
    dataIndex: 'positionName',
    key: 'positionName',
    width: 200
  }]


  const hdlTabCallback = (key) => {
    activeTab = key
    modalActiveTab(activeTab)
    if (activeTab === '3') {
      modalRoleLoad(item.userId)
    } else if (activeTab === '4') {
      modalAllStoresLoad(item.userId)
    } else if (activeTab === '5') {
      // Get List Fingerprint
    } else if (activeTab === '6') {
      modalTotpLoad(item.userId)
    }
  }
  const hdlTableRowClick = (record) => {
    onChooseItem(record)
  }
  const hdlPopoverVisibleChange = () => {
    modalPopoverVisible()
  }
  const hdlPopoverClose = () => {
    modalPopoverClose()
  }
  const hdlButtonCancelClick = () => {
    modalButtonCancelClick()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      // data.active = data.active !== undefined ? true : false

      // Start - Update User
      // if there is no update on password
      if (modalType === 'edit' && data.password === 'xxxxxx') {
        data.oldpassword = undefined
        data.password = undefined
        data.confirm = undefined
      }
      data.userRole = undefined
      modalButtonSaveClick(data.userId, data, '1')
      // End - Update User
      if (listUserRoleChange
        && listUserRoleChange.in
        && listUserRoleChange.out
        && (listUserRoleChange.in.length > 0 || listUserRoleChange.out.length > 0)) {
        modalButtonSaveClick(data.userId, listUserRoleChange, '3')
      }
      if (listCheckedStores && listCheckedStores.length > 0) {
        modalButtonSaveClick(data.userId, listCheckedStores, '4')
      }
    })
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
  // const confirmDisableTotp = () => {
  //   confirm({
  //     title: 'Are you sure disable TOTP?',
  //     content: 'Disable Two-Factor Authentication will not secure your login',
  //     okText: 'Yes',
  //     okType: 'danger',
  //     cancelText: 'No',
  //     onOk () {
  //       modalSwitchChange(false, item.userId)
  //     },
  //     onCancel () {
  //       console.log('Cancel')
  //     }
  //   })
  // }
  // const hdlSwitchChange = (checked) => {
  //   if (!checked) {
  //     confirmDisableTotp()
  //   } else {
  //     modalSwitchChange(true, item.userId)
  //   }
  // }

  const titlePopover = (
    <Row>
      <Col span={8}>Choose Employee</Col>
      <Col span={1} offset={15}>
        <Button shape="circle"
          icon="close-circle"
          size="small"
          onClick={() => hdlPopoverClose()}
        />
      </Col>
    </Row>
  )
  const contentPopover = (
    <div>
      <Table
        columns={columns}
        dataSource={listLovEmployee}
        size="small"
        bordered
        pagination={{ pageSize: 5 }}
        onRowClick={record => hdlTableRowClick(record)}
      />
    </div>
  )

  const targetKeys = listUserRoleTarget
  const optionRole = listRole && listRole.length > 0
    ? listRole.filter(filtered => filtered.key !== 'OWN').map(c => <Option value={c.key} disabled={!(listUserRole.includes(c.key))}>{c.title}</Option>)
    : []
  const hdlTransferAdd = (nextTargetKeys) => {
    currentUserRole = nextTargetKeys
    // console.log('in',currentUserRole.filter(x => listUserRole.indexOf(x) < 0 ))
    // console.log('out',listUserRole.filter(x => currentUserRole.indexOf(x) < 0 ))
    modalRoleAdd(nextTargetKeys,
      currentUserRole.filter(x => listUserRole.indexOf(x) < 0),
      listUserRole.filter(x => currentUserRole.indexOf(x) < 0)
    )
  }

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children[0] && item.children[0].key) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={item.title} />
    })
  }

  // const fingerprintProps = {
  //   formItemLayout,
  //   item,
  //   registerFingerprint (payload) {
  //     dispatch({
  //       type: 'employee/registerFingerprint',
  //       payload
  //     })
  //   }
  // }

  const hdlOnCheckStore = (checkedKeys) => {
    modalNodeCheckedStore(item.userId, checkedKeys.checked.filter((e) => { return e }))
  }
  // const hdlOnSelectStore = (selectedKeys, info) => {
  //   console.log('onSelect', info)
  //   console.log('selected', selectedKeys)
  // }
  const hdlSetDefaultStore = (info) => {
    info.node.props.checked && (info.node.props.title !== storeItem.default) &&
      confirm({
        title: `Are you sure change default store to [ ${`${info.node.props.eventKey} - ${info.node.props.title}`} ] ?`,
        onOk () {
          modalChangeDefaultStore(item.userId, info.node.props.eventKey)
        }
      })
  }
  const hdlSetDefaultRole = (value) => {
    value &&
      confirm({
        title: `Are you sure change default role to [ ${value.label} ] ?`,
        onOk () {
          modalChangeDefaultRole(item.userId, value.key)
        }
      })
  }
  return (
    <Modal width="35vw"
      height="70vh"
      className={styles.modal}
      {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary" >Save</Button>
      ]}
    >
      <Tabs type="card" ActiveKey="2" size="small" tabPosition="top" onChange={hdlTabCallback}>
        <TabPane tab="Main" key="1">
          <Form layout="horizontal">
            <FormItem label="is Employee ?" {...formItemLayout} >
              {getFieldDecorator('isEmployee', {
                valuePropName: 'checked',
                initialValue: ((item.isEmployee === null || item.isEmployee === true) ? true : item.isEmployee)
              })(<Checkbox disabled={!!((item.isEmployee === null || item.isEmployee === true))} />)}
            </FormItem>
            <FormItem label="User Id"
              hasFeedback
              {...formItemLayout}
              extra="If user is employee then click [Get Employee]."
            >
              <Row gutter={2}>
                <Col span={10}>
                  <Popover visible={visiblePopover}
                    onVisibleChange={() => hdlPopoverVisibleChange()}
                    title={titlePopover}
                    content={contentPopover}
                    trigger="click"
                  >
                    <Button type="primary"
                      disabled={disabledItem.getEmployee}
                    > Get Employee
                    </Button>
                  </Popover>
                </Col>
                <Col span={14}>
                  {getFieldDecorator('userId', {
                    initialValue: item.userId,
                    rules: [{ required: true, min: 5 }]
                  })(
                    <Input disabled />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mobileNumber', {
                initialValue: item.mobileNumber,
                rules: [
                  {
                    required: true,
                    // pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                    message: 'mobile number is not valid'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="User Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: item.userName,
                rules: [{ required: true, min: 4 }]
              })(<Input />)}
            </FormItem>
            <FormItem label="Active" {...formItemLayout}>
              {getFieldDecorator('active', {
                valuePropName: 'checked',
                initialValue: item.active === undefined ? true : item.active
              })(<Checkbox />)}
            </FormItem>
            <FormItem label="E-mail" hasFeedback {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: item.email,
                rules: [
                  {
                    required: true,
                    pattern: /^([a-zA-Z0-9._-])+@([a-zA-Z0-9._-])+(.[a-zA-Z0-9._-])+/,
                    message: 'The input is not valid E-mail!'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Full Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('fullName', {
                initialValue: item.fullName,
                rules: [{ min: 4 }]
              })(<Input />)}
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="Password" key="2">
          <Collapse defaultActiveKey={['1']} >
            <Panel header="Change" key="1" >
              <FormItem label="Input old password" hasFeedback {...formItemLayout}>
                {getFieldDecorator('oldpassword', {
                  initialValue: 'xxxxxx',
                  rules: [{
                    required: true, min: 5, message: 'Please input your old password!'
                  }]
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem label="Choose a password" hasFeedback {...formItemLayout}>
                {getFieldDecorator('password', {
                  initialValue: 'xxxxxx',
                  rules: [{
                    required: true, min: 5, message: 'Please input your new password!'
                  }, {
                    validator: hdlCheckConfirm
                  }]
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem label="Re-enter password" hasFeedback {...formItemLayout}>
                {getFieldDecorator('confirm', {
                  initialValue: 'xxxxxx',
                  rules: [{
                    required: true, min: 5, message: 'Please confirm your password!'
                  }, {
                    validator: hdlCheckPassword
                  }]
                })(
                  <Input type="password" />
                )}
              </FormItem>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane tab="Role" key="3">
          <Transfer
            dataSource={listRole && listRole.filter(filtered => filtered.key !== 'OWN')}
            onChange={hdlTransferAdd}
            targetKeys={targetKeys}
            titles={['Source', 'Target']}
            render={item => item.title}
          />
          <span style={paddingTop10} />
          <Row>
            <Col span={6} style={{ lineHeight: '26px' }}>Set Default Role</Col>
            <Col span={18}>
              <Select style={{ width: '100%' }}
                labelInValue
                value={{ key: roleItem.default }}
                onChange={hdlSetDefaultRole}
              >{optionRole}</Select>
            </Col>
          </Row>

        </TabPane>
        <TabPane tab="Store" key="4">
          <Tree
            checkable
            checkStrictly
            autoExpandParent
            defaultExpandAll
            defaultCheckedKeys={listUserStores}
            onRightClick={hdlSetDefaultStore}
            onCheck={hdlOnCheckStore}
          >
            {renderTreeNodes(listAllStores)}
          </Tree>
          <span style={paddingTop10} />
          <Input
            value={storeItem.default}
            addonBefore="Default (right-click tree-node to change): "
            size="small"
            placeholder="no default store"
            disabled
          />
        </TabPane>
        {/* <TabPane tab="Fingerprint" key="5">
          <Fingerprint {...fingerprintProps} />
        </TabPane> */}
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
  modalIsEmployeeChange: PropTypes.func
}

export default Form.create()(modal)
