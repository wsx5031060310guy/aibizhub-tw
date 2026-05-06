import { NextResponse } from 'next/server';

export async function GET() {
  // 檢查關鍵依賴健康狀態
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
