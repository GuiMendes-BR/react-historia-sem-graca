import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

interface Upvote {
  userId: string;
  historyId: string;
}

interface Downvote {
  userId: string;
  historyId: string;
}

export interface IHistory {
  id: string;
  history: string;
  upvotes: number;
  downvotes: number;
  userId: string;
}

interface Props {
  history: IHistory;
  setHistoriesList: any; 
}

export const History = (props: Props) => {
  const { history, setHistoriesList } = props;

  const [user] = useAuthState(auth);

  const [upvotes, setUpvotes] = useState<Upvote[] | null>(null);
  const [downvotes, setDownvotes] = useState<Downvote[] | null>(null);

  const upvoteRef = collection(db, "Upvote");
  const upvotesDoc = query(upvoteRef, where("historyId", "==", history.id));
  const downvoteRef = collection(db, "Downvote");
  const downvotesDoc = query(downvoteRef, where("historyId", "==", history.id));

  const getUpvotes = async () => {
    const data = await getDocs(upvotesDoc);
    setUpvotes(
      data.docs.map((doc) => ({ userId: doc.data().userId, historyId: doc.id }))
    );
  };

  const getDownvotes = async () => {
    const data = await getDocs(downvotesDoc);
    setDownvotes(
      data.docs.map((doc) => ({ userId: doc.data().userId, historyId: doc.id }))
    );
  };

  const addUpvote = async () => {
    try {
      const newDoc = await addDoc(upvoteRef, {
        userId: user?.uid,
        historyId: history.id,
      });
      if (user) {
        setUpvotes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, historyId: newDoc.id }]
            : [{ userId: user?.uid, historyId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addDownvote = async () => {
    try {
      const newDoc = await addDoc(downvoteRef, {
        userId: user?.uid,
        historyId: history.id,
      });
      if (user) {
        setDownvotes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, historyId: newDoc.id }]
            : [{ userId: user?.uid, historyId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeUpvote = async () => {
    try {
      const upvoteToDeleteQuery = query(
        upvoteRef,
        where("historyId", "==", history.id),
        where("userId", "==", user?.uid)
      );

      const upvoteToDeleteData = await getDocs(upvoteToDeleteQuery);
      const upvoteId = upvoteToDeleteData.docs[0].id;
      const upvoteToDelete = doc(db, "Upvote", upvoteId);
      await deleteDoc(upvoteToDelete);

      if (user) {
        setUpvotes(
          (prev) =>
            prev && prev.filter((upvote) => upvote.historyId !== upvoteId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeDownvote = async () => {
    try {
      const downvoteToDeleteQuery = query(
        downvoteRef,
        where("historyId", "==", history.id),
        where("userId", "==", user?.uid)
      );

      const downvoteToDeleteData = await getDocs(downvoteToDeleteQuery);
      const downvoteId = downvoteToDeleteData.docs[0].id;
      const downvoteToDelete = doc(db, "Downvote", downvoteId);
      await deleteDoc(downvoteToDelete);

      if (user) {
        setDownvotes(
          (prev) =>
            prev && prev.filter((downvote) => downvote.historyId !== downvoteId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserUpvoted = upvotes?.find((upvote) => upvote.userId === user?.uid);
  const hasUserDownvoted = downvotes?.find(
    (downvote) => downvote.userId === user?.uid
  );

  const historyRef = collection(db, "History");
  const deleteHistory = async () => {
    try {
      const downvoteToDeleteQuery = query(
        historyRef,
        where("__name__", "==", history.id)
      );

      const historyToDeleteData = await getDocs(downvoteToDeleteQuery);
      const historyId = historyToDeleteData.docs[0].id;
      const historyToDelete = doc(db, "History", historyId);
      await deleteDoc(historyToDelete);

      if (user) {
        setHistoriesList(
          (prev: IHistory[]) =>
            prev && prev.filter((history) => history.id !== historyId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUpvotes();
    getDownvotes();
  }, []);

  return (
    <div className="max-w-lg rounded overflow-hidden shadow-md mb-10 bg-yellow-900 bg-opacity-10 border-yellow-900 border border-opacity-10 mx-auto">
      <div className="px-4 py-2 bg-gray-50">
        <p className="text-gray-700 text-base">{history.history}</p>
      </div>
      <div className="px-2 py-2 flex items-center">
        <div>
          <span className="text-gray-400 p-2 hover:text-gray-700 text-xs font-bold ml-2">
            {(upvotes ? upvotes.length : 0) -
              (downvotes ? downvotes.length : 0)}{" "}
            votes
          </span>
        </div>

        <div className="grow flex justify-end align-center">
          {user?.uid === history.userId && (
            <button onClick={deleteHistory} className="text-gray-400 p-2 text-lg font-semibold hover:text-gray-700 items-center">
              &#128473;
            </button>
          )}
          <button
            onClick={
              hasUserDownvoted
                ? () => {
                    removeDownvote();
                    addUpvote();
                  }
                : hasUserUpvoted
                ? removeUpvote
                : addUpvote
            }
            className={`px-2 p-2 text-lg font-semibold ${
              hasUserUpvoted
                ? "text-green-600"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            &#11165;
          </button>

          <button
            onClick={
              hasUserUpvoted
                ? () => {
                    removeUpvote();
                    addDownvote();
                  }
                : hasUserDownvoted
                ? removeDownvote
                : addDownvote
            }
            className={`px-2 p-2 text-lg font-semibold ${
              hasUserDownvoted
                ? "text-red-600"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            &#11167;
          </button>
        </div>
      </div>
    </div>
  );
};
