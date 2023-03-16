import React from 'react'
import { Modal, Tree, Row, Col, Button, Spin } from 'antd'

const TreeNode = Tree.TreeNode

const ModalAccountRule = ({
  listAllStores,
  listDefaultStore,
  listAllRole,
  listDefaultRole,
  onEdit,
  onCancel,
  onEditRole,
  loading,
  ...modalProps
}) => {
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children[0] && item.children[0].key) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={item.title} />
    })
  }

  const onCheckStore = (checkedKeys) => {
    // modalNodeCheckedStore(item.userId, checkedKeys.checked.filter((e) => { return e }))
    console.log('onCheckStore', checkedKeys.checked.filter((e) => { return e }))
  }

  console.log('listAllStores', listAllStores)
  console.log('listAllRole', listAllRole)

  return (
    <Modal
      {...modalProps}
      onCancel={onCancel}
      footer={[
        (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['payment/create']}>Cancel</Button>),
        (<Button id="buttonEdit" type="default" style={{ float: 'left' }} onClick={onEdit} disabled={loading.effects['payment/create']}>Edit Account</Button>),
        (<Button id="button" type="primary" onClick={onEditRole} disabled={loading.effects['payment/create']}>Submit Role</Button>)
      ]}
    >
      {loading.effects['accountRule/queryId'] || loading.effects['accountRule/edit'] ? <Spin /> : (
        <div>
          <Row>
            <Col md={24} lg={12}>
              <div>List Store</div>
              <Tree
                checkable
                checkStrictly
                autoExpandParent
                defaultExpandAll
                defaultCheckedKeys={listDefaultStore}
                onCheck={onCheckStore}
              >
                {renderTreeNodes(listAllStores)}
              </Tree>
            </Col>
            <Col md={24} lg={12}>
              <div>List Role</div>
              <Tree
                checkable
                checkStrictly
                autoExpandParent
                defaultExpandAll
                defaultCheckedKeys={listDefaultRole}
                onCheck={onCheckStore}
              >
                {renderTreeNodes(listAllRole)}
              </Tree>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  )
}

export default ModalAccountRule
