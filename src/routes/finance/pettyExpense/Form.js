import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Row, Spin, Col, Icon, Tooltip } from 'antd'
import { numberFormatter } from 'utils/string'
import moment from 'moment'
import styles from './index.less'
import ModalExpense from './ModalExpense'
import ModalCancel from './ModalCancel'
import ModalCashRegister from './ModalCashRegister'
import ModalEditNotes from './ModalEditNotes'

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  modalExpenseProps,
  modalCancelProps,
  modalEditNotesProps,
  modalCashRegisterProps,
  onRefresh,
  onClickNotes,
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
      {modalEditNotesProps.visible && <ModalEditNotes {...modalEditNotesProps} />}
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
                title={(
                  <div>
                    {item.isPurchase ? (<div style={{ color: item.isPurchase ? '#324aa8' : 'black' }}><strong>Purchase</strong></div>) : 'Expense'}
                    &nbsp;
                    {item.cashierInput && JSON.parse(item.cashierInput).expenseTotal &&
                      <Tooltip
                        placement="rightTop"
                        title={(
                          <div>
                            <div><b>Cashier Input</b></div>
                            <div>dateTime: <b>{JSON.parse(item.cashierInput).dateTime}</b></div>
                            <div>expenseTotal: <b>{JSON.parse(item.cashierInput).expenseTotal}</b></div>
                            <div>discount: <b>{JSON.parse(item.cashierInput).discount}</b></div>
                            <div>employeeName: <b>{JSON.parse(item.cashierInput).employeeName}</b></div>
                            <div>reference: <b>{JSON.parse(item.cashierInput).reference}</b></div>
                            <div>description: <b>{JSON.parse(item.cashierInput).description}</b></div>
                          </div>
                        )}
                      >
                        <Icon type="info-circle-o" />
                      </Tooltip>}
                  </div>
                )}
                extra={(
                  <div>
                    <Button disabled={loading} shape="circle" type="danger" loading={loading} icon="close" onClick={() => handleDelete(item)} />
                    {!item.isPurchase && <Button style={{ marginLeft: '15px' }} disabled={loading} shape="circle" type="primary" loading={loading} icon="check" onClick={() => handleClick(item)} />}
                  </div>
                )}
                bordered
              >
                <div>
                  <div>Store Name: <b>{item.storeName}</b></div>
                  <div>Reference: <b>{item.reference}</b></div>
                  <div>Expense: <b>{numberFormatter(parseFloat(item.expenseTotal))}</b></div>
                  {item.discount > 0 && <div>Discount: <b>{numberFormatter(parseFloat(item.discount))}</b></div>}
                  {item.description && <div style={{ color: '#55a756' }} onClick={() => onClickNotes(item)}>Cashier Notes: {item.description} <Icon type="edit" /></div>}
                  {item.pettyCash.description && <div>{`Finance Notes: ${item.pettyCash.description}`}</div>}
                  <div>{`Employee: ${item.employeeName}`}</div>
                  <div>{`Created By: ${item.userName}`}</div>
                  <div>{`Created At: ${moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}`}</div>
                  {item.lastUpdate && <div>{`Last Updated By: ${item.lastUpdate.employeeName}`}</div>}
                  {item.lastUpdate && <div>{`Last Updated At: ${moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`}</div>}
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
        <Button style={{ float: 'right' }} type="primary" onClick={addNewBalance}>Add More Cash/Discount</Button>
        <Button style={{ float: 'right', marginRight: '10px' }} type="default" icon onClick={onRefresh}>Refresh</Button>
      </Col>
    </Row >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default FormCounter
