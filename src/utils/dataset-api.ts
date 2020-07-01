import axios from 'axios'

export const datasets = [
  {
    leftDataset: 'bohumin',
    rightDataset: 'theatre',
    label: 'Cultural and sports events in Bohumín + The program of the Moravian-Silesian National Theater'
  },
  {
    leftDataset: 'controls',
    rightDataset: 'trademarks',
    label: 'Controls in the field of intellectual property rights + National trademarks'
  }
]

export function getDataset (label: string) {
  const left = datasets.filter(x => x.label === label)[0].leftDataset
  const right = datasets.filter(x => x.label === label)[0].rightDataset
  const url = 'http://localhost:8081/datasets?left=' + left + '&right=' + right
  return axios.get(url).then((response) => response.data)
}
