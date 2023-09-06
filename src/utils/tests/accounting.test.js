import { generateListBalanceSheetChildType } from '../accounting'

describe('Test third level', () => {
  it('Should render BANK as children of listBalanceSheet', () => {
    const listBalanceSheet = [
      {
        bodyTitle: 'ASET',
        totalTitle: 'Jumlah Aset',
        level: 0,
        value: -44640306117.725,
        children: [
          {
            bodyTitle: 'ASET LANCAR',
            level: 1,
            totalTitle: 'Jumlah Aset Lancar',
            value: -30232183814.055,
            children: [
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
            children: [
              {
                type: 'FASS',
                level: 2,
                bodyTitle: 'Aset Tetap',
                totalTitle: 'Jumlah Aset Tetap',
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
        children: [
          {
            bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
            level: 1,
            totalTitle: 'Jumlah Kewajiban Jangka Pendek',
            value: 43195786628.41499,
            children: [
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
    const listChild = [
      {
        id: 1,
        accountId: 1,
        accountCode: '1000',
        accountName: 'KAS & BANK',
        accountParentId: null,
        accountType: 'BANK',
        value: -40000000
      }
    ]
    expect(generateListBalanceSheetChildType('BANK', listBalanceSheet, listChild)).toEqual(
      [
        {
          bodyTitle: 'ASET',
          totalTitle: 'Jumlah Aset',
          level: 0,
          value: -44640306117.725,
          children: [
            {
              bodyTitle: 'ASET LANCAR',
              level: 1,
              totalTitle: 'Jumlah Aset Lancar',
              value: -30232183814.055,
              children: [
                {
                  type: 'BANK',
                  level: 2,
                  bodyTitle: 'Jumlah Kas dan Setara Kas',
                  totalTitle: 'Jumlah Kas dan Setara Kas',
                  value: 995397119.62,
                  children: listChild
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
              children: [
                {
                  type: 'FASS',
                  level: 2,
                  bodyTitle: 'Aset Tetap',
                  totalTitle: 'Jumlah Aset Tetap',
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
          children: [
            {
              bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
              level: 1,
              totalTitle: 'Jumlah Kewajiban Jangka Pendek',
              value: 43195786628.41499,
              children: [
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
})

describe('Test second level', () => {
  it('Should render EQTY as children of listBalanceSheet', () => {
    const listBalanceSheet = [
      {
        bodyTitle: 'ASET',
        totalTitle: 'Jumlah Aset',
        level: 0,
        value: -44640306117.725,
        children: [
          {
            bodyTitle: 'ASET LANCAR',
            level: 1,
            totalTitle: 'Jumlah Aset Lancar',
            value: -30232183814.055,
            children: [
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
            children: [
              {
                type: 'FASS',
                level: 2,
                bodyTitle: 'Aset Tetap',
                totalTitle: 'Jumlah Aset Tetap',
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
        children: [
          {
            bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
            level: 1,
            totalTitle: 'Jumlah Kewajiban Jangka Pendek',
            value: 43195786628.41499,
            children: [
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
    const listChild = [
      {
        accountCode: '01.400.001',
        accountId: 38,
        accountName: 'LABA DITAHAN DI TAHUN LALU',
        accountParentId: 35,
        accountType: 'EQTY',
        bodyTitle: '01.400.001-LABA DITAHAN DI TAHUN LALU',
        id: 38,
        key: '01.400.001',
        value: 0
      }
    ]
    const logEquity = generateListBalanceSheetChildType('EQTY', listBalanceSheet, listChild)
    expect(logEquity).toEqual(
      [
        {
          bodyTitle: 'ASET',
          totalTitle: 'Jumlah Aset',
          level: 0,
          value: -44640306117.725,
          children: [
            {
              bodyTitle: 'ASET LANCAR',
              level: 1,
              totalTitle: 'Jumlah Aset Lancar',
              value: -30232183814.055,
              children: [
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
              children: [
                {
                  type: 'FASS',
                  level: 2,
                  bodyTitle: 'Aset Tetap',
                  totalTitle: 'Jumlah Aset Tetap',
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
          children: [
            {
              bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
              level: 1,
              totalTitle: 'Jumlah Kewajiban Jangka Pendek',
              value: 43195786628.41499,
              children: [
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
              bodyTitle: 'Jumlah Ekuitas',
              totalTitle: 'Jumlah Ekuitas',
              value: 249232653.36,
              children: listChild
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
})

describe('Test Profit Loss', () => {
  it('Should render BANK as children of listBalanceSheet', () => {
    const listBalanceSheet = [
      {
        bodyTitle: 'Pendapatan',
        key: 'Pendapatan',
        type: 'REVE',
        totalTitle: 'Jumlah Pendapatan',
        level: 0,
        value: 1033504035,
        children: []
      },
      {
        bodyTitle: 'Beban Pokok Penjualan',
        key: 'Beban Pokok Penjualan',
        type: 'COGS',
        totalTitle: 'Jumlah Beban Pokok Penjualan',
        level: 0,
        value: -756897242.95,
        children: []
      },
      {
        bodyTitle: 'Laba Kotor',
        key: 'Laba Kotor',
        totalTitle: 'Jumlah Laba Kotor',
        level: 0,
        value: 276606792.04999995
      },
      {
        bodyTitle: 'Beban Operasional',
        key: 'Pendapatan Operasional',
        type: 'EXPS',
        totalTitle: 'Jumlah Beban Operasional',
        level: 0,
        value: -370090713.75,
        children: []
      },
      {
        bodyTitle: 'Pendapatan Operasional',
        key: 'Pendapatan Operasional',
        totalTitle: 'Jumlah Pendapatan Operasional',
        level: 0,
        value: -93483921.70000005
      },
      {
        bodyTitle: 'Pendapatan Non Operasional',
        key: 'Pendapatan Operasional',
        totalTitle: 'Jumlah Pendapatan Non Operasional',
        level: 0,
        type: 'OINC',
        value: 0,
        children: []
      },
      {
        bodyTitle: 'Beban Non Operasional',
        key: 'Beban Operasional',
        totalTitle: 'Jumlah Pendapatan dan Beban Non Operasional',
        level: 0,
        type: 'OEXP',
        value: -74100,
        children: []
      },
      {
        bodyTitle: 'Laba Kotor dan Pendapatan Non Operasional',
        key: 'Laba Kotor dan Pendapatan Non Operasional',
        totalTitle: 'Jumlah Laba Kotor dan Pendapatan Non Operasional',
        level: 0,
        value: -93558021.70000005
      }
    ]
    const listChild = [
      {
        id: 39,
        accountId: 39,
        key: '01.500.000',
        accountCode: '01.500.000',
        accountName: 'PENJUALAN',
        bodyTitle: '01.500.000-PENJUALAN',
        accountParentId: null,
        accountType: 'REVE',
        value: 0,
        children: [
          {
            id: 42,
            accountId: 42,
            key: '01.500.002',
            accountCode: '01.500.002',
            accountName: 'RETUR PENJUALAN',
            bodyTitle: '01.500.002-RETUR PENJUALAN',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 43,
            accountId: 43,
            key: '01.500.003',
            accountCode: '01.500.003',
            accountName: 'POTONGAN PENJUALAN',
            bodyTitle: '01.500.003-POTONGAN PENJUALAN',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 102,
            accountId: 102,
            key: '01.500.001',
            accountCode: '01.500.001',
            accountName: 'PENJUALAN',
            bodyTitle: '01.500.001-PENJUALAN',
            accountParentId: 39,
            accountType: 'REVE',
            value: 773636153
          },
          {
            id: 103,
            accountId: 103,
            key: '4000.06',
            accountCode: '4000.06',
            accountName: 'MUTASI BARANG',
            bodyTitle: '4000.06-MUTASI BARANG',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 189,
            accountId: 189,
            key: '4000.08',
            accountCode: '4000.08',
            accountName: 'PENDAPATAN SEWA CUBE ADAM MALIK',
            bodyTitle: '4000.08-PENDAPATAN SEWA CUBE ADAM MALIK',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 190,
            accountId: 190,
            key: '4000.09',
            accountCode: '4000.09',
            accountName: 'PENDAPATAN SEWA CUBE SUMATERA',
            bodyTitle: '4000.09-PENDAPATAN SEWA CUBE SUMATERA',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 191,
            accountId: 191,
            key: '4000.10',
            accountCode: '4000.10',
            accountName: 'PENDAPATAN SEWA CUBE CEMARA',
            bodyTitle: '4000.10-PENDAPATAN SEWA CUBE CEMARA',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 192,
            accountId: 192,
            key: '4000.11',
            accountCode: '4000.11',
            accountName: 'PENDAPATAN SEWA CUBE LIPPO',
            bodyTitle: '4000.11-PENDAPATAN SEWA CUBE LIPPO',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 193,
            accountId: 193,
            key: '4000.12',
            accountCode: '4000.12',
            accountName: 'PENDAPATAN SEWA SETIABUDI',
            bodyTitle: '4000.12-PENDAPATAN SEWA SETIABUDI',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 194,
            accountId: 194,
            key: '4000.13',
            accountCode: '4000.13',
            accountName: 'PENDAPATAN SEWA CUBE AYAHANDA',
            bodyTitle: '4000.13-PENDAPATAN SEWA CUBE AYAHANDA',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 195,
            accountId: 195,
            key: '4000.14',
            accountCode: '4000.14',
            accountName: 'PENDAPATAN SEWA CUBE FOCAL POINT',
            bodyTitle: '4000.14-PENDAPATAN SEWA CUBE FOCAL POINT',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 208,
            accountId: 208,
            key: '4000.15',
            accountCode: '4000.15',
            accountName: 'PENDAPATAN SEWA LAPAK',
            bodyTitle: '4000.15-PENDAPATAN SEWA LAPAK',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 219,
            accountId: 219,
            key: '4001',
            accountCode: '4001',
            accountName: 'PENJUALAN VOUCHER',
            bodyTitle: '4001-PENJUALAN VOUCHER',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 244,
            accountId: 244,
            key: '4000.16',
            accountCode: '4000.16',
            accountName: 'PENDAPATAN RAFRAKSI',
            bodyTitle: '4000.16-PENDAPATAN RAFRAKSI',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 257,
            accountId: 257,
            key: '4000.17',
            accountCode: '4000.17',
            accountName: 'INCENTIVE IQOS',
            bodyTitle: '4000.17-INCENTIVE IQOS',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 258,
            accountId: 258,
            key: '4000.18',
            accountCode: '4000.18',
            accountName: 'PENDAPATAN PROMOSI IKLAN ',
            bodyTitle: '4000.18-PENDAPATAN PROMOSI IKLAN ',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 260,
            accountId: 260,
            key: '4000.19',
            accountCode: '4000.19',
            accountName: 'PENDAPATAN SEWA CUBE MERDEKA',
            bodyTitle: '4000.19-PENDAPATAN SEWA CUBE MERDEKA',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 263,
            accountId: 263,
            key: '01.500.005',
            accountCode: '01.500.005',
            accountName: 'PENDAPATAN INSENTIF PENJUALAN',
            bodyTitle: '01.500.005-PENDAPATAN INSENTIF PENJUALAN',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 314,
            accountId: 314,
            key: '4000.21',
            accountCode: '4000.21',
            accountName: 'PENJUALAN CONSIGNMENT',
            bodyTitle: '4000.21-PENJUALAN CONSIGNMENT',
            accountParentId: 39,
            accountType: 'REVE',
            value: 108301782
          },
          {
            id: 317,
            accountId: 317,
            key: '4000.22',
            accountCode: '4000.22',
            accountName: 'PENDAPATAN SEWA CUBE PIK',
            bodyTitle: '4000.22-PENDAPATAN SEWA CUBE PIK',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 318,
            accountId: 318,
            key: '4000.23',
            accountCode: '4000.23',
            accountName: 'PENDAPATAN SEWA CUBE KEMANG',
            bodyTitle: '4000.23-PENDAPATAN SEWA CUBE KEMANG',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          },
          {
            id: 368,
            accountId: 368,
            key: '01.500.004',
            accountCode: '01.500.004',
            accountName: 'PENDAPATAN SEWA CUBE TOKO',
            bodyTitle: '01.500.004-PENDAPATAN SEWA CUBE TOKO',
            accountParentId: 39,
            accountType: 'REVE',
            value: 0
          }
        ]
      },
      {
        id: 44,
        accountId: 44,
        key: '410104',
        accountCode: '410104',
        accountName: 'SALES TERM DISCOUNT IDR',
        bodyTitle: '410104-SALES TERM DISCOUNT IDR',
        accountParentId: null,
        accountType: 'REVE',
        value: 0
      },
      {
        id: 220,
        accountId: 220,
        key: '4001.01',
        accountCode: '4001.01',
        accountName: 'PENJUALAN DITERIMA DI MUKA (VOUCHER)',
        bodyTitle: '4001.01-PENJUALAN DITERIMA DI MUKA (VOUCHER)',
        accountParentId: 217,
        accountType: 'REVE',
        value: 151566100
      }
    ]
    expect(generateListBalanceSheetChildType('REVE', listBalanceSheet, listChild)).toEqual(
      [
        {
          bodyTitle: 'Jumlah Pendapatan',
          key: 'Pendapatan',
          type: 'REVE',
          totalTitle: 'Jumlah Pendapatan',
          level: 0,
          value: 1033504035,
          children: listChild
        },
        {
          bodyTitle: 'Beban Pokok Penjualan',
          key: 'Beban Pokok Penjualan',
          type: 'COGS',
          totalTitle: 'Jumlah Beban Pokok Penjualan',
          level: 0,
          value: -756897242.95,
          children: []
        },
        {
          bodyTitle: 'Laba Kotor',
          key: 'Laba Kotor',
          totalTitle: 'Jumlah Laba Kotor',
          level: 0,
          value: 276606792.04999995
        },
        {
          bodyTitle: 'Beban Operasional',
          key: 'Pendapatan Operasional',
          type: 'EXPS',
          totalTitle: 'Jumlah Beban Operasional',
          level: 0,
          value: -370090713.75,
          children: []
        },
        {
          bodyTitle: 'Pendapatan Operasional',
          key: 'Pendapatan Operasional',
          totalTitle: 'Jumlah Pendapatan Operasional',
          level: 0,
          value: -93483921.70000005
        },
        {
          bodyTitle: 'Pendapatan Non Operasional',
          key: 'Pendapatan Operasional',
          totalTitle: 'Jumlah Pendapatan Non Operasional',
          level: 0,
          type: 'OINC',
          value: 0,
          children: []
        },
        {
          bodyTitle: 'Beban Non Operasional',
          key: 'Beban Operasional',
          totalTitle: 'Jumlah Pendapatan dan Beban Non Operasional',
          level: 0,
          type: 'OEXP',
          value: -74100,
          children: []
        },
        {
          bodyTitle: 'Laba Kotor dan Pendapatan Non Operasional',
          key: 'Laba Kotor dan Pendapatan Non Operasional',
          totalTitle: 'Jumlah Laba Kotor dan Pendapatan Non Operasional',
          level: 0,
          value: -93558021.70000005
        }
      ]
    )
  })
})
