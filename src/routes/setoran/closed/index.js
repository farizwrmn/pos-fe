import React from 'react'
import { connect } from 'dva'
import List from './List'

class SetoranClosed extends React.Component {
  render () {
    const {
      setoran
    } = this.props
    const {
      closedBalance
    } = setoran

    const listProps = {
      list: closedBalance
    }

    return (
      <div className="content-inner">
        Testing
        <List {...listProps} />
      </div>
    )
  }
}

export default connect(({
  loading,
  setoran
}) => ({
  loading,
  setoran
}))(SetoranClosed)
