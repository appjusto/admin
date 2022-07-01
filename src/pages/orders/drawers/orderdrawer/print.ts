import { Order, OrderItem, WithId } from '@appjusto/types';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';

export const getOrderToPrint = (
  order: WithId<Order>,
  businessLogo?: string | null,
  appjustoLogo?: string
) => {
  // helpers
  const isCPF = typeof order?.consumer.cpf === 'string';
  const isAdditionalInfo = typeof order?.additionalInfo === 'string' && order.additionalInfo.length > 0;
  const isDestinationAddInfo = typeof order.destination?.additionalInfo === 'string' && order.destination.additionalInfo.length > 0;
  // UI 
  const printItems = (items: OrderItem[]) => {
    return items.map((item, index) => {
      return (
        `
          <div style="margin-top: ${index === 0 ? '0' : '12px'}">
            <div style="font-weight: 700; display: flex; flex-direction: row;">
              <div style="min-width: 25px; width: 10%">
                ${item.quantity}
              </div>
              <div style="width: 60%; padding-left: 6px">
                ${item.product.name}
              </div>
              <div style="width: 30%; text-align: end">
                ${formatCurrency(item.product.price)}
              </div>
            </div>
            ${
              item.complements &&
              item.complements.map((complement) => {
                return (
                  `
                    <div style="font-weight: 500; display: flex; flex-direction: row;">
                      <div style="min-width: 25px; width: 10%"></div>
                      <div style="width: 60%; padding-left: 6px">
                        ${complement.quantity ?? 1} ${complement.name}
                      </div>
                      <div style="width: 30%; text-align: end">
                        ${formatCurrency(complement.price)}
                      </div>
                    </div>
                  `
                );
              }).join(" ")
            }
          </div>
      `);
    }).join(" ")
  };

  const template = `<html>
    <head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
      />
    </head>
    <body style="font-size: 8px !important; color: black">
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
          <p style="font-weight: 700; margin-top: 16px; text-align: center">${
            order.business?.name
          }</p>
        </div>
        <p style="font-weight: 700; ; line-height: 24px; margin-top: 6px">
          Pedido Nº ${order.code}
        </p>
        <div style="margin-top: 8px; display: flex; flex-direction: column; font-weight: 500; line-height: 16px">
          <div>
            <p>
              Cliente: <span style="font-weight: 700">${order.consumer.name}</span>
            </p>
          </div>  
          <div>
            <p>
              Hora: <span style="font-weight: 700">${getDateAndHour(order?.timestamps?.confirmed)}</span>
            </p>
          </div>
          <div>
            <p>
              Endereço: <span style="font-weight: 700">${order.destination?.address.main}</span>
              <span style="font-weight: 700">${isDestinationAddInfo ? ` - Compl.:${order.destination?.additionalInfo}` : ''}</span>
            </p>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <p style="font-weight: 700;">Detalhes do pedido</p>
        </div>
        <div>
          <div style="font-weight: 700; display: flex; flex-direction: row; border-bottom: 1px solid black">
            <div style="min-width: 25px; width: 10%">Qtd.</div>
            <div style="width: 60%; padding-left: 6px">Item</div>
            <div style="width: 30%; text-align: end">Valor(un.)</div>
          </div>
          ${printItems(order.items!)}
          <div style="font-weight: 700; display: flex; flex-direction: row; border-top: 1px solid black">
            <div style="width: 50%">Valor</div>
            <div style="width: 50%; text-align: end">
            ${
              order?.fare?.business?.value ? formatCurrency(order.fare.business.value) : 0
            }
            </div>
          </div>
        </div>
        <div style="margin-top: 16px; display: flex; flex-direction: column">
          <p style="font-weight: 700;">Observações:</p>
          ${
            isCPF ? `<p style="font-weight: 500;">Incluir CPF na nota</p>` : ''
          }
          ${
            isAdditionalInfo ?
              `<p style="font-weight: 500;">${order.additionalInfo}</p>` : ''
          }
          ${
            (!isCPF && !isAdditionalInfo) ? `<p>Sem observações.</p>` : ''
          }
        </div>
        <div style="margin-top: 16px; text-align: center; border: 1px solid black;">
          <p style="font-weight: 700;">Este pedido já está pago</p>
        </div>
      </div>
    </body>
  </html>`;
  return template;
};

// if (returnString) return template;
// const parser = new DOMParser();
// const doc = parser.parseFromString(template, 'text/html');
// return doc.body;