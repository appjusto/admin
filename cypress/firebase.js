import { nanoid } from 'nanoid';

const getFirebaseClient = async (config) => {
  const firebase = await import('firebase/app')
    .then((res) => {
      const fire = res.default;
      if (!fire.apps.length) {
        fire.initializeApp(config);
      }
      return fire;
    })
    .catch((error) => {
      console.log(error);
    });
  const auth = await import('firebase/auth').then(() => {
    if (firebase) return firebase.auth();
  });
  auth.useEmulator('http://localhost:9099');

  const createTestingUser = async () => {
    const email = `${nanoid(5)}@test.com`;
    const password = `${nanoid(8)}`;
    await auth.createUserWithEmailAndPassword(email, password);
    return { email, password };
  };
  return { createTestingUser };
};

export default getFirebaseClient;
