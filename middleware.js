import { NextResponse } from 'next/server';

// Repassa o caminho pedido num header, para o servidor conseguir saber qual
// página o visitante queria. É o que permite ao guard mandar `/login?next=<destino>`
// e devolver a pessoa ao lugar certo depois do login, em vez da home do curso.
// Puramente aditivo: nenhuma rota é bloqueada, reescrita ou redirecionada aqui.
export function middleware(request) {
  const headers = new Headers(request.headers);
  headers.set('x-pathname', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
