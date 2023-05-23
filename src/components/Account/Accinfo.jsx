import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link as Linking } from "react-router-dom";
import Navbar from "../homePage/Navbar"

export default function Accinfo() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.providerData && currentUser.providerData[0].providerId === "google.com") {
          // User signed in with Google
          console.log("Google user:", currentUser);
          setUser({ name: currentUser.displayName, email: currentUser.email });
        } else {
          // User signed in directly (without Google)
          console.log("Direct sign-in user:", currentUser);
          const usersCollectionRef = collection(db, "users");
          const q = query(usersCollectionRef, where("email", "==", currentUser.email));
          getDocs(q)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log("User data from Firestore:", userData);
                setUser({
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  email: currentUser.email,
                });
              }
            })
            .catch((error) => {
              console.log("Error getting user data: ", error);
            });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <h1>Account Details</h1>
          {user.name && <h3>Name: {user.name}</h3>}
          {user.first_name && <h3>First Name: {user.first_name}</h3>}
          {user.last_name && <h3>Last Name: {user.last_name}</h3>}
          <h4>Email: {user.email}</h4>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h4>User not signed in</h4>
          <Linking to="/login">Go to the login page</Linking>
        </div>
      )}
    </div>
  );
}
