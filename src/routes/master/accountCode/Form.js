import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree, Button, Row, Col, Modal, Select } from 'antd'
import { arrayToTree } from 'utils'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = Tree.TreeNode

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
  listAccountCodeLov,
  onSubmit,
  onCancel,
  modalType,
  button,
  queryEditItem,
  showParent,
  loading,
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

  const handleClickTree = (item) => {
    resetFields()
    queryEditItem(item)
  }

  const listOptions = (listAccountCodeLov || []).length > 0 ? (listAccountCodeLov || []).map(c => <Option key={c.id}>{c.accountName} ({c.accountCode})</Option>) : []
  const listAccountType = [
    {
      key: 'BANK',
      value: 'Kas / Bank'
    },
    {
      key: 'AREC',
      value: 'Piutang Usaha'
    },
    {
      key: 'INTR',
      value: 'Persediaan'
    },
    {
      key: 'OCAS',
      value: 'Aset Lancar lainnya'
    },
    {
      key: 'FASS',
      value: 'Aset Tetap'
    },
    {
      key: 'DEPR',
      value: 'Akumulasi Depresiasi'
    },
    {
      key: 'OASS',
      value: 'Aset lainnya'
    },
    {
      key: 'APAY',
      value: 'Hutang lancar lain-lain'
    },
    {
      key: 'OCLY',
      value: 'Hutang lancar lain-lain'
    },
    {
      key: 'LTLY',
      value: 'Hutang jangka panjang'
    },
    {
      key: 'EQTY',
      value: 'Ekuitas'
    },
    {
      key: 'REVE',
      value: 'Pendapatan'
    },
    {
      key: 'COGS',
      value: 'Beban Pokok Penjualan'
    },
    {
      key: 'EXPS',
      value: 'Beban'
    },
    {
      key: 'OEXP',
      value: 'Beban lain-lain'
    },
    {
      key: 'OINC',
      value: 'Pendapatan lain-lain'
    }
  ]

  const listOptionAccountType = listAccountType.map(c => <Option key={c.key}>{`${c.value} (${c.key})`}</Option>)

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const menuTree = arrayToTree((listAccountCodeLov || []).filter(filtered => filtered.id !== null), 'id', 'accountParentId')
  const levelMap = {}
  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.accountParentId) {
          levelMap[item.id] = item.accountParentId
        }
        return (
          <TreeNode
            key={item.accountCode}
            disabled={loading.effects['accountRule/queryId']}
            title={(
              <div
                onClick={() => handleClickTree(item)}
                value={item.accountCode}
              >
                {item.accountCode} - {item.accountName}
              </div>
            )}
          >
            {getMenus(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.accountCode}
          disabled={loading.effects['accountRule/queryId']}
          title={(
            <div
              onClick={() => handleClickTree(item)}
              value={item.accountCode}
            >
              {item.accountCode} - {item.accountName}
            </div>
          )}
        >
          {(!menuTree.includes(item)) && item.name}
        </TreeNode>
      )
    })
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data.accountParentId) {
        data.accountParentId = data.accountParentId.key
      }
      if (data.accountType) {
        data.accountType = data.accountType.key
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  const getData = () => {
    showParent()
  }

  const Visualize = getMenus(menuTree)

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Account Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountCode', {
              initialValue: item.accountCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9-/.,_]+$/i
                }
              ]
            })(<Input maxLength={50} autoFocus disabled={modalType === 'edit'} />)}
          </FormItem>
          <FormItem label="Account Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountName', {
              initialValue: item.accountName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={40} disabled={modalType === 'edit'} />)}
          </FormItem>
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountType', {
              initialValue: item ? {
                key: item.accountType,
                name: item.accountType
              } : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Account Type"
              labelInValue
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{listOptionAccountType}
            </Select>)}
          </FormItem>
          <FormItem label="Parent" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountParentId', {
              initialValue: item ? {
                key: item.accountParentId,
                name: item.accountParentName
              } : null,
              rules: [
                {
                  required: false
                }
              ]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Parent of category"
              onFocus={getData}
              labelInValue
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{listOptions}
            </Select>)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        {(listAccountCodeLov || []).length > 0 &&
          <div>
            <strong style={{ fontSize: '15' }}> Current Account </strong>
            <br />
            <br />
            <Col {...column}>
              <div style={{ margin: '0px', width: '100%', overflowY: 'auto', height: '400px' }}>
                <Tree
                  showLine
                  // onRightClick={handleChooseTree}
                  defaultExpandAll
                >
                  {Visualize}
                </Tree>
              </div>
            </Col>
          </div>}
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
