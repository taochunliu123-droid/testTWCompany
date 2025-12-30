import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '台灣公司查詢系統 - 雙 API 版本',
  description: '使用第三方 API 和財政部資料查詢台灣公司資訊',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
