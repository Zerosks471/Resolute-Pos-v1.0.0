import React, { useEffect } from "react";
import Logo from "../assets/logo.svg";
import { toast } from "react-hot-toast";
import { signIn } from "../controllers/auth.controller";
import { useNavigate } from "react-router-dom";
import { isRestroUserAuthenticated } from "../helpers/AuthStatus";
import {
  getUserDetailsInLocalStorage,
  saveUserDetailsInLocalStorage,
} from "../helpers/UserDetails";
import { SCOPES } from "../config/scopes";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const restroAuthenticated = isRestroUserAuthenticated();
    if (restroAuthenticated) {
      const { role, scope } = getUserDetailsInLocalStorage();
      if (role == "admin") {
        navigate("/dashboard/home", {
          replace: true,
        });
        return;
      }
      const userScopes = scope.split(",");
      if (userScopes.includes(SCOPES.DASHBOARD)) {
        navigate("/dashboard/home", {
          replace: true,
        });
        return;
      } else {
        navigate("/dashboard/profile", {
          replace: true,
        });
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username) {
      e.target.username.focus();
      toast.error("Please provide username!");
      return;
    }

    if (!password) {
      e.target.password.focus();
      toast.error("Please provide password!");
      return;
    }

    try {
      toast.loading("Please wait...");

      const res = await signIn(username, password);

      if (res.status == 200) {
        toast.dismiss();
        toast.success(res.data.message);

        const user = res.data.user;
        saveUserDetailsInLocalStorage(user);

        const { role, scope } = getUserDetailsInLocalStorage();
        if (role == "admin") {
          navigate("/dashboard/home", {
            replace: true,
          });
          return;
        }
        const userScopes = scope.split(",");
        if (userScopes.includes(SCOPES.DASHBOARD)) {
          navigate("/dashboard/home", {
            replace: true,
          });
          return;
        } else {
          navigate("/dashboard/profile", {
            replace: true,
          });
        }

        return;
      } else {
        const message = res.data.message;
        toast.dismiss();
        toast.error(message);
        return;
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Something went wrong!";

      toast.dismiss();
      toast.error(message);
      return;
    }
  };

  return (
    <div className="bg-resolute-bg flex items-center justify-center w-full h-screen">
      <div className="bg-white rounded-2xl px-8 py-8 w-full sm:w-96 mx-8 sm:mx-0">
        <div className="flex items-center justify-between">
          <div className="text-resolute-text text-xl font-medium">
            Login
          </div>
          <div>
            <img src={Logo} className="h-16" />
          </div>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="Enter Your Username here..."
              className="mt-1 block w-full bg-gray-100 px-4 py-3 rounded-xl"
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter Your Password here..."
              className="mt-1 block w-full bg-gray-100 px-4 py-3 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="block w-full mt-6 bg-resolute-primary text-resolute-text rounded-xl px-4 py-3 transition hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-green-800/20"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
