import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Plane } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import UserContext from "../context/UserContext";

const UserProfilePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out");
    navigate("/login");
  };

  const handleEdit = () => {
    toast.info("Edit profile clicked");
  };

  if (!user) return <div className="p-6 text-center text-gray-500 animate-pulse">Loading your profile...</div>;

  const avatar =
    user.isOAuthUser && user.profilePicture
      ? user.profilePicture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.displayName || user.fullName || "User"
        )}&background=8b5cf6&color=fff`;

  const name = user.isOAuthUser ? user.displayName : user.fullName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-700 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 transition-all duration-300">
          <img src={avatar} alt="User Avatar" className="w-28 h-28 rounded-full ring-4 ring-violet-300 object-cover" />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-violet-800">{name}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.mobileNo && <p className="text-gray-500">{user.mobileNo}</p>}
            <p className="text-sm text-gray-400 mt-1">Joined {dayjs(user.createdAt).format("MMMM YYYY")}</p>

            <button
              onClick={handleEdit}
              className="mt-4 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-md shadow-sm transition-all duration-200"
            >
              <Cog6ToothIcon className="w-5 h-5 inline-block mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <ProfileOption
            label="Manage Bookings"
            icon={<Plane className="text-violet-600 w-5 h-5" />}
            onClick={() => navigate("/account/bookings")}
          />
          <ProfileOption
            label="Saved Addresses"
            icon={<MapPinIcon className="text-violet-600 w-5 h-5" />}
            onClick={() => navigate("/profile/addresses")}
          />
          <ProfileOption
            label="Payment Methods"
            icon={<CreditCardIcon className="text-violet-600 w-5 h-5" />}
            onClick={() => navigate("/profile/payments")}
          />
          <ProfileOption
            label="Check-In Status"
            icon={<CheckBadgeIcon className="text-violet-600 w-5 h-5" />}
            onClick={() => navigate("/check-in")}
          />
          <ProfileOption
            label="Change Password"
            icon={<LockClosedIcon className="text-violet-600 w-5 h-5" />}
            onClick={() => navigate("/profile/change-password")}
          />
          <ProfileOption
            label="Logout"
            icon={<ArrowRightOnRectangleIcon className="text-red-600 w-5 h-5" />}
            textColor="text-red-600"
            hover="hover:bg-red-50"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

// Profile option card component
const ProfileOption = ({ label, icon, onClick, textColor = "text-gray-700", hover = "hover:bg-violet-50" }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white p-5 rounded-xl shadow-md flex items-center gap-4 transition-all duration-200 transform hover:-translate-y-0.5 ${hover}`}
  >
    {icon}
    <span className={`text-base font-medium ${textColor}`}>{label}</span>
  </div>
);

export default UserProfilePage;
