import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { auth, db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

interface CreateHistoryData {
  history: string;
}

export const CreateHistoryForm = () => {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    history: yup.string().required("Você se esqueceu de escrever sua história!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHistoryData>({
    resolver: yupResolver(schema),
  });

  const historyRef = collection(db, "History");

  const onCreateHistory = async (data: CreateHistoryData) => {
    await addDoc(historyRef, {
      ...data,
      userName: user?.displayName,
      userId: user?.uid,
      upvotes: 0,
      downvotes: 0
    });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onCreateHistory)} className="container max-w-lg mx-auto flex flex-col">
      <textarea
        className="w-full border border-yellow-700 border-opacity-30 h-28 p-1 rounded outline-none"
        placeholder="Escreva sua história sem graça..."
        {...register("history")}
      ></textarea>
      <p className="text-red-500">{errors.history?.message}</p>
      <input
        type="submit"
        className="mx-auto bg-yellow-600 px-4 py-2 rounded text-white font-semibold mt-4 hover:bg-yellow-500"
      ></input>
    </form>
  );
};
