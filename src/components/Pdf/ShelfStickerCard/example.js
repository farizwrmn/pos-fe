// playground requires you to assign document definition to a variable called dd

const NUMBER_OF_COLUMN = 3
const PRODUCT_NAME_SIZE_IN_POINT = 8
const PRICE_SIZE_IN_POINT = 28
const PRODUCT_NAME_SIZE = PRODUCT_NAME_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const PRICE_SIZE = PRICE_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const NUMBER_OF_PRODUCT_NAME = 28
const WIDTH_TABLE_IN_CENTI = 8
const HEIGHT_TABLE_IN_CENTI = 5
const WIDTH_TABLE = (WIDTH_TABLE_IN_CENTI / 2.54) * 72
const HEIGHT_TABLE = (HEIGHT_TABLE_IN_CENTI / 2.54) * 72
const WIDTH_LOGO_IMAGE_IN_CENTI = 2
const HEIGHT_LOGO_IMAGE_IN_CENTI = 1.2
const WIDTH_IMAGE_IN_CENTI = 2
const HEIGHT_IMAGE_IN_CENTI = 2
const WEIGHT_LOGO_IMAGE = (WIDTH_LOGO_IMAGE_IN_CENTI / 2.54) * 72
const HEIGHT_LOGO_IMAGE = (HEIGHT_LOGO_IMAGE_IN_CENTI / 2.54) * 72
const WIDTH_IMAGE = (WIDTH_IMAGE_IN_CENTI / 2.54) * 72
const HEIGHT_IMAGE = (HEIGHT_IMAGE_IN_CENTI / 2.54) * 72

var dd = {
  name: 'Print',
  width: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
  height: HEIGHT_TABLE,
  pageSize: 'A4',
  pageOrientation: 'landscape',
  pageMargins: [17, 30, 17, 30],
  content: [
    {
      style: 'tableExample',
      layout: {
        hLineStyle () {
          return { dash: { length: 10, space: 4 } }
        },
        vLineStyle () {
          return { dash: { length: 4 } }
        }
      },
      table: {
        dontBreakRows: true,
        writable: true,
        widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
        body: [
          [
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            }
          ],
          [
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            }
          ],
          [
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                dontBreakRows: true,
                writable: true,
                widths: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
                body: [
                  [
                    { text: 'K3MART', fontSize: 30, color: '#ffffff', fillColor: '#212121', alignment: 'center' }
                  ],
                  [
                    { "text": "K3 HEALTHY DRINK CHRYSANTHEMUN", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": " ", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ],
                  [
                    { "text": "12.000", "width": "100%", "fillColor": "#f9d43b", "color": "#000000", "style": "sellPrice" }
                  ],
                  [
                    { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
                  ]

                ]
              }
            }
          ],

        ],
      }
    }
  ],
  styles: {
    info: {
      alignment: 'left',
      fontSize: PRODUCT_NAME_SIZE,
      bold: true
    },
    sellPrice: {
      bold: true,
      alignment: 'right',
      fontSize: PRICE_SIZE,
      width: '100%',
      margin: [0, 5]
    },
    productName1: {
      alignment: 'center',
      fontSize: PRODUCT_NAME_SIZE,
      margin: [0, 5, 0, 0]
    },
    productName2: {
      alignment: 'center',
      fontSize: PRODUCT_NAME_SIZE,
      margin: [0, 0, 0, 9]
    },
    others: {
      fontSize: PRICE_SIZE,
      margin: [5],
      alignment: 'left'
    },
    productCode: {
      fontSize: PRODUCT_NAME_SIZE,
      margin: [0, 0],
      alignment: 'left'
    }
  }
}