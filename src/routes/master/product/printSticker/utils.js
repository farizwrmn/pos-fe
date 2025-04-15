import { message } from 'antd'
import { numberFormatter } from 'utils/string'
import * as XLSX from 'xlsx'
import { lstorage } from 'utils'

const errorCallback = (errorMessage) => {
  message.error(`Error: ${errorMessage}`)
}

const writeToSelectedPrinter = (dataToWrite) => {
  console.log('dataToWrite', dataToWrite)
  let selected_device = null
  BrowserPrint.getDefaultDevice('printer', (device) => {
    console.log('device', device)
    selected_device = device
    selected_device.send(dataToWrite, undefined, errorCallback)
  }, () => {
    message.error('Error getting local devices')
  }, 'printer')
}

export const onPrintZebra = (listSticker) => {
  const CENTER_SPACE = 250
  console.log('onPrintZebra', listSticker)
  const stickers = []
  for (let key in listSticker) {
    const product = listSticker[key]
    for (let index = 0; index < product.qty; index += 1) {
      stickers.push(product)
    }
  }

  let listLength = stickers.length
  let numberOfRow = Math.floor(stickers.length / 3)
  let remainData = stickers.length % 3
  for (let row = 0; row < numberOfRow; row += 1) {
    let finalString = '^XA'
    for (let column = 0; column < 3; column += 1) {
      const currentIndex = (row * 3) + (column)
      if (currentIndex < listLength) {
        const product = stickers[currentIndex]
        const MARGIN_LEFT = 20
        const marginLeft = MARGIN_LEFT + (CENTER_SPACE * column)
        finalString += `
        ^BY1,1,50
        ^CFA,16
        ^FO${marginLeft},20^FDRp ${numberFormatter(parseInt(product.info.sellPrice, 0))}^FS
        ^FO${marginLeft},40^FD${product.info.productCode}^FS
        ^FO${marginLeft},60^A,20,20^BC^FD${product.info.barCode01}^FS
        `
      }
    }
    finalString += '^XZ'
    writeToSelectedPrinter(finalString)
  }

  console.log('remainData', remainData)
  if (remainData > 0) {
    let finalString = '^XA'
    for (let column = 0; column < 3; column += 1) {
      console.log('numberOfRow', numberOfRow)
      console.log('column', column)
      const currentIndex = (numberOfRow * 3) + (column)
      if (currentIndex < listLength) {
        const product = stickers[currentIndex]
        const MARGIN_LEFT = 20
        const marginLeft = MARGIN_LEFT + (CENTER_SPACE * column)
        finalString += `
        ^BY1,1,40
        ^CFA,16
        ^FO${marginLeft},20^FDRp ${numberFormatter(parseInt(product.info.sellPrice, 0))}^FS
        ^FO${marginLeft},40^FD${product.info.productCode}^FS
        ^FO${marginLeft},60^A,20,20^BC^FD${product.info.barCode01}^FS
        `
      }
    }
    finalString += '^XZ'
    writeToSelectedPrinter(finalString)
  }
}

export const convertExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: null,
          range: 5
        })

        const productCode = rows
          .map(row => `${row[1]}`)
          .filter(code => code.trim() !== '')

        const result = productCode

        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = error => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export const processPriceTagExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]

        // Convert to array of product codes (ignore header row)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: ['productCode'],
          range: 1 // Skip header row
        })

        // Format for API
        const result = {
          storeId: lstorage.getCurrentUserStore().id,
          productCode: jsonData
            .map(row => row.productCode)
            .filter(code => code && code.toString().trim() !== '')
        }

        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = error => reject(error)
    reader.readAsArrayBuffer(file)
  })
}
