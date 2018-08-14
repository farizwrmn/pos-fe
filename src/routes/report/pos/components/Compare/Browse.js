/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ selectedBrand, diffDay, tableHeader, ...browseProps }) => {
  let brandColumns = [
    {
      title: 'Brand 1',
      dataIndex: 'brand01',
      key: 'brand01',
      width: '60px'
    },
    {
      title: 'Brand 2',
      dataIndex: 'brand02',
      key: 'brand02',
      width: '60px'
    },
    {
      title: 'Brand 3',
      dataIndex: 'brand03',
      key: 'brand03',
      width: '60px'
    },
    {
      title: 'Brand 4',
      dataIndex: 'brand04',
      key: 'brand04',
      width: '60px'
    }
  ]

  if (tableHeader && tableHeader.length > 0) {
    let column = []
    for (let i = 0; i < tableHeader.length; i += 1) {
      column.push(
        {
          title: tableHeader[i],
          dataIndex: `brand0${i + 1}`,
          key: `brand0${i + 1}`,
          width: '60px'
        }
      )
    }
    brandColumns = column
  }

  let columns = [
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
      title: `Sold in ${diffDay > 0 ? `${diffDay} day${diffDay === 1 ? '' : 's'}` : ''}`,
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
      title: 'total',
      dataIndex: 'total',
      key: 'total',
      width: '50px'
    }
  ]
  for (let i = 0; i < brandColumns.length; i += 1) {
    columns.splice(5 + i, 0, brandColumns[i])
  }

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: '555', y: 300 }}
      columns={columns}
      simple
      size="small"
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
