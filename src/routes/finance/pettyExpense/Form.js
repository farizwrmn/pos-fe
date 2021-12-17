import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'
import ModalExpense from './ModalExpense'
import ModalCancel from './ModalCancel'
import ModalCashRegister from './ModalCashRegister'

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  modalExpenseProps,
  modalCancelProps,
  modalCashRegisterProps,
  loading,
  list,
  onDelete,
  addNewBalance,
  handleClick
}) => {
  const handleDelete = (item) => {
    onDelete(item)
  }

  return (
    <Row>
      {modalCancelProps.visible && <ModalCancel {...modalCancelProps} />}
      {modalExpenseProps.visible && <ModalExpense {...modalExpenseProps} />}
      {modalCashRegisterProps.visible && <ModalCashRegister {...modalCashRegisterProps} />}
      <Col {...column}>
        <h1>Approval</h1>
        <div className={styles.content} >
          {list && list.length > 0 ? list.map((item) => {
            return (
              <Card
                style={{ marginBottom: '10px' }}
                title="Expense"
                extra={(
                  <div>
                    <Button disabled={loading} shape="circle" type="danger" loading={loading} icon="close" onClick={() => handleDelete(item)} />
                    <Button style={{ marginLeft: '15px' }} disabled={loading} shape="circle" type="primary" loading={loading} icon="check" onClick={() => handleClick(item)} />
                  </div>
                )}
                bordered
              >
                <div>
                  <div><h3>{`Store Name: ${item.storeName}`}</h3></div>
                  <div><h3>{`Expense: ${numberFormatter(parseFloat(item.expenseTotal))}`}</h3></div>
                  {item.description && <div>{`Cashier Notes: ${item.description}`}</div>}
                  {item.pettyCash.description && <div>{`Finance Notes: ${item.pettyCash.description}`}</div>}
                  <div>{`Employee: ${item.employeeName}`}</div>
                  <div>{`Created By: ${item.userName}`}</div>
                </div>
              </Card>
            )
          })
            : (
              <div>{"Everything's done, have a nice day"} </div>
            )}
        </div>
      </Col>
      <Col {...column}>
        <Button style={{ float: 'right' }} type="primary" onClick={addNewBalance}>Add New</Button>
      </Col>
    </Row>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default FormCounter
