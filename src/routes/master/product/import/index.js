import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  Button, Icon, Row
} from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import PrintXLS from './PrintXLS'

class ImportStock extends PureComponent {
  state = {
    selectedFile: null
  }

  render () {
    const {
      loading,
      dispatch,
      importstock,
      productstock,
      app
    } = this.props
    const { list, pagination } = importstock
    const { user, storeInfo } = app
    const {
      changed,
      listPrintAllStock,
      stockLoading
    } = productstock
    const listProps = {
      dataSource: list,
      pagination,
      loading: loading.effects['importstock/query'],
      onChange (page) {
        const { query, pathname } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            pageSize: page.pageSize
          }
        }))
      }
    }

    const printProps = {
      user,
      storeInfo
    }

    const uploadProps = {
      name: 'file',
      processData: false
    }

    const getAllStock = () => {
      dispatch({
        type: 'productstock/queryAllStock',
        payload: {
          type: 'all'
        }
      })
    }


    let buttonClickXLS = (changed && listPrintAllStock.length)
      ? (<PrintXLS data={listPrintAllStock} name="Export Template" {...printProps} />)
      : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get Template Data</Button>)

    const { selectedFile } = this.state

    console.log('selectedFile', selectedFile)

    return (
      <div className="content-inner">
        <Row>
          {buttonClickXLS}
          <input
            type="file"
            className="ant-btn ant-btn-default ant-btn-lg"
            {...uploadProps}
            onChange={
              (event) => {
                this.setState({
                  selectedFile: event.target.files[0]
                })
              }
            }
          />
        </Row>
        <List {...listProps} />
      </div>
    )
  }
}

export default connect(
  ({
    loading,
    importstock,
    productstock,
    app
  }) => ({
    loading,
    importstock,
    productstock,
    app
  })
)(ImportStock)
