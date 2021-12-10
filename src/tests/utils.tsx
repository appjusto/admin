//import { render } from '@testing-library/react';
import { rest } from 'msw';
//import { QueryClient, QueryClientProvider } from 'react-query';

export const handlers = [
  rest.get('*/managers/*', (req, res, ctx) => {
    return res(ctx.status(400));
  }),
  rest.post('*/managers/*', (req, res, ctx) => {
    console.log(req.body);
    return res(ctx.status(200), ctx.json(req.body));
  }),
];

/*const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithClient(ui: any) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement<any, string | React.JSXElementConstructor<any>>) =>
      rerender(<QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>),
  };
}

interface WrapperProps {
  children: React.ReactNode | React.ReactNode[];
}

export function createWrapper() {
  const testQueryClient = createTestQueryClient();
  return ({ children }: WrapperProps) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  );
}*/
