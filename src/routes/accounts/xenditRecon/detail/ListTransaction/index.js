import moment from 'moment'
import { Button, Dropdown, Menu, Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'
import ModalPrint from './ModalPrint'

const ListTransaction = ({
  dispatch,
  loading,
  listTransactionNotRecon,
  onChangePagination,
  mode,
  modalPrintProps,
  showPDFModal,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      render: value => <div style={{ textAlign: 'center' }}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</div>
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: value => <a href={`/accounts/payment/${encodeURIComponent(value)}`} target="_blank">{value}</a>
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'MDR',
      dataIndex: 'mdrAmount',
      key: 'mdrAmount',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    }
  ]

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'xenditRecon/updateState',
      payload: {
        showPDFModalTransactionDetail: true,
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
      <Row align="middle" type="flex" style={{ marginBottom: '5px' }}>
        <h3 style={{ fontWeight: 'bolder', flex: 1 }}>List Transaction Detail</h3>
        <Dropdown overlay={menu}>
          <Button icon="download">Print</Button>
        </Dropdown>
      </Row>
      <Row>
        <Table
          {...tableProps}
          loading={loading.effects['xenditRecon/queryTransactionDetail']}
          bordered
          columns={columns}
          onChange={onChangePagination}
          scroll={{ x: 700 }}
        />
      </Row>
    </div>
  )
}

export default ListTransaction
