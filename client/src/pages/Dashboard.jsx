import { useState, useEffect } from "react";  
import axios from "axios";  
import { useAuth } from "../context/AuthContext";  
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "react";  

const Dashboard = () => {  
  const { user } = useAuth();  
  const [stats, setStats] = useState(null);  
  const [recentApplications, setRecentApplications] = useState([]);  

  useEffect(() => {  
    if (user?.role === "recruiter") {  
      fetchRecruiterStats();  
    } else {  
      fetchJobseekerStats();  
    }  
  }, []);  

const fetchRecruiterStats = async () => {  
    const { data } = await axios.get("/api/dashboard/recruiter");  
    setStats(data);  
    setRecentApplications(data.recentApplications);  
  };  

const fetchJobseekerStats = async () => {  
    const { data } = await axios.get("/api/dashboard/jobseeker");  
    setStats(data);  
  };  

  return (  
    <div className="max-w-7xl mx-auto px-4 py-8">  
      <h1 className="text-3xl font-bold mb-8">  
        Welcome, {user?.name}
      </h1>  
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">  
        <div className="bg-white rounded-lg shadow p-6">  
          <h3 className="text-gray-500 text-sm">Active Jobs</h3>  
          <p className="text-3xl font-bold mt-2">{stats?.activeJobs || 0}</p>  
        </div>  
        <div className="bg-white rounded-lg shadow p-6">  
          <h3 className="text-gray-500 text-sm">Total Applications</h3>  
          <p className="text-3xl font-bold mt-2">{stats?.totalApplications || 0}</p>  
        </div>  
        <div className="bg-white rounded-lg shadow p-6">  
          <h3 className="text-gray-500 text-sm">Applications This Week</h3>  
          <p className="text-3xl font-bold mt-2">{stats?.weeklyApplications || 0}</p>  
        </div>  
      </div>  

{user?.role === "recruiter" && (  
   <div className="bg-white rounded-lg shadow p-6">  
    <h2 className="text-xl font-bold mb-4">Recent Applications</h2>  
  <div className="space-y-4">  
      {recentApplications.map((app) => (  
   <div  
       key={app._id}  
     className="flex items-center justify-between border-b pb-4"  
              >  
<div>  
    <p className="font-medium">{app.applicant?.name}</p>  
    <p className="text-sm text-gray-500">  
             Applied for {app.job?.title}  
        </p>  
</div>  
     <span  
     className={`px-3 py-1 rounded-full text-sm ${  
   app.status === "pending"  
          ? "bg-yellow-100 text-yellow-800"  
          : app.status === "accepted"  
         ? "bg-green-100 text-green-800"  
          : app.status === "rejected"  
          ? "bg-red-100 text-red-800"  
          : "bg-gray-100 text-gray-800"  
            }`}  
        >  
{app.status}  
        </span>  
    </div>  
        ))}  
</div>  
    </div>  
      )}  
    </div>  
  );  
};  

export default Dashboard;