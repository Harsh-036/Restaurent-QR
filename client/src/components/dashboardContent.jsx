import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, Users, ShoppingCart, ChefHat, DollarSign, Clock, Star, Utensils } from "lucide-react";
import { getDashboardData } from "../lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  Filler
);

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="text-white text-center">Failed to load data</div>;
  }

  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue ₹",
        data: dashboardData.weeklyRevenue,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "#6366f1",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const orderTypeData = {
    labels: ["Dine-In", "Online Orders", "Takeaway"],
    datasets: [
      {
        data: dashboardData.orderDistribution,
        backgroundColor: [
          "#22c55e",
          "#6366f1",
          "#d97706"
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  const topItemsData = {
    labels: dashboardData.topSellingItems.labels,
    datasets: [
      {
        label: "Orders",
        data: dashboardData.topSellingItems.data,
        backgroundColor: [
          "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16"
        ],
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: [
          "#16a34a", "#15803d", "#166534", "#14532d", "#052e16", "#022c22"
        ],
      },
    ],
  };

  const menuCategoriesData = {
    labels: dashboardData.menuCategories.labels,
    datasets: [
      {
        data: dashboardData.menuCategories.data,
        backgroundColor: [
          "#6366f1", "#22c55e", "#ffffff", "#ef4444", "#8b5cf6"
        ],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: "#ffffff",
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y || context.parsed}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Restaurant Dashboard
            </h1>
            <p className="text-white/70 mt-2 text-base md:text-lg">Monitor your restaurant's performance in real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full p-2 md:p-3">
              <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Revenue", value: `₹${dashboardData.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-green-500 to-emerald-600", change: `${dashboardData.revenueChange >= 0 ? '+' : ''}${dashboardData.revenueChange}%` },
          { title: "Total Orders", value: dashboardData.totalOrders.toString(), icon: ShoppingCart, color: "from-blue-500 to-indigo-600", change: `${dashboardData.ordersChange >= 0 ? '+' : ''}${dashboardData.ordersChange}%` },
          { title: "Active Tables", value: dashboardData.activeTables, icon: Users, color: "from-purple-500 to-pink-600", change: `${dashboardData.activeTablesChange}%` },
          { title: "Avg. Rating", value: dashboardData.avgRating.toString(), icon: Star, color: "from-yellow-500 to-orange-600", change: `${dashboardData.ratingChange >= 0 ? '+' : ''}${dashboardData.ratingChange}` },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`bg-gradient-to-r ${card.color} rounded-2xl p-2 md:p-3 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-green-400 text-xs md:text-sm font-semibold">{card.change}</span>
            </div>
            <p className="text-xs md:text-sm text-white/70 mb-1">{card.title}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Weekly Revenue Trend</h2>
            <p className="text-white/70 text-sm md:text-base">Revenue performance over the past week</p>
          </div>
          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
        </div>
        <div className="h-48 sm:h-64 lg:h-80">
          <Line data={revenueData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Order Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Order Distribution</h2>
              <p className="text-white/70 text-sm md:text-base">Breakdown by order type</p>
            </div>
            <Utensils className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
          <div className="h-48 sm:h-56 lg:h-64">
            <Doughnut data={orderTypeData} options={chartOptions} />
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Top Selling Items</h2>
              <p className="text-white/70 text-sm md:text-base">Most popular menu items this week</p>
            </div>
            <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
          </div>
          <div className="h-48 sm:h-56 lg:h-64">
            <Bar data={topItemsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Menu Categories Distribution</h2>
            <p className="text-white/70 text-sm md:text-base">Overview of your menu composition</p>
          </div>
          <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
        </div>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="h-48 sm:h-64 lg:h-80 w-full lg:w-1/2">
            <Doughnut data={menuCategoriesData} options={chartOptions} />
          </div>
          <div className="lg:w-1/2 lg:pl-8 mt-4 md:mt-8 lg:mt-0">
            <div className="space-y-4">
              {menuCategoriesData.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between p-2 md:p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: menuCategoriesData.datasets[0].backgroundColor[index] }}
                    ></div>
                    <span className="text-white font-medium text-sm md:text-base">{label}</span>
                  </div>
                  <span className="text-white/70 text-sm md:text-base">{menuCategoriesData.datasets[0].data[index]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Add New Item", icon: ChefHat, color: "bg-blue-500 hover:bg-blue-600" },
            { label: "View Orders", icon: ShoppingCart, color: "bg-green-500 hover:bg-green-600" },
            { label: "Manage Tables", icon: Users, color: "bg-purple-500 hover:bg-purple-600" },
            { label: "Generate Report", icon: TrendingUp, color: "bg-orange-500 hover:bg-orange-600" },
          ].map((action, i) => (
            <button
              key={i}
              className={`${action.color} text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2`}
            >
              <action.icon className="w-6 h-6" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
