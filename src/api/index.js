import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred?.providerData[0];
        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );
        return unsubscribe;
      } else {
        reject(new Error("User not authenticated"));
      }
      unsubscribe();
    });
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timeStamp", "asc")
    );
    const unsubscribe = onSnapshot(templateQuery, (querySnapshot) => {
      const templates = querySnapshot.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubscribe;
  });
};

export const saveToCollection = async (user, data) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, { collections: arrayUnion(data?._id) })
      .then(() => {
        toast.success("Added to collection");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  } else {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, { collections: arrayRemove(data?._id) })
      .then(() => {
        toast.success("Removed from collection");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }
};
export const saveToFavourites = async (user, data) => {
  if (!data?.favourites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);
    await updateDoc(docRef, { favourites: arrayUnion(user?.uid) })
      .then(() => {
        toast.success("Added to favourites");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  } else {
    const docRef = doc(db, "templates", data?._id);
    await updateDoc(docRef, { favourites: arrayRemove(user?.uid) })
      .then(() => {
        toast.success("Removed from favourites");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }
};

export const getTemplateDetails = async (id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(doc(db, "templates", id), (doc) => {
      resolve(doc.data());
    });
    return unsubscribe;
  });
};

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
      }
    );

    return unsubscribe;
  });
};

export const getSavedResumes = async (uid) => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "users", uid, "resumes"),
      orderBy("timeStamp", "asc")
    );
    const unsubscribe = onSnapshot(templateQuery, (querySnapshot) => {
      const templates = querySnapshot.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubscribe;
  });
};
