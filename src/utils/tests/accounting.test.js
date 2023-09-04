import { generateListBalanceSheetChildType } from '../accounting'

const listBalanceSheet = [
  {
    bodyTitle: 'ASET',
    totalTitle: 'Jumlah Aset',
    level: 0,
    value: -44640306117.725,
    child: [
      {
        bodyTitle: 'ASET LANCAR',
        level: 1,
        totalTitle: 'Jumlah Aset Lancar',
        value: -30232183814.055,
        child: [
          {
            type: 'BANK',
            level: 2,
            bodyTitle: 'Kas dan Setara Kas',
            totalTitle: 'Jumlah Kas dan Setara Kas',
            value: 995397119.62
          },
          {
            type: 'AREC',
            level: 2,
            bodyTitle: 'Piutang Usaha',
            totalTitle: 'Jumlah Piutang Usaha',
            value: -21875314293.02
          },
          {
            type: 'INTR',
            level: 2,
            bodyTitle: 'Persediaan',
            totalTitle: 'Jumlah Persediaan',
            value: -6251334252.3377
          },
          {
            type: 'OCAS',
            level: 2,
            bodyTitle: 'Aset Lancar Lainnya',
            totalTitle: 'Jumlah Aset Lancar Lainnya',
            value: -3100932388.3173
          }
        ]
      },
      {
        bodyTitle: 'ASET TIDAK LANCAR',
        level: 1,
        totalTitle: 'Jumlah Aset Tidak Lancar',
        value: -14408122303.67,
        child: [
          {
            type: 'FASS',
            level: 2,
            bodyTitle: 'Nilai Histori',
            totalTitle: 'Jumlah Nilai Histori',
            value: -14431023194.4
          },
          {
            type: 'DEPR',
            level: 2,
            bodyTitle: 'Akumulasi Penyusutan',
            totalTitle: 'Jumlah Akumulasi Penyusutan',
            value: 22900890.73
          },
          {
            type: 'OASS',
            level: 2,
            bodyTitle: 'Aset Lainnya',
            totalTitle: 'Jumlah Aset Lainnya',
            value: 0
          }
        ]
      }
    ]
  },
  {
    bodyTitle: 'KEWAJIBAN DAN EKUITAS',
    totalTitle: 'Jumlah Kewajiban dan Ekuitas',
    level: 0,
    value: 43445019281.774994,
    child: [
      {
        bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
        level: 1,
        totalTitle: 'Jumlah Kewajiban Jangka Pendek',
        value: 43195786628.41499,
        child: [
          {
            type: 'APAY',
            level: 2,
            bodyTitle: 'Hutang Usaha',
            totalTitle: 'Jumlah Hutang Usaha',
            value: 452267553
          },
          {
            type: 'OCLY',
            level: 2,
            bodyTitle: 'Kewajiban Jangka Pendek Lainnya',
            totalTitle: 'Jumlah Kewajiban Jangka Pendek Lainnya',
            value: 21860835831.62
          }
        ]
      },
      {
        type: 'LTLY',
        level: 1,
        bodyTitle: 'Kewajiban Jangka Panjang',
        totalTitle: 'Jumlah Kewajiban Jangka Panjang',
        value: 20882683243.795
      },
      {
        type: 'EQTY',
        level: 1,
        bodyTitle: 'Ekuitas',
        totalTitle: 'Jumlah Ekuitas',
        value: 249232653.36
      },
      {
        type: 'PRFT',
        level: 1,
        bodyTitle: 'Laba Ditahan',
        totalTitle: 'Jumlah Laba',
        value: 1195286835.77
      }
    ]
  }
]

it('Should render BANK as child of listBalanceSheet', () => {
  const listChild = [
    {
      id: 1,
      accountId: 1,
      accountCode: '1000',
      accountName: 'KAS & BANK',
      accountParentId: null,
      accountType: 'BANK',
      balance: -40000000
    }
  ]
  expect(generateListBalanceSheetChildType('BANK', listBalanceSheet, listChild)).toEqual(
    [
      {
        bodyTitle: 'ASET',
        totalTitle: 'Jumlah Aset',
        level: 0,
        value: -44640306117.725,
        child: [
          {
            bodyTitle: 'ASET LANCAR',
            level: 1,
            totalTitle: 'Jumlah Aset Lancar',
            value: -30232183814.055,
            child: [
              {
                type: 'BANK',
                level: 2,
                bodyTitle: 'Kas dan Setara Kas',
                totalTitle: 'Jumlah Kas dan Setara Kas',
                value: 995397119.62,
                child: listChild
              },
              {
                type: 'AREC',
                level: 2,
                bodyTitle: 'Piutang Usaha',
                totalTitle: 'Jumlah Piutang Usaha',
                value: -21875314293.02
              },
              {
                type: 'INTR',
                level: 2,
                bodyTitle: 'Persediaan',
                totalTitle: 'Jumlah Persediaan',
                value: -6251334252.3377
              },
              {
                type: 'OCAS',
                level: 2,
                bodyTitle: 'Aset Lancar Lainnya',
                totalTitle: 'Jumlah Aset Lancar Lainnya',
                value: -3100932388.3173
              }
            ]
          },
          {
            bodyTitle: 'ASET TIDAK LANCAR',
            level: 1,
            totalTitle: 'Jumlah Aset Tidak Lancar',
            value: -14408122303.67,
            child: [
              {
                type: 'FASS',
                level: 2,
                bodyTitle: 'Nilai Histori',
                totalTitle: 'Jumlah Nilai Histori',
                value: -14431023194.4
              },
              {
                type: 'DEPR',
                level: 2,
                bodyTitle: 'Akumulasi Penyusutan',
                totalTitle: 'Jumlah Akumulasi Penyusutan',
                value: 22900890.73
              },
              {
                type: 'OASS',
                level: 2,
                bodyTitle: 'Aset Lainnya',
                totalTitle: 'Jumlah Aset Lainnya',
                value: 0
              }
            ]
          }
        ]
      },
      {
        bodyTitle: 'KEWAJIBAN DAN EKUITAS',
        totalTitle: 'Jumlah Kewajiban dan Ekuitas',
        level: 0,
        value: 43445019281.774994,
        child: [
          {
            bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
            level: 1,
            totalTitle: 'Jumlah Kewajiban Jangka Pendek',
            value: 43195786628.41499,
            child: [
              {
                type: 'APAY',
                level: 2,
                bodyTitle: 'Hutang Usaha',
                totalTitle: 'Jumlah Hutang Usaha',
                value: 452267553
              },
              {
                type: 'OCLY',
                level: 2,
                bodyTitle: 'Kewajiban Jangka Pendek Lainnya',
                totalTitle: 'Jumlah Kewajiban Jangka Pendek Lainnya',
                value: 21860835831.62
              }
            ]
          },
          {
            type: 'LTLY',
            level: 1,
            bodyTitle: 'Kewajiban Jangka Panjang',
            totalTitle: 'Jumlah Kewajiban Jangka Panjang',
            value: 20882683243.795
          },
          {
            type: 'EQTY',
            level: 1,
            bodyTitle: 'Ekuitas',
            totalTitle: 'Jumlah Ekuitas',
            value: 249232653.36
          },
          {
            type: 'PRFT',
            level: 1,
            bodyTitle: 'Laba Ditahan',
            totalTitle: 'Jumlah Laba',
            value: 1195286835.77
          }
        ]
      }
    ]
  )
})
