import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

function Login() {
    const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    console.log(result.user);

    alert(`Welcome ${result.user.displayName}!`);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 text-center">

        <h1 className="text-3xl font-bold text-blue-600">
          🚀 AI Life Saver
        </h1>

        <p className="mt-3 text-gray-600">
          Your AI Productivity Companion
        </p>

        <button
          onClick={handleGoogleLogin}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
         Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;