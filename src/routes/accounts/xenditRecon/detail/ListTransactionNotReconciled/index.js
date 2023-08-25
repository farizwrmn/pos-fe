import { Button, Dropdown, Menu, Row, Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'
import ModalPrint from './ModalPrint'

const ListTransactionNotReconciled = ({
  dispatch,
  listTransactionNotRecon,
  showPDFModal,
  modalPrintProps
}) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 50
    },
    {
      title: 'Invoice No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 50,
      render: value => <a href={`/accounts/payment/${encodeURIComponent(value)}`} target="_blank">{value}</a>
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 50,
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: 50,
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'recon',
      key: 'recon',
      width: 100,
      render: value => <p style={{ textAlign: 'center' }}><Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Recon' : 'Not Recon'}</Tag></p>
    }
  ]

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'xenditRecon/updateState',
      payload: {
        showPDFModalTransactionNotRecon: true,
        mode
      }
    })
  }

  const menu = (
    <Menu >
      <Menu.Item key="1"><Button onClick={() => onShowPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0, width: '100%' }} icon="file-pdf">PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0, width: '100%' }} icon="file-excel">Excel</Button></Menu.Item>
    </Menu>
  )

  return (
    <div>
      {showPDFModal && (
        <ModalPrint {...modalPrintProps} />
      )}
      <Row type="flex" align="middle" style={{ marginBottom: '5px' }}>
        <h3 style={{ fontWeight: 'bolder', flex: 1 }}>Not Reconciled</h3>
        <Dropdown overlay={menu}>
          <Button icon="download">Print</Button>
        </Dropdown>
      </Row>
      <Row>
        <Table
          dataSource={listTransactionNotRecon}
          columns={columns}
          bordered
          scroll={{ x: 700 }}
        />
      </Row>
    </div>
  )
}

export default ListTransactionNotReconciled
