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
  selectList,
  listAccountCodeLov
}) => {
  return (
    <FormItem label={item.storeName} hasFeedback {...formItemLayout}>
      {getFieldDecorator(`store-${item.id}[accountId]`, {
        initialValue: item.accountId ? item.accountId : (listAccountCodeLov && listAccountCodeLov[1] ? listAccountCodeLov[1].id : null),
        rules: [
          {
            required: true
          }
        ]
      })(
        <Select
          showSearch
          optionFilterProp="children"
          placeholder="Choose Account Code"
          style={{ width: '300px' }}
          // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >{selectList}
        </Select>
      )}
    </FormItem>
  )
}

const Setting = ({
  listAccountCodeLov,
  listAllStores,
  listOption,
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
          const params = listAllStores.map((item) => {
            return ({
              storeId: item.id,
              accountId: data[`store-${item.id}`].accountId
            })
          })
          onSubmit(params)
        },
        onCancel () { }
      })
    })
  }

  const selectList = (listAccountCodeLov || []).length > 0 ? listAccountCodeLov.map(item => <Option value={item.id} key={item.id}>{`${item.accountCode}-${item.accountName}`}</Option>) : []
  const formItemComponentProps = {
    getFieldDecorator,
    selectList,
    listAccountCodeLov
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          {listAllStores && listAllStores.length > 0 && (
            listAllStores.map((item) => {
              const filteredStore = listOption.filter(filtered => parseFloat(filtered.storeId) === parseFloat(item.id))
              if (filteredStore && filteredStore[0]) {
                item.accountId = filteredStore[0].accountId
              }
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
            <Button style={{ float: 'right' }} type="primary" onClick={handleSubmit}>Save</Button>
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
