import { Button, Modal, Tag, Table } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ModalList = ({ loading, list, ...modalProps }) => {
  const tableProps = {
    dataSource: list
  }

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 140,
      render: (text, record) => {
        return <a href={`/transaction/pos/invoice/${record.posId}?status=reprint`} target="__blank">{text}</a>
      }
    },
    {
      title: 'Payment',
      dataIndex: 'paymentVia',
      key: 'paymentVia',
      width: 120
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: value => moment(value).format('DD MMM YYYY, HH:mm:ss'),
      width: 150
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text => (
        <span>
          <Tag color={text === 'A' ? 'blue' : text === 'C' ? 'red' : 'green'}>
            {text === 'A' ? 'Active' : text === 'C' ? 'Canceled' : 'Non-Active'}
          </Tag>
        </span>
      )
    },
    {
      title: 'Payment Status',
      dataIndex: 'validPayment',
      key: 'validPayment',
      width: 150,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Valid' : 'Not Valid'}</Tag></div>
    },
    {
      title: 'Total Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (value) => {
        return (
          <div style={{ textAlign: 'right' }}>
            {currencyFormatter(value)}
          </div>
        )
      }
    }
  ]

  return (
    <Modal
      {...modalProps}
      width="860"
      footer={[
        <Button type="primary" onClick={modalProps.onCancel}>Close</Button>
      ]}
    >
      <Table
        {...tableProps}
        bordered
        width={500}
        pagination={false}
        columns={columns}
        loading={loading.effects['pos/getDynamicQrisLatestTransaction']}
      />
    </Modal>
  )
}

export default ModalList
