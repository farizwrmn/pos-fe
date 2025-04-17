import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Input, Modal, Checkbox, Button, Row, Col, Collapse,
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

const ModalEntry = ({
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
  modalAllTargetStoresLoad,
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


  const hdlTabCallback = (key) => {
    activeTab = key
    modalActiveTab(activeTab)
    if (activeTab === '3') {
      modalRoleLoad(item.userId)
    } else if (activeTab === '4') {
      modalAllStoresLoad(item.userId)
    } else if (activeTab === '5') {
      modalAllTargetStoresLoad(item.userId) // get all target stores
    } else if (activeTab === '7') {
      modalTotpLoad(item.userId)
    }
  }

  const hdlTableRowClick = (record) => {
    onChooseItem(record)
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
        modalButtonSaveClick(data.userId, listUserRoleChange, activeTab)
      }
      if (listCheckedStores && listCheckedStores.length > 0) {
        modalButtonSaveClick(data.userId, listCheckedStores, activeTab)
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


  const targetKeys = listUserRoleTarget
  const optionRole = listRole && listRole.length > 0
    ? (listUserRoleTarget.includes('SPR') ? listRole.filter(filtered => filtered.key !== 'OWN') : listRole.filter(filtered => filtered.key !== 'OWN' && filtered.key !== 'SPR')).map(c => <Option value={c.key} disabled={!(listUserRole.includes(c.key))}>{c.title}</Option>)
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

  const listEmployee = (listLovEmployee || []).length > 0 ? listLovEmployee.map(c => <Option value={c.employeeId} key={c.employeeId} title={`${c.employeeId} (${c.employeeName})`}>{`${c.employeeId} (${c.employeeName})`}</Option>) : []

  return (
    <Modal width="35vw"
      height="70vh"
      className={styles.ModalEntry}
      {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary" >Save</Button>
      ]}
    >
      <Tabs type="card" activeKey={activeTab} size="small" tabPosition="top" onChange={hdlTabCallback}>
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
              {getFieldDecorator('userId', {
                initialValue: item.userId,
                rules: [{ required: true, pattern: /^[\s\S]{4,200}$/, message: 'Min: 4, Max: 200' }]
              })(<Select
                showSearch
                disabled={modalType === 'edit'}
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={(employeeId) => {
                  const selected = listLovEmployee.find(filtered => filtered.employeeId === employeeId)
                  hdlTableRowClick(selected)
                }}
              >
                {listEmployee}
              </Select>)}
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
                rules: [{ required: true, pattern: /^[\s\S]{4,200}$/, message: 'Min: 4, Max: 200' }]
              })(<Input maxLength={200} />)}
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
            dataSource={listRole && ((listUserRoleTarget.includes('SPR') ? listRole.filter(filtered => filtered.key !== 'OWN') : listRole.filter(filtered => filtered.key !== 'OWN' && filtered.key !== 'SPR')))}
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
        <TabPane tab="Access" key="4">
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
        <TabPane tab="Target Store" key="5">
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

ModalEntry.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onChooseItem: PropTypes.func,
  enablePopover: PropTypes.func,
  modalIsEmployeeChange: PropTypes.func
}

export default Form.create()(ModalEntry)
