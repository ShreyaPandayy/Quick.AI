import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

import CreationItem from "../components/CreationItem";

// Base URL setup for API
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();

  // Fetch user-specific creations
  const getDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || "Unable to fetch data");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-wrap gap-4">
        {/* Total Creations */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              {user?.publicMetadata?.plan === "premium" ? "Premium" : "Free"}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-3/4">
          <div className="animate-spin rounded-full h-11 w-11 border-[3px] border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4 text-lg font-medium text-gray-700">
            Recent Creations
          </p>
          {creations.length > 0 ? (
            creations.map((item) => <CreationItem key={item.id} item={item} />)
          ) : (
            <p className="text-gray-500 text-sm">No creations found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
