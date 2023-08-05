import { Form, Row } from 'antd'
import FormClosing from './Form'

const ClosingBalance = () => {
  return (
    <div className="content-inner">
      <Row>
        <FormClosing />
      </Row>
    </div>
  )
}

export default Form.create()(ClosingBalance)
