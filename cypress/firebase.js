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

  const createTestingUser = async (userEmail, userPassword) => {
    const email = userEmail ?? `${nanoid(5)}@test.com`;
    const password = userPassword ?? `${nanoid(8)}`;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('createUserError', error);
    }
    return { email, password };
  };
  // const deleteUser = () => {
  //   return auth.currentUser.delete();
  // };
  return { createTestingUser };
};

export default getFirebaseClient;
