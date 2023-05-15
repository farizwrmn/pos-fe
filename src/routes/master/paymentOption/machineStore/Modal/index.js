import { Checkbox, Col, Modal, Row, Table } from 'antd'
import Filter from './Filter'

const ModalForm = ({
  selectedAddList,
  loading,
  unrelatedSearchKey,
  listUnrelated,
  pagination,
  visible,
  title,
  handleCancel,
  handleSubmit,
  handleUnrelatedPagination,
  handleSearch,
  handleAdd
}) => {
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
      render: (_, record) => {
        const filteredAddList = selectedAddList.filter(filtered => filtered === record.id)
        const checked = (filteredAddList && filteredAddList[0])
        return (
          <div style={{ textAlign: 'center' }}>
            <Checkbox checked={checked} onChange={(event) => { handleAdd(event, record) }} />
          </div>
        )
      }
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
      onOk={handleSubmit}
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
            loading={loading.effects['paymentMachineStore/queryUnrelated']}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalForm
