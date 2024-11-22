import React, { useEffect, useState } from 'react';
import MarketTab from './MarketTab'; // Importing the new Market component
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Registering the necessary components for Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const MarketCard = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("market");

  useEffect(() => {
    const originalBodyStyle = document.body.style.cssText;

    // Change the background and background image of the body
    document.body.style.backgroundColor = '#6b94b2'; // Change background color to white
    document.body.style.backgroundImage = ''; // Remove background image if necessary
    document.body.style.backgroundSize = 'cover'; // Ensure the image covers the entire screen
    // Load the data from the collection initially
    fetch('https://www.lumitown.somee.com/PresentationCollection')
      .then((response) => response.json())
      .then((data) => setData(data));

    return () => {
      document.body.style.cssText = originalBodyStyle;
    };
  }, []);

  if (!data) return <div>Loading...</div>;

  // Extract data for the charts
  const { mkpValueCharts, collectionMetadata } = data;

  // Function to format the "start" data into readable dates
  const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleDateString();

  // Preparing the data for the charts
  const createChartData = (dataPoints) => {
    const labels = dataPoints.map((point) => formatDate(point.start));
    const values = dataPoints.map((point) => point.value);
    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Average Collection Price',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false, // Hide the date on the X-axis
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={styles.cardContainer}>
      <img src={collectionMetadata.banner} alt="Banner" style={styles.banner} />
      <div style={styles.presentationCard}>
        <div style={styles.cardHeader}>
          <img src={collectionMetadata.avatar} alt="Avatar" style={styles.avatar} />
          <h2>{collectionMetadata.collectionName}</h2>
          <p>{collectionMetadata.studioName}</p>
          <div style={styles.socialLinks}>
            <a href={collectionMetadata.websiteUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
              <img src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732080887/Web_mcnebn.webp" alt="Website" style={styles.socialIcon} />
            </a>
            <a href={collectionMetadata.discordUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
              <img src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732080866/Discord_azz0eq.webp" alt="Discord" style={styles.socialIcon} />
            </a>
            <a href={collectionMetadata.twitterUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
              <img src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732080915/X_wu8ft6.webp" alt="Twitter" style={styles.socialIcon} />
            </a>
            <a href='https://marketplace.skymavis.com/collections/lumiterra' target="_blank" rel="noopener noreferrer" style={styles.link}>
              <img src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1732081431/Skymavis_lmqnu6.webp" alt="Mavis" style={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={activeTab === 'market' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('market')}
        >
          Market
        </button>
        <button
          style={activeTab === 'analytics' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'market' && <MarketTab />}

        {activeTab === 'analytics' && (
          <div style={styles.analyticsContent}>
            <h3>Analytics Charts</h3>
            <div style={styles.chartGrid}>
              <div style={styles.chartCard}>
                <h4>Average Price (Last 30 Days)</h4>
                <Line data={createChartData(mkpValueCharts.last30dAveragePrice)} options={chartOptions} />
              </div>

              <div style={styles.chartCard}>
                <h4>Minimum Price (Last 30 Days)</h4>
                <Line data={createChartData(mkpValueCharts.last30dFloorPrice)} options={chartOptions} />
              </div>

              <div style={styles.chartCard}>
                <h4>Market Volume (Last 30 Days)</h4>
                <Line data={createChartData(mkpValueCharts.last30dMkpVolume)} options={chartOptions} />
              </div>

              <div style={styles.chartCard}>
                <h4>Sales (Last 30 Days)</h4>
                <Line data={createChartData(mkpValueCharts.last30dMkpSales)} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '8px',
    margin: '0 auto',
  },
  banner: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    marginBottom: '20px',
  },
  presentationCard: {
    textAlign: 'center',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
  },
  socialLinks: {
    marginTop: '10px',
  },
  link: {
    margin: '0 10px',
    color: '#007bff',
    textDecoration: 'none',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    borderBottom: '2px solid #ddd',
  },
  tab: {
    padding: '10px 20px',
    background: '#f4f4f4',
    border: '1px solid #ddd',
    borderBottom: 'none',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'background 0.3s',
  },
  activeTab: {
    padding: '10px 20px',
    background: '#007bff',
    color: '#fff',
    border: '1px solid #ddd',
    borderBottom: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  content: {
    marginTop: '20px',
  },
  analyticsContent: {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  chartGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
  },
  chartCard: {
    width: '30%', // Two charts per row
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
  },
  socialIcon: {
    width: '30px',  // Adjust size of icons
    height: '30px',
    transition: 'transform 0.3s ease', // Add a hover transition effect
  },
  socialIconHover: {
    transform: 'scale(1.2)', // Increase size on hover
  },
};

export default MarketCard;
