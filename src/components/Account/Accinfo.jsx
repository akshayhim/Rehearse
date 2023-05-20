import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link as Linking } from "react-router-dom";

export default function Accinfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is logged in
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("email", "==", currentUser.email));
        getDocs(q)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setUser(userData);
            }
          })
          .catch((error) => {
            console.log("Error getting user data: ", error);
          });
      } else {
        // User is logged out
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
      <h1>Account Details</h1>
      {user ? (
        <div>
          <h3>First Name: {user.first_name}</h3>
          <h3>Last Name: {user.last_name}</h3>
          <h4>Email: {user.email}</h4>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <Linking to="/login" color="inherit">Go to the login page</Linking>
      )}
    
    </div>
  );
}