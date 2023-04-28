import React from 'react'
import { Modal, Button, Table, Input, Form } from 'antd'

const FormItem = Form.Item

const ModalReceive = ({
  loading,
  onCancel,
  modalReceiveTableProps,
  onChooseInvoice,
  searchReceive,
  handleChange,
  handleSearch,
  handleReset,
  ...modalProps
}) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Reference',
      dataIndex: 'referenceTransNo',
      key: 'referenceTransNo'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      render: text => (text || 0).toLocaleString()
    }
  ]
  return (
    <Modal
      width={800}
      onCancel={onCancel}
      footer={[
        (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['purchaseOrder/querySupplierCount']}>Cancel</Button>)
      ]}
      {...modalProps}
    >
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Invoice"
            value={searchReceive}
            ref={input => input && input.focus()}
            size="small"
            onChange={e => handleChange(e)}
            onPressEnter={handleSearch}
            style={{ marginBottom: 16 }}
          />
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={handleSearch}>Search</Button>
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={handleReset}>Reset</Button>
        </FormItem>
      </Form>

      <Table
        {...modalReceiveTableProps}
        bordered
        columns={columns}
        simple
        size="small"
        onRowClick={_record => onChooseInvoice(_record)}
      />
    </Modal>
  )
}


export default ModalReceive
