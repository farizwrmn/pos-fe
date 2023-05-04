import React from 'react'
import { Modal, Button, Collapse, Spin } from 'antd'
import { Link } from 'dva/router'

const { Panel } = Collapse

const ModalQuotation = ({
  loading,
  onCancel,
  listTrans,
  listSupplier,
  onGetDataSupplier,
  onChooseSupplier,
  ...modalProps
}) => {
  const onGetSupplier = (value) => {
    if (value) {
      onGetDataSupplier(value)
    }
  }
  return (
    <Modal
      width={800}
      onCancel={onCancel}
      footer={[
        (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['purchaseOrder/querySupplierCount']}>Cancel</Button>)
      ]}
      {...modalProps}
    >
      {listTrans && listTrans.length > 0 ? (
        <Collapse accordion onChange={onGetSupplier}>
          {listTrans.map(item => (
            <Panel header={`${item.transNo} Total: Rp ${item.total.toLocaleString()} Count: ${item.countProduct}`} key={item.id}>
              {listSupplier && !loading.effects['purchaseOrder/querySupplierCount'] ? listSupplier.map((supplier) => {
                return (
                  <div>
                    <div><Link onClick={() => onChooseSupplier(item.id, supplier.supplierId)}>{`${supplier.supplierName} Total: Rp ${supplier.total.toLocaleString()} Count: ${supplier.countSupplier} ${supplier.hasRFQ ? '(RFQ)' : ''}`}</Link></div>
                  </div>
                )
              }) : <Spin />}
            </Panel>
          ))}
        </Collapse>
      ) : <div>No Transaction. To create new <Link to="/transaction/procurement/requisition">click here</Link></div>}
    </Modal>
  )
}


export default ModalQuotation
