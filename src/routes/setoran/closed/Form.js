import { Button, Form, Input, Row } from 'antd'
import List from './List'

const FormItem = Form.Item

const formItemLayout = {
  wrapperCol: {
    xs: 18,
    sm: 18,
    md: 10,
    lg: 4,
    xl: 4
  },
  labelCol: {
    xs: 6,
    sm: 6,
    md: 5,
    lg: 2,
    xl: 2
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 17
    },
    sm: {
      offset: 17
    },
    md: {
      offset: 9
    },
    lg: {
      offset: 9
    },
    xl: {
      offset: 4
    }
  }
}

const FormClosed = ({
  currentBalance,
  listShift,
  listUser,
  closedBalance,
  listOpts,
  onPrint,
  onClose,
  form: {
    getFieldDecorator
  }
}) => {
  const currentShift = listShift.find(item => item.id === currentBalance.shiftId)
  const currentPIC = listUser.find(item => item.id === currentBalance.approveUserId)

  const listProps = {
    closedBalance,
    listOpts
  }

  return (
    <Form layout="horizontal">
      <FormItem label="Shift" {...formItemLayout}>
        {getFieldDecorator('shift', {
          initialValue: currentShift ? currentShift.shiftName : undefined
        })(
          <Input placeholder="Shift Not Found!" disabled />
        )}
      </FormItem>
      <FormItem label="Description" {...formItemLayout}>
        {getFieldDecorator('description', {
          initialValue: currentBalance.description || undefined
        })(
          <Input placeholder="No Description!" disabled />
        )}
      </FormItem>
      <FormItem label="Cashier" {...formItemLayout}>
        {getFieldDecorator('approveUserId', {
          initialValue: currentPIC ? currentPIC.userName : undefined
        })(
          <Input placeholder="PIC not found!" disabled />
        )}
      </FormItem>
      <FormItem>
        <Row>
          <List {...listProps} />
        </Row>
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button
          type="ghost"
          style={{ marginRight: '10px' }}
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          type="primary"
          icon="printer"
          onClick={onPrint}
        >
          Print
        </Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(FormClosed)
