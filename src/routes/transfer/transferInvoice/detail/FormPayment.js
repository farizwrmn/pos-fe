import React from 'react'
import PropTypes from 'prop-types'
import {
  Form
  // Button,
  // Row
} from 'antd'
import List from './List'

// const FormItem = Form.Item

// const formItemLayout = {
//   labelCol: {
//     xs: {
//       span: 13
//     },
//     sm: {
//       span: 8
//     },
//     md: {
//       span: 7
//     }
//   },
//   wrapperCol: {
//     xs: {
//       span: 11
//     },
//     sm: {
//       span: 14
//     },
//     md: {
//       span: 14
//     }
//   }
// }
const FormPayment = ({
  listAmount,
  // curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0),
  // data,
  cancelPayment,
  editItem,
  // openModal,
  form: {
    resetFields
  }
}) => {
  const listProps = {
    dataSource: listAmount,
    cancelPayment,
    editList (data) {
      editItem(data)
      resetFields()
    }
  }

  // const showModal = () => {
  //   openModal()
  // }

  return (
    <Form layout="horizontal">
      {/* <Row>
        <FormItem style={{ margin: '5px 10px', float: 'right' }} {...formItemLayout}>
          <Button onClick={() => showModal()} disabled={curPayment >= data.nettoTotal}>Add</Button>
        </FormItem>
      </Row> */}
      <List {...listProps} />
    </Form >
  )
}

FormPayment.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(FormPayment)
