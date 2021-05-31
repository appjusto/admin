export type OrderAcknowledgement = {
  receivedAt: Date;
  notified: boolean;
  order: {
    id: string;
    code: string;
    consumer: {
      name: string;
    };
  };
};
export type Acknowledgement = {
  [key: string]: OrderAcknowledgement;
};
