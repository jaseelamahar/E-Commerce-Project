import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export const addToCart = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    return { status: "error", message: "User not logged in" };
  }

  const cartRef = doc(db, "users", user.uid, "cart", product.id);
  const docSnap = await getDoc(cartRef);

  if (docSnap.exists()) {
    await updateDoc(cartRef, {
      quantity: increment(1),
      price: product.price,
    });
  } else {
    await setDoc(cartRef, {
      ...product,
      quantity: 1,
    });
  }

  return { status: "success", message: "Product added to cart" };
};
