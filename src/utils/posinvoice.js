import { lstorage } from 'utils'

export const rearrangeDirectPrinting = (pos, directPrinting) => {
  const headerPrint = [
    {
      alignment: 'two',
      style: 'subtitle',
      text: ' ',
      rightText: ''
    },
    {
      style: 'title',
      alignment: 'left',
      text: directPrinting.groupName || ''
    },
    {
      style: 'subtitle',
      alignment: 'left',
      text: pos.orderType || ''
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `No: ${pos.transNo}`,
      rightText: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `Date: ${pos.transDate} ${pos.transTime}`,
      rightText: ''
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: 'Item',
      rightText: ''
    }
  ]

  for (let key in directPrinting.detail) {
    const item = directPrinting.detail[key]
    headerPrint.push({
      alignment: 'line',
      text: ''
    })
    headerPrint.push({
      alignment: 'two',
      style: 'subtitle',
      text: `${item.productName}`,
      rightText: ''
    })
    headerPrint.push({
      alignment: 'two',
      style: 'subtitle',
      text: `Qty: ${item.qty.toLocaleString()}`,
      rightText: ''
    })
  }

  const footerPrint = [
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `Total: ${directPrinting.detail.reduce((prev, next) => prev + next.qty, 0)}`,
      rightText: ''
    },
    {
      style: 'title',
      alignment: 'center',
      text: pos.orderShortNumber || ''
    },
    {
      style: 'title',
      alignment: 'center',
      text: pos.description || '' // posDescription
    }
  ]
  const resultData = headerPrint.concat(footerPrint)
  return resultData
}

export const rearrangeDirectPrintingQris = (pos, directPrinting) => {
  const storeInfoData = lstorage.getCurrentUserStoreDetail()
  const headerPrint = [
    {
      alignment: 'two',
      style: 'subtitle',
      text: ' ',
      rightText: ''
    },
    {
      style: 'title',
      alignment: 'left',
      text: directPrinting.groupName || ''
    },
    {
      style: 'subtitle',
      alignment: 'left',
      text: storeInfoData && storeInfoData.label ? storeInfoData.label.replace('* ', '') : ''
    },
    {
      style: 'subtitle',
      alignment: 'left',
      text: storeInfoData && storeInfoData.address01 ? storeInfoData.address01 : ''
    },
    {
      alignment: 'line',
      text: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `No: ${pos.transNo}`,
      rightText: ''
    },
    {
      alignment: 'two',
      style: 'subtitle',
      text: `Date: ${pos.transDate} ${pos.transTime}`,
      rightText: ''
    }
  ]

  for (let key in directPrinting.detail) {
    const item = directPrinting.detail[key]
    headerPrint.push({
      alignment: 'line',
      text: ''
    })
    headerPrint.push({
      alignment: 'two',
      style: 'subtitle',
      text: `Amount: ${item.qty.toLocaleString()}`,
      rightText: ''
    })
    headerPrint.push({
      alignment: 'line',
      text: ''
    })
  }

  headerPrint.push({
    alignment: 'left',
    style: 'subtitle',
    text: `Bank: ${directPrinting.platformTransactionId}`,
    rightText: ''
  })
  headerPrint.push({
    alignment: 'left',
    style: 'subtitle',
    text: `rrn: ${directPrinting.rrn}`,
    rightText: ''
  })
  headerPrint.push({
    alignment: 'left',
    style: 'subtitle',
    text: `Ref: ${directPrinting.merchantTradeNo}`,
    rightText: ''
  })
  headerPrint.push({
    alignment: 'left',
    style: 'subtitle',
    text: `Vendor ID: ${directPrinting.vendorTransactionId}`,
    rightText: ''
  })
  headerPrint.push({
    alignment: 'left',
    style: 'subtitle',
    text: `STATUS: ${directPrinting.validPayment ? 'VALID' : 'BELUM VALID'}`,
    rightText: ''
  })
  headerPrint.push({
    alignment: 'line',
    text: ''
  })
  headerPrint.push({
    alignment: 'left',
    style: 'bold',
    text: '*NB: Struk ini disimpan oleh kasir,',
    rightText: ''
  })
  headerPrint.push({
    alignment: 'left',
    style: 'bold',
    text: 'dan diserah terima dengan finance',
    rightText: ''
  })
  headerPrint.push({
    alignment: 'line',
    text: ''
  })

  return headerPrint
}
