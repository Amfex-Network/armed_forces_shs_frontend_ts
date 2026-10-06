import { Link } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png";

// Passwords are reset by the school administrator, who issues a one-time
// password that must be changed at the next sign-in. There is no
// self-service reset, so there is no email/code flow that could be abused.
const ForgotPassword = () => (
  <div
    className="min-h-screen flex items-center justify-center p-4"
    style={{ background: "linear-gradient(135deg,#0b2b4a,#123a63,#1e4e7c)" }}
  >
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div
        className="px-8 pt-8 pb-6 text-center"
        style={{ background: "linear-gradient(135deg,#0b2b4a,#123a63)" }}
      >
        <img src={logo} alt="" className="w-12 h-12 mx-auto mb-3" />
        <div className="flex items-center justify-center gap-2 text-white">
          <KeyRound size={18} color="#fbbf24" />
          <h1 className="text-lg font-black">Forgot your password?</h1>
        </div>
      </div>
      <div className="px-6 py-6 space-y-4 text-sm text-gray-600">
        <p>
          For your security, passwords are reset only by the school
          administration.
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>
            Contact the school office or the ICT administrator and confirm your
            identity.
          </li>
          <li>They will give you a one-time password.</li>
          <li>
            Sign in with it - you will be asked to choose a new password
            straight away.
          </li>
        </ol>
        <div
          className="flex items-start gap-2 p-3 rounded-xl text-xs"
          style={{ backgroundColor: "#eff6ff", color: "#1e40af" }}
        >
          <ShieldCheck size={15} className="flex-shrink-0 mt-0.5" />
          Staff will never ask for your password. Do not share the one-time
          password with anyone.
        </div>
        <Link
          to="/"
          className="block w-full py-2.5 text-center text-sm font-bold text-white rounded-xl"
          style={{ backgroundColor: "#123a63" }}
        >
          Back to sign in
        </Link>
      </div>
    </div>
  </div>
);

export default ForgotPassword;
