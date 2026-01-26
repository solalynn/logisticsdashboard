import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const SimpleDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('total');

  const data = [
    { route: 'BANGBUATHONG', util6W: 87, util10W: 83, util18W: 98, utilTotal: 97 },
    { route: 'SAMKOKE', util6W: 79, util10W: 74, util18W: 96, utilTotal: 94 },
    { route: 'KHONKAEN', util6W: 96, util10W: 79, util18W: 99, utilTotal: 98 },
    { route: 'SURATTHANI', util6W: 100, util10W: 74, util18W: 98, utilTotal: 97 },
    { route: 'LAMPHUN', util6W: 95, util10W: 80, util18W: 96, utilTotal: 93 },
    { route: 'WANGNOI', util6W: 73, util10W: 69, util18W: 81, utilTotal: 75 }
  ];

  const periodLabels = {
    'total': 'Overall Average',
    '6W': '6 Week Period',
    '10W': '10 Week Period',
    '18W': '18 Week Period'
  };

  const getDisplayData = () => {
    return data.map(d => ({
      route: d.route,
      value: selectedPeriod === 'total' ? d.utilTotal : 
             selectedPeriod === '6W' ? d.util6W :
             selectedPeriod === '10W' ? d.util10W : d.util18W
    })).sort((a, b) => b.value - a.value);
  };

  // Pastel color palette inspired by Lotus branding
  const getColor = (value) => {
    if (value >= 95) return '#7dd3c0'; // Pastel teal/mint
    if (value >= 85) return '#f4b47a'; // Pastel orange/peach (was purple)
    if (value >= 75) return '#e89090'; // Pastel dark red/rose
    return '#f89a9a'; // Pastel red/coral
  };

  const getStatusText = (value) => {
    if (value >= 95) return 'Excellent';
    if (value >= 85) return 'Good';
    if (value >= 75) return 'Fair';
    return 'Needs Attention';
  };

  const chartData = getDisplayData();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Truck Utilization Report</h1>
          <p className="text-gray-600">Simple view of performance by route</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Time Period</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'total', color: 'from-purple-200 to-purple-300' },
              { key: '6W', color: 'from-blue-200 to-blue-300' },
              { key: '10W', color: 'from-pink-200 to-pink-300' },
              { key: '18W', color: 'from-teal-200 to-teal-300' }
            ].map(({ key, color }) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedPeriod === key
                    ? `bg-gradient-to-r ${color} text-gray-800 shadow-lg transform scale-105`
                    : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                }`}
              >
                {periodLabels[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Utilization % - {periodLabels[selectedPeriod]}
          </h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d8b4fe" opacity={0.3} />
              <XAxis 
                dataKey="route" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fill: '#4b5563' }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#4b5563' }}
                label={{ value: 'Utilization %', angle: -90, position: 'insideLeft', fill: '#4b5563' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur p-4 border-2 border-purple-200 rounded-lg shadow-xl">
                        <p className="font-semibold text-gray-800">{payload[0].payload.route}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: getColor(payload[0].value) }}>
                          {payload[0].value}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{getStatusText(payload[0].value)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.value)} opacity={0.9} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  formatter={(value) => `${value}%`}
                  style={{ fill: '#374151', fontWeight: 'bold', fontSize: '14px' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Best Performers */}
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 border border-teal-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">✓</span>
              Top Performers
            </h3>
            <div className="space-y-3">
              {chartData.slice(0, 3).map((route, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200">
                  <div>
                    <p className="font-semibold text-gray-800">{route.route}</p>
                    <p className="text-xs text-gray-600">{getStatusText(route.value)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: '#059669' }}>{route.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 border border-pink-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚠</span>
              Needs Attention
            </h3>
            <div className="space-y-3">
              {chartData.slice(-3).reverse().map((route, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                  <div>
                    <p className="font-semibold text-gray-800">{route.route}</p>
                    <p className="text-xs text-gray-600">{getStatusText(route.value)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: '#dc2626' }}>{route.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Table View */}
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Complete Data Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Route</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-blue-50/50 rounded-t-lg">6 Weeks</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-purple-50/50 rounded-t-lg">10 Weeks</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-pink-50/50 rounded-t-lg">18 Weeks</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg">Overall</th>
                </tr>
              </thead>
              <tbody>
                {data.map((route, idx) => (
                  <tr key={idx} className="border-b border-purple-100 hover:bg-purple-50/30">
                    <td className="py-3 px-4 font-medium text-gray-800">{route.route}</td>
                    <td className="py-3 px-4 text-center bg-blue-50/30">
                      <span 
                        className="inline-block px-4 py-2 rounded-lg font-semibold shadow-sm"
                        style={{ 
                          backgroundColor: getColor(route.util6W),
                          color: '#1f2937'
                        }}
                      >
                        {route.util6W}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center bg-purple-50/30">
                      <span 
                        className="inline-block px-4 py-2 rounded-lg font-semibold shadow-sm"
                        style={{ 
                          backgroundColor: getColor(route.util10W),
                          color: '#1f2937'
                        }}
                      >
                        {route.util10W}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center bg-pink-50/30">
                      <span 
                        className="inline-block px-4 py-2 rounded-lg font-semibold shadow-sm"
                        style={{ 
                          backgroundColor: getColor(route.util18W),
                          color: '#1f2937'
                        }}
                      >
                        {route.util18W}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center bg-gradient-to-r from-purple-100/50 to-blue-100/50">
                      <span 
                        className="inline-block px-4 py-2 rounded-lg font-bold text-lg shadow-md"
                        style={{ 
                          backgroundColor: getColor(route.utilTotal),
                          color: '#1f2937'
                        }}
                      >
                        {route.utilTotal}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Color Legend */}
        <div className="mt-6 bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Levels</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl shadow-md" style={{ backgroundColor: '#7dd3c0' }}></div>
              <div>
                <p className="font-semibold text-gray-800">Excellent</p>
                <p className="text-sm text-gray-600">95% or higher</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl shadow-md" style={{ backgroundColor: '#f4b47a' }}></div>
              <div>
                <p className="font-semibold text-gray-800">Good</p>
                <p className="text-sm text-gray-600">85% - 94%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl shadow-md" style={{ backgroundColor: '#e89090' }}></div>
              <div>
                <p className="font-semibold text-gray-800">Fair</p>
                <p className="text-sm text-gray-600">75% - 84%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl shadow-md" style={{ backgroundColor: '#f89a9a' }}></div>
              <div>
                <p className="font-semibold text-gray-800">Critical</p>
                <p className="text-sm text-gray-600">Below 75%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insight Box */}
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-purple-400 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Key Insight
          </h3>
          <p className="text-gray-700">
            {selectedPeriod === 'total' && "Overall fleet performance is strong at 96% average. WANGNOI is the only route below target at 75%."}
            {selectedPeriod === '6W' && "6-week period shows 85% fleet average. SURATTHANI achieves perfect 100% utilization."}
            {selectedPeriod === '10W' && "10-week period is the weakest at 78% fleet average. All routes should investigate this dip."}
            {selectedPeriod === '18W' && "18-week period excels at 97% fleet average. KHONKAEN leads with 99% utilization."}
          </p>
        </div>

      </div>
    </div>
  );
};

export default SimpleDashboard;
