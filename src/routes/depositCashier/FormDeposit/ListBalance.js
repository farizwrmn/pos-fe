import moment from 'moment'
import { Button, Col, Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListBalance = ({
  loading,
  summaryDetail,
  listCreateJournal,
  handleChangePagination,
  handleResolve,
  handleEdit,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      render: (value, record) => {
        return <a href={`/setoran/cashier/balance/${record.balanceId}`} target="_blank">{value}</a>
      }
    },
    {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName'
    },
    {
      title: 'Open-Closed Time',
      render: (_, record) => <div>{moment(record.open).format('DD MMM YYYY, HH:mm:ss')} - {moment(record.closed).format('DD MMM YYYY, HH:mm:ss')}</div>
    },
    {
      title: 'Total Balance Payment',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'right' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Selisih',
      dataIndex: 'totalDiffBalance',
      key: 'totalDiffBalance',
      render: value => <div style={{ textAlign: 'right' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Journal Reference',
      render: (_, record) => {
        const currentCreateJournal = listCreateJournal.find(item => item.balanceId === record.balanceId)
        if (currentCreateJournal) return <div style={{ textAlign: 'center' }} onClick={handleEdit}>{currentCreateJournal.reference}</div>
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              icon="plus"
              onClick={() => handleResolve(record)}
              loading={loading.effects['depositCashier/queryAdd']}
            >
              Add Journal
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <Col>
      <h3 style={{ fontWeight: 'bold' }}>
        List Balance
      </h3>
      <Table
        {...tableProps}
        columns={columns}
        bordered
        onChange={handleChangePagination}
        loading={loading.effects['depositCashier/queryBalanceList']}
        footer={() => {
          return (
            <div>
              <Row type="flex" align="end" style={{ maxWidth: '250px' }}>
                <Col style={{ fontWeight: 'bold', flex: 1 }}>Total Setoran:</Col>
                <Col>{summaryDetail.balanceCount || 0}</Col>
              </Row>
              <Row type="flex" align="end" style={{ maxWidth: '250px' }}>
                <Col style={{ fontWeight: 'bold', flex: 1 }}>Total Selisih:</Col>
                <Col>{currencyFormatter(summaryDetail.totalDiffBalance)}</Col>
              </Row>
              <Row type="flex" align="end" style={{ maxWidth: '250px' }}>
                <Col style={{ fontWeight: 'bold', flex: 1 }}>Total Penjualan:</Col>
                <Col>{currencyFormatter(summaryDetail.totalBalancePayment)}</Col>
              </Row>
            </div>
          )
        }}
      />
    </Col>
  )
}

export default ListBalance
