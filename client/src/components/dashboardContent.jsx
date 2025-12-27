import React from "react";
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
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, Users, ShoppingCart, ChefHat, DollarSign, Clock, Star, Utensils } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement
);

const DashboardContent = () => {
  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue ₹",
        data: [4200, 3800, 5200, 6100, 7500, 8900, 6400],
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
        data: [45, 35, 20],
        backgroundColor: [
          "linear-gradient(135deg, #22c55e, #16a34a)",
          "linear-gradient(135deg, #6366f1, #4f46e5)",
          "linear-gradient(135deg, #ffffff, #d97706)"
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  const topItemsData = {
    labels: ["Paneer Tikka", "Dal Makhani", "Garlic Naan", "Mango Lassi", "Butter Chicken", "Chole Bhature"],
    datasets: [
      {
        label: "Orders",
        data: [120, 98, 160, 75, 140, 110],
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
    labels: ["Main Course", "Appetizers", "Beverages", "Desserts", "Breads"],
    datasets: [
      {
        data: [35, 20, 15, 10, 20],
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
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Restaurant Dashboard
            </h1>
            <p className="text-white/70 mt-2 text-lg">Monitor your restaurant's performance in real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full p-3">
              <ChefHat className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: "₹1,24,500", icon: DollarSign, color: "from-green-500 to-emerald-600", change: "+12.5%" },
          { title: "Total Orders", value: "1,284", icon: ShoppingCart, color: "from-blue-500 to-indigo-600", change: "+8.2%" },
          { title: "Active Tables", value: "18/24", icon: Users, color: "from-purple-500 to-pink-600", change: "75%" },
          { title: "Avg. Rating", value: "4.8", icon: Star, color: "from-yellow-500 to-orange-600", change: "+0.3" },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-r ${card.color} rounded-2xl p-3 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">{card.change}</span>
            </div>
            <p className="text-sm text-white/70 mb-1">{card.title}</p>
            <h3 className="text-3xl font-bold text-white">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Weekly Revenue Trend</h2>
            <p className="text-white/70">Revenue performance over the past week</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
        <div className="h-80">
          <Line data={revenueData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Order Distribution</h2>
              <p className="text-white/70">Breakdown by order type</p>
            </div>
            <Utensils className="w-8 h-8 text-blue-400" />
          </div>
          <div className="h-64">
            <Doughnut data={orderTypeData} options={chartOptions} />
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Top Selling Items</h2>
              <p className="text-white/70">Most popular menu items this week</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="h-64">
            <Bar data={topItemsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Menu Categories Distribution</h2>
            <p className="text-white/70">Overview of your menu composition</p>
          </div>
          <ChefHat className="w-8 h-8 text-purple-400" />
        </div>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="h-80 w-full lg:w-1/2">
            <Doughnut data={menuCategoriesData} options={chartOptions} />
          </div>
          <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
            <div className="space-y-4">
              {menuCategoriesData.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: menuCategoriesData.datasets[0].backgroundColor[index] }}
                    ></div>
                    <span className="text-white font-medium">{label}</span>
                  </div>
                  <span className="text-white/70">{menuCategoriesData.datasets[0].data[index]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Add New Item", icon: ChefHat, color: "bg-blue-500 hover:bg-blue-600" },
            { label: "View Orders", icon: ShoppingCart, color: "bg-green-500 hover:bg-green-600" },
            { label: "Manage Tables", icon: Users, color: "bg-purple-500 hover:bg-purple-600" },
            { label: "Generate Report", icon: TrendingUp, color: "bg-orange-500 hover:bg-orange-600" },
          ].map((action, i) => (
            <button
              key={i}
              className={`${action.color} text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2`}
            >
              <action.icon className="w-5 h-5" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
