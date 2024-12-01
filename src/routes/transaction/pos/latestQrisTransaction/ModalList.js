import { Button, Modal, Table } from 'antd'
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
      width: 150,
      render: (text, record) => {
        return <a href={`/transaction/pos/invoice/${record.posId}?status=reprint`} target="__blank">{text}</a>
      }
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 180
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: value => moment(value).format('DD MMM YYYY, HH:mm:ss'),
      width: 150
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
      width="700"
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
