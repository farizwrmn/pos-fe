import { Card, Checkbox, Col, Row, Tag } from 'antd'
import { getName } from 'utils/link'
import { currencyFormatter } from 'utils/string'

const ItemJournal = ({
  loading,
  isChecked = false,
  item,
  listSelectedLedger,
  handleCheckItem
}) => {
  const onSelect = (checked) => {
    if (checked === true) {
      const result = listSelectedLedger.filter(filtered => filtered.id !== item.id)
      handleCheckItem(result)
    } else {
      const result = [
        ...listSelectedLedger,
        {
          id: item.id,
          debit: item.debit,
          transactionId: item.transactionId,
          transactionType: item.transactionType
        }]
      handleCheckItem(result)
    }
  }

  const cardTitleComponent = item.recon === 1
    ? (
      <Row type="flex" justify="end" align="middle">
        <a
          target="__blank"
          href={`/journal-entry/${item.transactionId}`}
          style={{ flex: 1 }}
        >
          {getName(item.transactionType)}
        </a>
        <Tag color="green">
          Reconciled
        </Tag>
      </Row>
    ) : (
      <Row align="middle">
        <Checkbox style={{ marginRight: '10px' }} onChange={() => onSelect(isChecked)} checked={isChecked} />
        <a target="__blank" href={`/journal-entry/${item.transactionId}`}>
          {getName(item.transactionType)}
        </a>
      </Row>
    )

  return (
    <Card
      title={cardTitleComponent}
      style={{ marginBottom: '10px' }}
      loading={loading}
    >
      <Row style={{ fontWeight: 'bold' }}>
        {`${item.accountName} (${item.accountCode})`}
      </Row>
      <Row>
        <Col span={12}>
          <div>Trans No:</div>
        </Col>
        <Col span={12}>
          {item.transNo}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div>{item.transDate}</div>
        </Col>
        <Col span={12}>
          {item.debit && item.debit != null ? <div>{`(DB) ${currencyFormatter(Number(item.debit))}`}</div> : null}
          {item.credit && item.credit != null ? <div>{`(CR) ${currencyFormatter(Number(item.credit))}`}</div> : null}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div>Description:</div>
        </Col>
        <Col span={12}>
          {item.description}
        </Col>
      </Row>
    </Card>
  )
}

export default ItemJournal
