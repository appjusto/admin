import { Order, WithId } from "@appjusto/types";
import dayjs from "dayjs";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";

const fakeTime = serverTimestamp();

const fakeOrders = [
  {
    scheduledTo: null,
    additionalInfo: "",
    fulfillment: "delivery",
    status: "scheduled",
    arrivals: {
      destination: {
        estimate: fakeTime,
        initialEstimate: fakeTime,
        arrivalLimit: fakeTime,
      },
    },
    type: "food",
    fare: {
      total: 9970,
      business: {
        value: 8970,
        commission: 449,
        financialFee: 207
      },
      courier: {
        financialFee: 22,
        value: 1000,
        commission: 0
      },
      platform: null,
      fleet: {
        situation: "approved",
        name: "Frota AppJusto",
        id: "appjusto",
        description: "A frota AppJusto foi pensada para ser equilibrada e atender às diferentes situações do dia a dia, sempre com uma remuneração adequada",
        distanceThreshold: 5000,
        additionalPerKmAfterThreshold: 200,
        participantsOnline: 0,
        maxDistanceToOrigin: 4000,
        createdOn: fakeTime,
        maxDistance: 40000,
        minimumFee: 1000
      }
    },
    flagged: true,
    origin: {
      location: {
        latitude: -8.2965352,
        longitude: -34.95782
      },
      additionalInfo: "",
      address: {
        description: "Itapuama, 5 - Itapuama - Cabo de Santo Agostinho",
        secondary: "Itapuama - Cabo de Santo Agostinho",
        main: "Itapuama, 5"
      }
    },
    updatedOn: fakeTime,
    dispatchingState: null,
    business: {
      name: "Itapuama Vegan",
      cusine: "Vegana",
      id: "EDYSq9TMOiRZdhRfqBdk"
    },
    paymentMethod: "credit_card",
    destination: {
      location: {
        latitude: -8.293054,
        longitude: -34.9543153
      },
      additionalInfo: "",
      address: {
        googlePlaceId: "ChIJ4-2dTlTvqgcRgvBMUBS7ACo",
        main: "Av. Alcides Alves de Souza, 57",
        description: "Av. Alcides Alves de Souza, 57 - Paiva, Cabo de Santo Agostinho - PE, Brasil",
        secondary: "Paiva, Cabo de Santo Agostinho - PE, Brasil"
      }
    },
    consumer: {
      name: "Renan",
      coordinates: {
        latitude: -8.2926683,
        longitude: -34.9545511
      },
      appInstallationId: "3fd846a1ee5c75ef",
      id: "rfgP11IiccMQMVkvyta1chgKU7I3",
      notificationToken: "ExponentPushToken[x49wibK5NcW0h6YdyYmIx-]",
    },
    cookingTime: 1200,
    timestamps: {
      confirming: fakeTime,
      scheduled: fakeTime,
      charged: fakeTime,
      quote: fakeTime,
    },
    items: [
      {
        quantity: 3,
        product: {
          name: "Marguerita",
          id: "sUOZ7yVVhVdgPp11ct7h",
          price: 2990,
          categoryName: "Pizzas"
        },
        complements: [],
        notes: "",
        id: "19AcFqBjXQCQIks9sB2Cw"
      }
    ],
    createdOn: fakeTime,
    dispatchingStatus: 'idle',
    route: {
      polyline: "jlsqjujtEHAuBQiHcAyCSmEdaGuE",
      issue: null,
      distance: 751,
      duration: 125
    },
    dispatchingTimestamps: {
      idle: fakeTime,
    }
  },
] as Order[];

let orderCode = 299;
const dates = ['2022-07-08', '2022-07-09', '2022-07-10'];
const getScheduledTime = (index: number) => {
  let time = null;
  if(index < 3) {
    time = dayjs(dates[0]).toDate().getTime();
  } else if(index < 6) {
    time = dayjs(dates[0]).toDate().getTime();
  } else {
    time = dayjs(dates[0]).toDate().getTime();
  }
  return time as unknown as FieldValue;
}
const orders = fakeOrders.map(((order, index) => {
  orderCode++;
  // const created = serverTimestamp();
  return {
    ...order,
    id: nanoid(),
    code: orderCode.toString(),
    // scheduledTo: null;
    scheduledTo: getScheduledTime(index),
  };
}));

export const getFakeOrders = () => orders as WithId<Order>[];