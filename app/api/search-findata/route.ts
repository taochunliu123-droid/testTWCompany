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

    // 使用政府資料開放平台 API
    // 這是財政部的全國營業稅籍登記資料
    const dataGovAPI = 'https://eip.fia.gov.tw/data/BGMOPEN1.csv';
    
    // 由於 CSV 檔案很大，我們使用另一個 API 端點
    // 這裡使用 data.gov.tw 的 API
    try {
      // 先嘗試用經濟部的 API（即使可能需要申請，但可以試試看）
      const gcisAPI = `https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C`;
      
      let filter = '';
      // 判斷是統一編號還是公司名稱
      if (/^\d{8}$/.test(keyword)) {
        // 8 位數字，當作統一編號
        const apiURL = 'https://data.gcis.nat.gov.tw/od/data/api/9D17AE0D-09B5-4732-A8F4-81ADED04B679';
        filter = `Business_Accounting_NO eq ${keyword}`;
        
        const response = await axios.get(`${apiURL}?$format=json&$filter=${encodeURIComponent(filter)}&$top=10`, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        if (response.data) {
          const formattedData = Array.isArray(response.data) 
            ? response.data.map(formatCompanyData)
            : [formatCompanyData(response.data)];

          return NextResponse.json({
            success: true,
            data: formattedData.filter((item: any) => item.公司名稱),
            count: formattedData.length
          });
        }
      } else {
        // 公司名稱查詢
        filter = `Company_Name like ${keyword} and Company_Status eq 01`;
        
        const response = await axios.get(`${gcisAPI}?$format=json&$filter=${encodeURIComponent(filter)}&$top=10`, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        if (response.data) {
          const formattedData = Array.isArray(response.data) 
            ? response.data.map(formatCompanyData)
            : [formatCompanyData(response.data)];

          return NextResponse.json({
            success: true,
            data: formattedData.filter((item: any) => item.公司名稱),
            count: formattedData.length
          });
        }
      }

    } catch (apiError: any) {
      console.error('政府 API 錯誤:', apiError.message);
      
      // 嘗試使用備用的 API
      try {
        const fincloudAPI = 'https://finmindapi.serveo.net/api/taiwan_stock_info';
        const response = await axios.get(fincloudAPI, {
          params: {
            dataset: 'TaiwanCompanyInfo',
            data_id: keyword
          },
          timeout: 10000
        });

        if (response.data && response.data.data) {
          const formattedData = response.data.data.map((company: any) => ({
            統一編號: company.stock_id || company.統一編號 || '',
            公司名稱: company.stock_name || company.公司名稱 || '',
            公司狀態: '營業中',
            資本額: company.capital || '',
            代表人: company.chairman || company.代表人 || '',
            公司所在地: company.address || company.地址 || '',
            source: '財政部開放資料 (備用來源)'
          }));

          return NextResponse.json({
            success: true,
            data: formattedData,
            count: formattedData.length
          });
        }
      } catch (backupError) {
        console.error('備用 API 失敗:', backupError);
      }

      // 提供說明
      return NextResponse.json({
        success: false,
        message: '財政部 API 需要申請權限才能使用。建議改用「第三方 API」或聯絡管理員申請 API 權限。',
        hint: '如需申請，請至 https://data.gcis.nat.gov.tw/ 填寫使用告知書',
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

// 格式化公司資料
function formatCompanyData(company: any) {
  return {
    統一編號: company.Business_Accounting_NO || company.統一編號 || '',
    公司名稱: company.Company_Name || company.公司名稱 || '',
    公司狀態: company.Company_Status_Desc || company.Company_Status || '核准設立',
    資本額: company.Capital_Stock_Amount 
      ? `NT$ ${parseInt(company.Capital_Stock_Amount).toLocaleString()}` 
      : company.Paid_In_Capital_Amount
      ? `NT$ ${parseInt(company.Paid_In_Capital_Amount).toLocaleString()}`
      : '',
    代表人: company.Responsible_Name || company.代表人 || '',
    公司所在地: company.Company_Location || company.地址 || '',
    登記地址: company.Register_Organization_Desc || '',
    設立日期: company.Company_Setup_Date || company.設立日期 || '',
    營業項目: company.Cmp_Business || '',
    source: '經濟部商工登記資料'
  };
}
