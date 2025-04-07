import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext";

function DashboardOverview() {
  const [stats, setStats] = useState({
    pending: 0,
    completedToday: 0,
    urgentRequests: 0,
    priorityRooms: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch rooms data with authorization
        const roomsRes = await axios.get('http://localhost:8000/housekeeping.php', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Fetch urgent requests with authorization
        const requestsRes = await axios.get('http://localhost:8000/request.php', {
          params: { status: 'urgent' },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const rooms = roomsRes.data;
        const requests = requestsRes.data;
        
        // Calculate statistics
        const pending = rooms.filter(r => r.cleaning_status === 'Pending').length;
        const completedToday = rooms.filter(r => (
          r.cleaning_status === 'Completed' && 
          new Date(r.last_updated).toDateString() === new Date().toDateString()
        )).length;
        
        setStats({
          pending,
          completedToday,
          urgentRequests: requests.length,
          priorityRooms: rooms
            .filter(r => r.cleaning_status === 'Pending')
            .sort((a, b) => new Date(a.last_updated) - new Date(b.last_updated))
            .slice(0, 5)
        });
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Housekeeping Overview</h1>
      
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Rooms to Clean"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Completed Today"
              value={stats.completedToday}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Urgent Requests"
              value={stats.urgentRequests}
              prefix={<WarningOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Today's Priority Rooms" 
        loading={loading}
        className="mt-4"
      >
        {stats.priorityRooms.length > 0 ? (
          <ul className="priority-rooms-list">
            {stats.priorityRooms.map(room => (
              <li key={room.id} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between">
                  <span className="font-medium">Room {room.room_number}</span>
                  <span className="text-gray-500">
                    Floor {room.floor} • {room.type}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(room.last_updated).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No priority rooms to display
          </div>
        )}
      </Card>
    </div>
  );
}

export default DashboardOverview;