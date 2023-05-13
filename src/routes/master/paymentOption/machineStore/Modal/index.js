import { Button, Col, Modal, Row, Table } from 'antd'
import Filter from './Filter'

const ModalForm = ({
  unrelatedSearchKey,
  listUnrelated,
  pagination,
  visible,
  title,
  handleCancel,
  handleSubmit,
  handleUnrelatedPagination,
  handleSearch
}) => {
  const modalConfirm = (record) => {
    Modal.confirm({
      title: `Add ${record.name}`,
      content: 'Are you sure?',
      onOk: () => handleSubmit(record.id)
    })
  }

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'index',
      width: 100
    }, {
      title: 'Payment Option',
      dataIndex: 'paymentOption',
      key: 'paymentOption',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    }, {
      title: 'Account',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 100,
      render: (value, record) => `${value} - ${record.accountName}`
    }, {
      title: 'Action',
      width: 100,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="small"
            icon="plus"
            onClick={() => modalConfirm(record)}
          >
            Add
          </Button>
        </div>
      )
    }
  ]

  const filterProps = {
    q: unrelatedSearchKey,
    handleSearch
  }

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      title={title}
    >
      <Row justify="end" type="flex" style={{ marginBottom: '10px' }}>
        <Col>
          <Filter {...filterProps} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            columns={column}
            dataSource={listUnrelated}
            scroll={{ x: 400 }}
            pagination={pagination}
            onChange={handleUnrelatedPagination}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalForm
