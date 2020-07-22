import trademarks from './controls_trademarks.json'
import bohumin from './bohumin-theatre.json'
import testDataset from './test.json'

export const datasets = [
  {
    data: trademarks,
    leftDataset: 'controls',
    rightDataset: 'trademarks',
    label: 'Controls in the field of intellectual property rights + National trademarks'
  },
  {
    data: bohumin,
    leftDataset: 'bohumin',
    rightDataset: 'theatre',
    label: 'Cultural and sports events in Bohumín + The program of the Moravian-Silesian National Theater'
  },
  {
    leftDataset: 'test',
    rightDataset: 'test',
    label: 'Test + test',
    data: testDataset
  }
]
