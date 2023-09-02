import { Button, Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'
import ModalResolve from './ModalResolve'

const ListResolve = ({
  listAccountCodeLov,
  dispatch,
  visibleResolveModal,
  handleOpenResolveModal,
  onChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Tipe Pembayaran',
      dataIndex: 'paymentOptionName',
      key: 'paymentOptionName',
      width: 100
    },
    {
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      width: 100,
      render: value => <div style={{ textAlign: 'end', color: value > 0 ? '#008000' : value < 0 ? '#FF0000' : '#000000' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Resolve Status',
      dataIndex: 'statusResolved',
      key: 'statusResolved',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}>{value || '-'}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 'completed' ? 'green' : 'red'}>{value === 'completed' ? 'Completed' : 'Pending'}</Tag></div>
    },
    {
      title: 'Action',
      width: 100,
      render: (_) => {
        return (
          <div style={{ textAlign: 'center' }} >
            <Button
              type="primary"
              onClick={handleOpenResolveModal}
            >
              Resolve Conflict
            </Button>
          </div>
        )
      }
    }
  ]

  const modalResolveProps = {
    listAccountCodeLov,
    title: 'Resolve Conflict',
    visible: visibleResolveModal,
    onCancel: () => {
      dispatch({
        type: 'setoranCashier/updateState',
        payload: {
          visibleResolveModal: false
        }
      })
    }
  }

  return (
    <div>
      <Table
        {...tableProps}
        columns={columns}
        bordered
        onChange={onChangePagination}
      />
      {visibleResolveModal && <ModalResolve {...modalResolveProps} />}
    </div>
  )
}

export default ListResolve
