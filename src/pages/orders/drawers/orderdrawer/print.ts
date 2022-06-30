import { Order, OrderItem, WithId } from '@appjusto/types';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';

export const getOrderToPrint = (
  order: WithId<Order>,
  businessLogo?: string | null,
  appjustoLogo?: string
) => {
  const printItems = (items: OrderItem[]) => {
    return items.map((item) => {
      return `<tr role="row" style="border-bottom: 1px solid black;">
          <td role="gridcell" data-is-numeric="true">${item.quantity}</td>
          <td role="gridcell">
            ${item.product.categoryName ?? 'N/E'} <br /><span>${
        item.product.name
      }</span><br /><span></span>
          </td>
          <td role="gridcell" data-is-numeric="true">${formatCurrency(item.product.price)}</td>
        </tr>
        ${
          item.complements &&
          item.complements.map((complement) => {
            return `<tr role="row" style="border-bottom: 1px solid black;">
          <td role="gridcell" data-is-numeric="true" style="font-size: 11px; font-weight: 500;">${
            complement.quantity ?? 1
          }</td>
          <td role="gridcell" style="font-size: 11px; font-weight: 500;">
            ${complement.group.name ?? 'N/E'} <br /><span>${complement.name}</span>
          </td>
          <td role="gridcell" data-is-numeric="true" style="font-size: 11px; font-weight: 500;">${formatCurrency(
            complement.price
          )}</td>
        </tr>`;
          })
        }
        `;
    });
  };

  const template = `<html>
    <head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
      />
    </head>
    <body style="font-size: 10px; font-height: 14px; color: black">
      <div style="padding-top: 14px; padding: 4px; max-width: 300px" id="template-to-print">
        <div>
          ${
            businessLogo &&
            appjustoLogo &&
            `<div style="display: flex; flex-direction: row; justify-content: center; align-items: center">
                <div style="position: relative">
                  <image src=${businessLogo} width="48px" height="48px"/>
                </div style="position: relative">
                <div>
                  <image src=${appjustoLogo} width="48px" height="48px"/>
                </div>
            </div>`
          }
          <p style="text-align: center">Por um delivery mais justo e transparente!</p>
          <p style="font-weight: 700; margin-top: 2px; text-align: center">${
            order.business?.name
          }</p>
        </div>
        <p style="font-size: 24px; font-weight: 700; ; line-height: 24px; margin-top: 6px">
          Pedido Nº ${order.code}
        </p>
        <div style="margin-top: 8px;  font-weight: 500; line-height: 16px">
          <p>
            Cliente: <span style="font-weight: 700">${order.consumer.name}</span>
          </p>
          <p>
            Hora: <span style="font-weight: 700">${getDateAndHour(
              order?.timestamps?.confirmed
            )}</span>
          </p>
          <p>
            Endereço: <span style="font-weight: 700">${order.destination?.address.main}</span>
          </p>
          <p>
            Complemento:
            <span style="font-weight: 700">${order.destination?.additionalInfo ?? 'N/I'}</span>
          </p>
        </div>
        <p style="font-size: 18px; margin-top: 8px">Detalhes do pedido</p>
        <table role="table" style="margin-top: 8px; width: 100%; border-collapse: collapse">
          <thead style="border-bottom: 1px solid black">
            <tr role="row">
              <th data-is-numeric="true" style="font-size: 12; max-width: 20px;">Qtd.</th>
              <th style="font-size: 12;">Item</th>
              <th data-is-numeric="true" style="font-size: 12;">Valor und.</th>
            </tr>
          </thead>
          <tbody>
            ${printItems(order.items!)}
          </tbody>
          <tfoot>
            <tr role="row">
              <th style="">Total</th>
              <th></th>
              <th data-is-numeric="true">${
                order?.fare?.business?.value ? formatCurrency(order.fare.business.value) : 0
              }</th>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top: 2px;">
          <p>Observações:</p>
          ${
            order.consumer.cpf !== null ||
            (order.consumer.cpf !== undefined &&
              `<br /><p style="font-weight: 500; margin-top: 1;">Incluir CPF na nota</p>`)
          }
          ${
            order.additionalInfo !== null ||
            (order.additionalInfo !== undefined &&
              `<br /><p style="font-weight: 500; margin-top: 1;">${order.additionalInfo}</p>`)
          }
          ${
            !order?.consumer.cpf &&
            !order?.additionalInfo &&
            `<br /><p style="margin-top: 1;">Sem observações.</p>`
          }
        </div>
        <div style="margin-top: 4; background-color: black; text-align: center;">
          <p style="font-weight: 700; color: white;">Este pedido já está pago</p>
        </div>
      </div>
    </body>
  </html>`;
  return template;
  // if (returnString) return template;
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(template, 'text/html');
  // return doc.body;
};
