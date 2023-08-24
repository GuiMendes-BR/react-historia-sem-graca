import { Link } from "react-router-dom";
import { auth, provider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };

  const signUserOut = async () => {
    await signOut(auth);
  };

  const buttonClassName = `bg-yellow-600 py-2 px-4 mx-2 rounded text-white hover:bg-yellow-500`;
  return (
    <div>
      {/* <!-- Navbar --> */}
      <div className="max-w-lg container mx-auto flex py-3 items-center">
        <div>
          <Link to="/" className={buttonClassName}>
            Home
          </Link>
          {user && (
            <Link to="/create-history" className={buttonClassName}>
              Escrever História
            </Link>
          )}
        </div>
        <div className="flex grow justify-end items-center">
          {user ? (
            <>
              {/* <p>{user?.displayName}</p> */}
              <img src={user?.photoURL || ""} width="25" height="25" />
              <button className={buttonClassName} onClick={signUserOut}>
                Logout
              </button>
            </>
          ) : (
            <button className={buttonClassName} onClick={signInWithGoogle}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* <!-- Cabeçalho --> */}
      <div>
        <h1 className="text-center text-4xl font-serif my-14 tracking-wider font-thin uppercase">
          História Sem Graça
        </h1>
      </div>
    </div>
  );
};
