import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  // Lấy toàn bộ headers của request
  const headers = Object.fromEntries(req.headers.entries());

  // Trả về JSON hiển thị tất cả headers
  return NextResponse.json({ headers }, { status: 200 });
}
