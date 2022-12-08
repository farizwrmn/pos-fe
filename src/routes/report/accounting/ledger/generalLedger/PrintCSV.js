import React, { Component } from 'react'
import { Button, Icon, message } from 'antd'

class PrintCSV extends Component {
  state = {
    disabled: false
  }

  render () {
    const { listRekap } = this.props
    const { disabled } = this.state
    const printXLS = () => {
      this.setState({ disabled: true })
      let csvContent = 'data:text/csv;charset=utf-8,'
      let numberOfRow = 0
      let batch = 1
      for (let key in listRekap) {
        const rekap = listRekap[key]
        csvContent += `"SALDO AWAL","","${rekap.accountCode}","${rekap.accountName}","","","",${rekap.balance || 0}\n`
        numberOfRow += 1
        for (let index in rekap.items) {
          const csvData = rekap.items[index]
          csvContent += `"${csvData.transDate}","${csvData.transNo}","${csvData.accountCode}","${csvData.accountName}","${csvData.description ? csvData.description.substring(0, 80) : ''}",${csvData.debit || 0},${csvData.credit || 0},${csvData.amount || 0}\n`
          numberOfRow += 1
          if (numberOfRow > 200000) {
            console.log(`Rendering ${numberOfRow} rows`)

            message.warning(`Rendering ${numberOfRow} rows`)

            const encodedUri = encodeURI(csvContent)
            const link = document.createElement('a')
            link.setAttribute('href', encodedUri)
            link.setAttribute('download', `general_ledger_batch_${batch}.csv`)
            document.body.appendChild(link) // Required for FF

            link.click()
            batch += 1

            csvContent = 'data:text/csv;charset=utf-8,'
            numberOfRow = 0
          }
        }
      }

      message.warning(`Rendering ${numberOfRow} rows`)
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `general_ledger_batch_${batch}.csv`)
      document.body.appendChild(link) // Required for FF

      link.click()

      this.setState({ disabled: false })
    }

    return (
      <Button
        disabled={disabled}
        type="dashed"
        size="large"
        className="button-width02 button-extra-large bgcolor-green"
        onClick={() => printXLS()}
      >
        <Icon type="file-excel" className="icon-large" />
      </Button>
    )
  }
}

export default PrintCSV
