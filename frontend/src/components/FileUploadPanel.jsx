import { useState } from 'react'
import { Upload, Button, Spin, Typography, Divider } from 'antd'
import { UploadOutlined, CheckOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Text, Title } = Typography

function FileUploadPanel() {
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const [groupedData, setGroupedData] = useState(null)

    const handleUpload = async () => {
        const formData = new FormData()
        fileList.forEach(file => {
            formData.append('files', file.originFileObj)
        })

        setLoading(true)
        try {
            const res = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setGroupedData(res.data)
        } catch (err) {
            console.error('Ошибка загрузки:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="file-upload-panel">
            <Title level={4}>Загрузка логов</Title>

            <Upload
                multiple
                beforeUpload={() => false}
                onChange={({ fileList }) => setFileList(fileList)}
                fileList={fileList}
            >
                <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
            </Upload>

            <Divider />

            <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={loading}
            >
                Get result
            </Button>

            <Divider />

            {loading && <Spin tip="Обработка файлов..." />}

            {groupedData && (
                <div className="result">
                    <Title level={5}>Результат:</Title>
                    <pre>{JSON.stringify(groupedData, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}

export default FileUploadPanel
