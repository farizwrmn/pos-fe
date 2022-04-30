import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Pagination, Tree } from 'antd'
// import { arrayToTree } from 'utils'
import mapValues from 'lodash/mapValues'
import values from 'lodash/values'
import groupBy from 'lodash/groupBy'

const TreeNode = Tree.TreeNode

const List = ({ ...tableProps, editItemById }) => {
  const { dataSource } = tableProps
  const handleClickTree = (event, id) => {
    Modal.confirm({
      title: 'Edit item ?',
      content: `You're gonna edit item ${event}`,
      onOk () {
        editItemById(id)
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  const grouped = mapValues(groupBy(dataSource, 'categoryId'), clist => clist.map(car => _.omit(car, 'categoryId')))
  const arrayGrouped = values(grouped)
  const groupeded = arrayGrouped.map((x) => {
    return x
  }).map((y) => {
    return {
      categoryId: y[0].categoryId,
      categoryName: y[0].categoryName,
      name: y[0].name,
      data: y
    }
  })


  // const menuTree = arrayToTree((dataSource || []).filter(_ => _.id !== null), 'id', 'categoryParentId')
  // const levelMap = {}
  // const getMenus = (menuTreeN) => {
  //   return menuTreeN.map((item) => {
  //     if (item.children) {
  //       if (item.categoryParentId) {
  //         levelMap[item.id] = item.categoryParentId
  //       }
  //       return (
  //         <TreeNode key={item.categoryCode} title={(<div onClick={() => handleClickTree(item.categoryCode, item.id)} value={item.categoryCode}>{item.categoryName} ({item.categoryCode})</div>)}>
  //           {getMenus(item.children)}
  //         </TreeNode>
  //       )
  //     }
  //     return (
  //       <TreeNode key={item.categoryCode} title={(<div onClick={() => handleClickTree(item.categoryCode, item.id)} value={item.categoryCode}>{item.categoryName} ({item.categoryCode})</div>)}>
  //         {(!menuTree.includes(item)) && item.name}
  //       </TreeNode>
  //     )
  //   })
  // }
  // const categoryVisual = getMenus(menuTree)

  // const columns = [
  //   {
  //     title: 'Category',
  //     dataIndex: 'categoryCode',
  //     key: 'categoryCode'
  //   },
  //   {
  //     title: 'Category Name',
  //     dataIndex: 'categoryName',
  //     key: 'categoryName'
  //   },
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     key: 'name'
  //   },
  //   {
  //     title: 'Created',
  //     children: [
  //       {
  //         title: 'By',
  //         dataIndex: 'createdBy',
  //         key: 'createdBy',
  //         width: '100px'
  //       },
  //       {
  //         title: 'Time',
  //         dataIndex: 'createdAt',
  //         key: 'createdAt',
  //         width: '150px',
  //         render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Updated',
  //     children: [
  //       {
  //         title: 'By',
  //         dataIndex: 'updatedBy',
  //         key: 'updatedBy',
  //         width: '100px'
  //       },
  //       {
  //         title: 'Time',
  //         dataIndex: 'updatedAt',
  //         key: 'updatedAt',
  //         width: '150px',
  //         render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Operation',
  //     key: 'operation',
  //     width: 100,
  //     fixed: 'right',
  //     render: (text, record) => {
  //       return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
  //     }
  //   }
  // ]

  return (
    <div>
      {/* <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
      /> */}
      {(groupeded || []).length > 0 &&
        <div>
          <strong style={{ fontSize: '15' }}> Current Category </strong>
          <br />
          <br />
          <div style={{ margin: '0px', width: '100 %', overflowY: 'auto', height: '300px' }}>
            {(groupeded || []).map((x) => {
              return (
                <Tree
                  showLine
                  // onRightClick={handleChooseTree}
                  defaultExpandAll
                >
                  <TreeNode title={x.categoryName} key={x.categoryId}>
                    {(x.data || []).map((y) => {
                      return <TreeNode title={(<div onClick={() => handleClickTree(y.name, y.id)} value={y.id}>({y.name})</div>)} key={y.id} />
                    })}
                  </TreeNode>
                  {/* {categoryVisual} */}
                </Tree>)
            })}
          </div>
        </div>
      }
      <Pagination {...tableProps} {...tableProps.pagination} />
      {/* {(dataSource || []).length > 0 &&
        <div>
          <strong style={{ fontSize: '15' }}> Current Category </strong>
          <br />
          <br />
          <div style={{ margin: '0px', width: '100 %', overflowY: 'auto', height: '300px' }}>
            <Tree
              showLine
              // onRightClick={handleChooseTree}
              defaultExpandAll
            >
              {categoryVisual}
            </Tree>
          </div>
        </div>}
      <Pagination {...tableProps} {...tableProps.pagination} /> */}
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
