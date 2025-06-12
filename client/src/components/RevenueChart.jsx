import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const RevenueChart = ({ data = [] }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true)
    }, 50)
    return () => clearTimeout(timeout)
  }, [])

  const fallbackData = [
    { day: 'Mon', total: 0 },
    { day: 'Tue', total: 0 },
    { day: 'Wed', total: 0 },
    { day: 'Thu', total: 0 },
    { day: 'Fri', total: 0 },
    { day: 'Sat', total: 0 },
    { day: 'Sun', total: 0 },
  ]

  const chartData = data.length ? data : fallbackData

  return (
    <div style={container}>
      {!visible ? (
        <div style={loaderContainer}>
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(v) => `Ksh ${v.toLocaleString()}`} />
            <Tooltip
              formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend />
            <Bar
              dataKey="total"
              fill="#2eb85c"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// 💡 Styles
const container = {
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  padding: '1rem',
  minHeight: '300px',
}

const loaderContainer = {
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default RevenueChart
