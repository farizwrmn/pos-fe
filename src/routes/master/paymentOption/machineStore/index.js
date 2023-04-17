import { Col, Row } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'

const listColumnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12
}

const MachineStore = ({
  paymentMachineStore,
  loading,
  dispatch,
  location
}) => {
  const { list, pagination } = paymentMachineStore

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['paymentMachineStore/query'],
    handlePagination (paginationValue) {
      const { current: page, pageSize } = paginationValue
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page,
          pageSize
        }
      }))
    }
  }

  return (
    <div>
      <Row>
        <Col {...listColumnProps}>
          <List {...listProps} />
        </Col>
      </Row>
    </div>
  )
}

export default MachineStore
