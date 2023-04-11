import React from 'react'
import PropTypes from 'prop-types'
import {
  Form
  // Button,
  // Row
} from 'antd'
import ListAccounting from './ListAccounting'

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

const FormAccounting = ({
  listAccounting
}) => {
  const listProps = {
    dataSource: listAccounting
  }

  return (
    <Form layout="horizontal">
      {/* <Row>
        <FormItem style={{ margin: '5px 10px', float: 'right' }} {...formItemLayout}>
          <Button onClick={() => showModal('modalVisible')} disabled={curPayment >= (data.length > 0 ? data[0].nettoTotal : 0)}>Add</Button>
        </FormItem>
      </Row> */}
      <ListAccounting {...listProps} />
    </Form>
  )
}

FormAccounting.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(FormAccounting)
