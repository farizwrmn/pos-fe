import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
}

const Permission = ({
  ...modalProps,
  listPermission = {},
  cancelSave,
  onOk,
  roleId,
  loading,
  item,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSave = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let arrayData = []
      if (roleId) {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            let tempData = {}
            tempData.roleId = roleId
            tempData.permissionId = listPermission.filter(x => x.permissionCode === key)[0].id
            tempData.allow = data[key]
            arrayData.push(tempData)
          }
        }

        onOk(arrayData)
      } else {
        Modal.warning({
          title: 'No Role',
          content: 'Please, create this role first'
        })
      }
    })
  }

  const footer = [
    <Button key="back" onClick={cancelSave}>Cancel</Button>,
    <Button key="submit" disabled={loading.effects['permission/edit']} type="primary" onClick={handleSave}>Save</Button>
  ]

  return (
    <Modal footer={footer} {...modalProps}>
      <Form layout="horizontal">
        {listPermission.map((data) => {
          return (
            <FormItem label={data.permissionCode} hasFeedback {...formItemLayout}>
              {getFieldDecorator(data.permissionCode, {
                valuePropName: 'checked',
                initialValue: item[data.permissionCode] === undefined ? false : item[data.permissionCode]
              })(<Checkbox>Allow</Checkbox>)}
            </FormItem>
          )
        })}
      </Form>
    </Modal >
  )
}

Permission.propTypes = {
  cancelSave: PropTypes.func,
  saveNewRole: PropTypes.func,
  listPermission: PropTypes.array.isRequired,
  roles: PropTypes.array,
  form: PropTypes.object.isRequired
}

export default Form.create()(Permission)
