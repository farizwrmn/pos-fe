import { Col, Row } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const filterColumnProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 8
}

const MachineStore = ({
  paymentMachineStore,
  loading,
  dispatch,
  location
}) => {
  const { list, pagination } = paymentMachineStore

  const listProps = {
    dispatch,
    dataSource: list,
    pagination,
    loading,
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

  const filterProps = {
    location,
    onSubmit (value) {
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          q: value,
          page: 1
        }
      }))
    }
  }

  return (
    <div>
      <Row type="flex" justify="end">
        <Col {...filterColumnProps}>
          <Filter {...filterProps} />
        </Col>
      </Row>
      <Row>
        <Col>
          <List {...listProps} />
        </Col>
      </Row>
    </div>
  )
}

export default MachineStore
