/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Section Width',
      dataIndex: 'sectionWidth',
      key: 'sectionWidth',
      width: '55px'
    },
    {
      title: 'Aspect Ratio',
      dataIndex: 'aspectRatio',
      key: 'aspectRatio',
      width: '55px'
    },
    {
      title: 'Rim Diameter',
      dataIndex: 'rimDiameter',
      key: 'rimDiameter',
      width: '55px'
    },
    {
      title: 'Sold',
      dataIndex: 'salesQty',
      key: 'salesQty',
      width: '60px'
    },
    {
      title: 'Monthly TO',
      dataIndex: 'monthlyTO',
      key: 'monthlyTO',
      width: '60px'
    },
    {
      title: 'BS',
      dataIndex: 'BS',
      key: 'BS',
      width: '60px'
    },
    {
      title: 'DL',
      dataIndex: 'DL',
      key: 'DL',
      width: '60px'
    },
    {
      title: 'GT',
      dataIndex: 'GT',
      key: 'GT',
      width: '60px'
    },
    {
      title: 'MI',
      dataIndex: 'MI',
      key: 'MI',
      width: '60px'
    },
    {
      title: 'total',
      dataIndex: 'total',
      key: 'total',
      width: '50px'
    },
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: '555', y: 300 }}
        columns={columns}
        simple
        size="small"
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
