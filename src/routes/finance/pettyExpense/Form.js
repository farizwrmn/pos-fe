import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Row, Spin, Col } from 'antd'
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
  onRefresh,
  loadingExpense,
  loading,
  list,
  onDelete,
  addNewBalance,
  handleClick
}) => {
  const handleDelete = (item) => {
    onDelete(item)
  }

  if (loadingExpense) {
    return (<Spin size="large" />)
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
                style={{ marginBottom: '10px', color: item.isPurchase ? '#324aa8' : 'black' }}
                title={item.isPurchase ? (<div style={{ color: item.isPurchase ? '#324aa8' : 'black' }}><strong>Purchase</strong></div>) : 'Expense'}
                extra={(
                  <div>
                    <Button disabled={loading} shape="circle" type="danger" loading={loading} icon="close" onClick={() => handleDelete(item)} />
                    {!item.isPurchase && <Button style={{ marginLeft: '15px' }} disabled={loading} shape="circle" type="primary" loading={loading} icon="check" onClick={() => handleClick(item)} />}
                  </div>
                )}
                bordered
              >
                <div>
                  <div>{`Store Name: ${item.storeName}`}</div>
                  <div>{`Expense: ${numberFormatter(parseFloat(item.expenseTotal))}`}</div>
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
        <Button style={{ float: 'right', marginRight: '10px' }} type="default" icon onClick={onRefresh}>Refresh</Button>
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
