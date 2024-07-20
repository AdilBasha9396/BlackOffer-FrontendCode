import React, { useEffect, useState } from 'react';
import { getData } from '../api';
import { Bar } from 'react-chartjs-2';
import { Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import Filter from './Filter';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
        setFilteredData(result);
        const uniqueOptions = {};
        result.forEach(item => {
          Object.keys(filters).forEach(filter => {
            if (!uniqueOptions[filter]) uniqueOptions[filter] = new Set();
            uniqueOptions[filter].add(item[filter]);
          });
        });
        setOptions(Object.keys(uniqueOptions).reduce((acc, filter) => {
          acc[filter] = Array.from(uniqueOptions[filter]);
          return acc;
        }, {}));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    let filtered = data;
    Object.keys(filters).forEach(filter => {
      if (filters[filter]) {
        filtered = filtered.filter(item => item[filter] === filters[filter]);
      }
    });
    setFilteredData(filtered);
  }, [filters, data]);

  const chartData = {
    labels: filteredData.map(item => item.city),
    datasets: [
      {
        label: 'Intensity',
        data: filteredData.map(item => item.intensity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Likelihood',
        data: filteredData.map(item => item.likelihood),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Relevance',
        data: filteredData.map(item => item.relevance),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  if (loading) {
    return (
      <Container className="dashboard-container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="dashboard-container">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="dashboard-container">
      <Typography variant="h4" className="dashboard-title">Data Visualization Dashboard</Typography>
      <Grid container spacing={3} className="filters-container">
        {Object.keys(filters).map(filter => (
          <Grid item xs={12} md={3} key={filter}>
            <Filter name={filter} value={filters[filter]} options={options[filter] || []} onChange={handleFilterChange} />
          </Grid>
        ))}
      </Grid>
      <div className="chart-container">
        <Bar data={chartData} />
      </div>
    </Container>
  );
};

export default Dashboard;
