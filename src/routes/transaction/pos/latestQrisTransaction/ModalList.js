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
      key: 'transNo'
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: value => moment(value).format('DD MMM YYYY, HH:mm:ss')
    },
    {
      title: 'Total Amount',
      dataIndex: 'amount',
      key: 'amount',
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
      footer={[
        <Button type="primary" onClick={modalProps.onCancel}>Close</Button>
      ]}
    >
      <Table
        {...tableProps}
        bordered
        pagination={false}
        columns={columns}
        loading={loading.effects['pos/getDynamicQrisLatestTransaction']}
      />
    </Modal>
  )
}

export default ModalList
