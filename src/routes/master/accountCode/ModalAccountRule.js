import React, { Component } from 'react'
import { Modal, Tree, Row, Col, Button, Spin } from 'antd'

const TreeNode = Tree.TreeNode

class ModalAccountRule extends Component {
  state = {
    storeId: [], userRole: []
  }

  componentDidMount () {
    const { listDefaultRole, listDefaultStore } = this.props
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      userRole: listDefaultRole, storeId: listDefaultStore
    })
  }

  render () {
    const {
      listAllStores,
      listDefaultStore,
      listAllRole,
      listDefaultRole,
      onEdit,
      onCancel,
      onEditRole,
      loading,
      ...modalProps
    } = this.props
    const { storeId, userRole } = this.state
    const renderTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children && item.children[0] && item.children[0].key) {
          return (
            <TreeNode title={item.title} key={item.id || item.key} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode key={item.id || item.key} title={item.title} />
      })
    }

    const onRole = () => {
      const { storeId, userRole } = this.state

      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onEditRole({
            storeId: storeId.map(item => Number(item)),
            userRole
          })
        },
        onCancel () {

        }
      })
    }

    return (
      <Modal
        {...modalProps}
        onCancel={onCancel}
        footer={[
          (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['payment/create']}>Cancel</Button>),
          (<Button id="buttonEdit" type="default" style={{ float: 'left' }} onClick={onEdit} disabled={loading.effects['payment/create']}>Edit Account</Button>),
          (<Button id="button" type="primary" onClick={onRole} disabled={loading.effects['payment/create']}>Submit Role</Button>)
        ]}
      >
        {loading.effects['accountRule/queryId'] || loading.effects['accountRule/edit'] ? <Spin /> : (
          <div>
            <Row>
              <Col md={24} lg={12}>
                <div><strong>List Store</strong></div>
                <Tree
                  checkable
                  checkStrictly
                  autoExpandParent
                  defaultExpandAll
                  defaultCheckedKeys={storeId}
                  checkedKeys={storeId}
                  onCheck={(checkedKeys) => {
                    this.setState({
                      storeId: checkedKeys.checked
                    })
                  }}
                >
                  {renderTreeNodes(listAllStores)}
                </Tree>
              </Col>
              <Col md={24} lg={12}>
                <div><strong>List Role</strong></div>
                <Tree
                  checkable
                  checkStrictly
                  autoExpandParent
                  defaultExpandAll
                  defaultCheckedKeys={userRole}
                  checkedKeys={userRole}
                  onCheck={(checkedKeys) => {
                    this.setState({
                      userRole: checkedKeys.checked
                    })
                  }}
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
}

export default ModalAccountRule
