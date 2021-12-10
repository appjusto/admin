import { act, fireEvent, render, screen } from '@testing-library/react';
import { RootProvider } from 'app/RootProvider';
import { ManagerProfile } from './ManagerProfile';

const renderManagerProfile = () => (
  <RootProvider>
    <ManagerProfile />
  </RootProvider>
);

describe('ManagerProfile testing', () => {
  test('is email input disabled and user typing ok', async () => {
    render(renderManagerProfile());
    act(() => {
      fireEvent.change(screen.getByRole('textbox', { name: 'Nome *' }), {
        target: { value: 'karl' },
      });
      fireEvent.change(screen.getByRole('textbox', { name: 'Sobrenome *' }), {
        target: { value: 'Marx' },
      });
      fireEvent.change(screen.getByRole('textbox', { name: /celular/i }), {
        target: { value: '81996546114' },
      });
      fireEvent.change(screen.getByRole('textbox', { name: /cpf/i }), {
        target: { value: '35214602820' },
      });
      //fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    });
    expect(await screen.findByRole('textbox', { name: /e\-mail/i })).toBeDisabled();
    expect(await screen.findByRole('textbox', { name: 'Nome *' })).toHaveValue('karl');
    expect(await screen.findByRole('textbox', { name: 'Sobrenome *' })).toHaveValue('Marx');
    expect(await screen.findByRole('textbox', { name: /celular/i })).toHaveValue('(81) 99654-6114');
    expect(await screen.findByRole('textbox', { name: /cpf/i })).toHaveValue('352.146.028-20');
  });
});
