import {useState} from 'react'
import {Button, Spin, Typography} from 'antd'
import axios from 'axios'

const {Text} = Typography

function TestButton() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('http://localhost:8000/test')
            setMessage(res.data.message)
        } catch (err) {
            setMessage('Ошибка при получении данных')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <Button type="primary" onClick={fetchData} loading={loading}>
                Получить сообщение
            </Button>
            <div className="mt-4">
                {loading ? <Spin/> : <Text>{message}</Text>}
            </div>
        </div>
    )
}

export default TestButton