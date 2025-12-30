import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: '請提供查詢關鍵字'
      }, { status: 400 });
    }

    // 嘗試使用第三方 API
    try {
      const response = await axios.get(`https://opendata.vip/data/company`, {
        params: { keyword },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // 檢查回應
      if (response.data) {
        // 處理回應資料
        let companies = [];
        
        if (Array.isArray(response.data)) {
          companies = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          companies = response.data.data;
        } else if (typeof response.data === 'object') {
          companies = [response.data];
        }

        // 格式化資料
        const formattedData = companies.map((company: any) => ({
          統一編號: company.Business_Accounting_NO || company.統一編號 || company.編號 || '',
          公司名稱: company.Company_Name || company.公司名稱 || company.名稱 || '',
          公司狀態: company.Company_Status_Desc || company.狀態 || '營業中',
          資本額: company.Capital_Stock_Amount 
            ? `NT$ ${parseInt(company.Capital_Stock_Amount).toLocaleString()}` 
            : '',
          代表人: company.Responsible_Name || company.代表人 || '',
          公司所在地: company.Company_Location || company.地址 || '',
          設立日期: company.Company_Setup_Date || company.設立日期 || '',
          source: '第三方 API (opendata.vip)'
        }));

        return NextResponse.json({
          success: true,
          data: formattedData,
          count: formattedData.length
        });
      }

      throw new Error('API 回應格式錯誤');

    } catch (apiError: any) {
      console.error('第三方 API 錯誤:', apiError.message);
      
      // 如果第三方 API 失敗，嘗試另一個備用 API
      try {
        const fallbackResponse = await axios.get(`https://company.g0v.ronny.tw/api/search`, {
          params: { q: keyword },
          timeout: 10000
        });

        if (fallbackResponse.data && fallbackResponse.data.data) {
          const formattedData = fallbackResponse.data.data.map((company: any) => ({
            統一編號: company['統一編號'] || '',
            公司名稱: company['公司名稱'] || '',
            公司狀態: company['公司狀態'] || '營業中',
            資本額: company['資本總額(元)'] 
              ? `NT$ ${parseInt(company['資本總額(元)']).toLocaleString()}` 
              : '',
            代表人: company['代表人姓名'] || '',
            公司所在地: company['公司所在地'] || '',
            設立日期: company['核准設立日期'] || '',
            source: '第三方 API (g0v)'
          }));

          return NextResponse.json({
            success: true,
            data: formattedData,
            count: formattedData.length
          });
        }
      } catch (fallbackError) {
        console.error('備用 API 也失敗:', fallbackError);
      }

      // 所有 API 都失敗
      return NextResponse.json({
        success: false,
        message: '第三方 API 暫時無法使用，請嘗試使用「財政部資料」或稍後再試',
        error: apiError.message
      }, { status: 503 });
    }

  } catch (error: any) {
    console.error('查詢錯誤:', error);
    return NextResponse.json({
      success: false,
      message: '查詢發生錯誤',
      error: error.message
    }, { status: 500 });
  }
}
