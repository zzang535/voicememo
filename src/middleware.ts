import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 서비스 점검 모드 확인
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // 점검 모드가 아니면 정상 처리
  if (!isMaintenanceMode) {
    return NextResponse.next();
  }

  // 이미 점검 페이지에 있으면 그대로 진행
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }

  // 점검 모드일 때 점검 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/maintenance', request.url));
}

// middleware를 적용할 경로 설정
// API 경로, Next.js 내부 경로, static 파일은 제외
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
