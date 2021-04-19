import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Row, Col, Button, Modal } from 'antd'

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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 19
    },
    sm: {
      offset: 20
    },
    md: {
      offset: 19
    },
    lg: {
      offset: 18
    }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 16 },
  xl: { span: 16 }
}

const FormItem = Form.Item
const Option = Select.Option

const FormItemComponent = ({
  getFieldDecorator,
  item,
  selectList
}) => {
  return (
    <FormItem label={item.accountName} hasFeedback {...formItemLayout}>
      {getFieldDecorator(`${item.accountAlias}[accountId]`, {
        initialValue: item ? {
          key: item.accountId,
          name: item.accountCode ? `${item.accountCode.accountCode} - ${item.accountCode.accountName}` : 'Not define'
        } : null,
        rules: [
          {
            required: true
          }
        ]
      })(
        <Select
          showSearch
          optionFilterProp="children"
          labelInValue
          placeholder="Choose Account Code"
          style={{ width: '300px' }}
          // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
          filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
        >{selectList}
        </Select>
      )}
    </FormItem>
  )
}

const Setting = ({
  listAccountCodeLov,
  listAccountCodeDefaultLov,
  onSubmit,
  form: {
    validateFields,
    getFieldDecorator,
    getFieldsValue
  }
}) => {
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
          const params = listAccountCodeDefaultLov.map((item) => {
            return ({
              accountCategory: item.accountCategory,
              accountAlias: item.accountAlias,
              accountName: item.accountName,
              accountId: data[item.accountAlias].accountId.key
            })
          })
          onSubmit(params)
        },
        onCancel () { }
      })
    })
  }

  const selectList = (listAccountCodeLov || []).length > 0 ? listAccountCodeLov.map(item => <Option value={item.id} key={item.id}>{item.accountCode} - {item.accountName}</Option>) : []
  const formItemComponentProps = {
    getFieldDecorator,
    selectList
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          {listAccountCodeDefaultLov && listAccountCodeDefaultLov.length > 0 && (
            listAccountCodeDefaultLov.map((item) => {
              return (
                <FormItemComponent
                  key={item.id}
                  item={item}
                  {...formItemComponentProps}
                />
              )
            })
          )}
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit}>Save</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

Setting.propTypes = {
  listAccountCodeLov: PropTypes.array.isRequired
}

Setting.defaultProps = {
  listAccountCodeLov: []
}

export default Form.create()(Setting)
