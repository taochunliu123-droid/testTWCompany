'use client';

import { useState } from 'react';
import axios from 'axios';

interface CompanyData {
  統一編號?: string;
  公司名稱?: string;
  公司狀態?: string;
  資本額?: string;
  代表人?: string;
  公司所在地?: string;
  登記地址?: string;
  營業項目?: string;
  設立日期?: string;
  source?: string; // 資料來源
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAPI, setSelectedAPI] = useState<'thirdparty' | 'findata'>('thirdparty');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('請輸入公司名稱或統一編號');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const endpoint = selectedAPI === 'thirdparty' 
        ? '/api/search-thirdparty'
        : '/api/search-findata';
      
      const response = await axios.post(endpoint, {
        keyword: searchTerm.trim()
      });

      if (response.data.success) {
        setResults(response.data.data || []);
        if (!response.data.data || response.data.data.length === 0) {
          setError('查無資料');
        }
      } else {
        setError(response.data.message || '查詢失敗');
      }
    } catch (err: any) {
      console.error('查詢錯誤:', err);
      setError(err.response?.data?.message || '查詢發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏢 台灣公司查詢系統
          </h1>
          <p className="text-gray-600">雙 API 版本 - 支援多種資料來源</p>
          <p className="text-sm text-gray-500 mt-2">
            作者：PM Mayors | Tao Chun Liu
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          {/* API 選擇 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇資料來源
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedAPI('thirdparty')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedAPI === 'thirdparty'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">第三方 API</h3>
                    <p className="text-xs text-gray-500">opendata.vip</p>
                  </div>
                  {selectedAPI === 'thirdparty' && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedAPI('findata')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedAPI === 'findata'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">財政部資料</h3>
                    <p className="text-xs text-gray-500">政府開放資料</p>
                  </div>
                  {selectedAPI === 'findata' && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              查詢關鍵字
            </label>
            <div className="flex gap-2">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="輸入公司名稱或統一編號 (例如：台積電 或 97176009)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? '查詢中...' : '查詢'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">⚠️ {error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              查詢結果 ({results.length} 筆)
            </h2>
            {results.map((company, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {company.公司名稱 || '未提供'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      資料來源：{company.source}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {company.公司狀態 || '營業中'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">統一編號</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {company.統一編號 || '未提供'}
                    </p>
                  </div>

                  {company.代表人 && (
                    <div>
                      <p className="text-sm text-gray-600">代表人</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {company.代表人}
                      </p>
                    </div>
                  )}

                  {company.資本額 && (
                    <div>
                      <p className="text-sm text-gray-600">資本額</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {company.資本額}
                      </p>
                    </div>
                  )}

                  {company.設立日期 && (
                    <div>
                      <p className="text-sm text-gray-600">設立日期</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {company.設立日期}
                      </p>
                    </div>
                  )}
                </div>

                {(company.公司所在地 || company.登記地址) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">地址</p>
                    <p className="text-gray-900">
                      {company.公司所在地 || company.登記地址}
                    </p>
                  </div>
                )}

                {company.營業項目 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">營業項目</p>
                    <p className="text-gray-900">
                      {company.營業項目}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 使用說明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 支援公司名稱或 8 位數統一編號查詢</li>
            <li>• 第三方 API：可能資料較新但覆蓋範圍有限</li>
            <li>• 財政部資料：資料較完整但更新頻率較低</li>
            <li>• 建議兩種來源都試試看</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
