import { Button, Space } from 'antd';

const Links = () => {

  return (
    <Space size={'small'} direction={'vertical'} align={'center'}>
      <Button type={'link'} href={'https://s0fien.com/files/data_very_light.csv'}>Very light .csv file - ~26mb</Button>
      <Button type={'link'} href={'https://s0fien.com/files/data_wrong_headers.csv'}>Not working - .csv file with wrong headers - ~1kb</Button>
      <Button type={'link'} href={'https://s0fien.com/files/data.csv'}>Sample .csv file - ~322mb</Button>
      <Button type={'link'}  href={'https://s0fien.com/files/data_senior.csv'}>Very large sample .csv file - ~1.3gb</Button>
    </Space>
  )
}

export default Links