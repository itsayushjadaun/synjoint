
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, blogs, careers } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">Blog Posts</CardTitle>
              <FileText className="h-5 w-5 text-synjoint-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{blogs.length}</p>
              <p className="text-sm text-gray-500">Total blog posts</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/create-blog" className="w-full">
                <Button variant="outline" className="w-full">
                  Create New Blog
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">Career Listings</CardTitle>
              <Briefcase className="h-5 w-5 text-synjoint-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{careers.length}</p>
              <p className="text-sm text-gray-500">Active job listings</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/create-career" className="w-full">
                <Button variant="outline" className="w-full">
                  Post New Job
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">Admin Users</CardTitle>
              <Users className="h-5 w-5 text-synjoint-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1</p>
              <p className="text-sm text-gray-500">Total admin users</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Manage Users
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Overview of your recent content creation activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...blogs, ...careers]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="flex items-center pb-4 border-b">
                      {'content' in item ? (
                        <FileText className="h-5 w-5 text-synjoint-blue mr-3" />
                      ) : (
                        <Briefcase className="h-5 w-5 text-synjoint-blue mr-3" />
                      )}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                
                {[...blogs, ...careers].length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
