import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Users, ArrowRight, Mail, Phone, Download, ExternalLink, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import ViewApplicationModal from "@/components/ViewApplicationModal";
import ViewMessageModal from "@/components/ViewMessageModal";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

type JobApplication = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  message: string;
  resume_url?: string; // Marked as optional to match ViewApplicationModal
  status: string;
  created_at: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
};

type Blog = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

type Career = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  created_at: string;
};

const AdminDashboard = () => {
  const { user, blogs, careers, refreshBlogs, refreshCareers } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected items for viewing
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Delete confirmation state
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<'blog' | 'career' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      const fetchData = async () => {
        setLoading(true);
        
        try {
          const { data: appData, error: appError } = await supabase
            .from('job_applications')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (appError) throw appError;
          console.log("Fetched job applications:", appData);
          setApplications(appData || []);
          
          const appChannel = supabase
            .channel('public:job_applications')
            .on('postgres_changes', { 
              event: '*', 
              schema: 'public', 
              table: 'job_applications' 
            }, payload => {
              console.log('Real-time update for job applications:', payload);
              fetchJobApplications();
            })
            .subscribe();
            
          const { data: contactData, error: contactError } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (contactError) throw contactError;
          setContactMessages(contactData || []);
          
          const contactChannel = supabase
            .channel('public:contacts')
            .on('postgres_changes', { 
              event: '*', 
              schema: 'public', 
              table: 'contacts' 
            }, payload => {
              console.log('Real-time update for contact messages:', payload);
              fetchContactMessages();
            })
            .subscribe();
          
          return () => {
            supabase.removeChannel(appChannel);
            supabase.removeChannel(contactChannel);
          };
        } catch (error) {
          console.error('Error fetching admin data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      const fetchJobApplications = async () => {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setApplications(data);
        }
      };
      
      const fetchContactMessages = async () => {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setContactMessages(data);
        }
      };
      
      fetchData();
    }
  }, [user, navigate]);
  
  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      
      toast.success("Application status updated successfully");
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId || !deleteItemType) return;
    
    setIsDeleting(true);
    
    try {
      if (deleteItemType === 'blog') {
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', deleteItemId);
          
        if (error) throw error;
        
        toast.success("Blog deleted successfully");
        refreshBlogs();
      } 
      else if (deleteItemType === 'career') {
        const { error } = await supabase
          .from('careers')
          .delete()
          .eq('id', deleteItemId);
          
        if (error) throw error;
        
        toast.success("Job posting deleted successfully");
        refreshCareers();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
      setDeleteItemId(null);
      setDeleteItemType(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'contacted':
        return <Badge className="bg-orange-500">Contacted</Badge>;
      case 'interviewing':
        return <Badge className="bg-purple-500">Interviewing</Badge>;
      case 'hired':
        return <Badge className="bg-green-500">Hired</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <CardTitle className="text-xl font-semibold">Job Applications</CardTitle>
              <Users className="h-5 w-5 text-synjoint-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{applications.length}</p>
              <p className="text-sm text-gray-500">Total applications</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => document.getElementById('applications-tab')?.click()}>
                View Applications
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">Contact Messages</CardTitle>
              <Mail className="h-5 w-5 text-synjoint-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{contactMessages.length}</p>
              <p className="text-sm text-gray-500">Total contact messages</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => document.getElementById('messages-tab')?.click()}>
                View Messages
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
            <TabsTrigger value="careers">Job Listings</TabsTrigger>
            <TabsTrigger value="applications" id="applications-tab">Job Applications</TabsTrigger>
            <TabsTrigger value="messages" id="messages-tab">Contact Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Overview of your recent content creation activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...blogs, ...careers, ...applications.slice(0, 3)]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map((item) => {
                      const typedItem = item as any;
                      return (
                        <div key={typedItem.id} className="flex items-center pb-4 border-b">
                          {'content' in typedItem ? (
                            <FileText className="h-5 w-5 text-synjoint-blue mr-3" />
                          ) : 'requirements' in typedItem ? (
                            <Briefcase className="h-5 w-5 text-synjoint-blue mr-3" />
                          ) : (
                            <Users className="h-5 w-5 text-synjoint-blue mr-3" />
                          )}
                          <div>
                            <p className="font-medium">
                              {'title' in typedItem ? typedItem.title : 'position' in typedItem ? `Application: ${typedItem.position}` : typedItem.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(typedItem.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  
                  {[...blogs, ...careers, ...applications].length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>
                  Manage your blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blogs.length > 0 ? (
                  <div className="divide-y">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{blog.title}</h3>
                          <p className="text-sm text-gray-500">
                            Published: {new Date(blog.created_at).toLocaleDateString()}
                            {blog.author_name && ` • By: ${blog.author_name}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                          >
                            <Link to={`/blog/${blog.id}`}>View</Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              setDeleteItemId(blog.id);
                              setDeleteItemType('blog');
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No blog posts yet</p>
                    <Button className="mt-4" asChild>
                      <Link to="/admin/create-blog">Create Your First Blog Post</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="careers">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>
                  Manage your career opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {careers.length > 0 ? (
                  <div className="divide-y">
                    {careers.map((career) => (
                      <div key={career.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{career.title}</h3>
                          <p className="text-sm text-gray-500">
                            Location: {career.location} • Posted: {new Date(career.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                          >
                            <Link to={`/careers`}>View</Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              setDeleteItemId(career.id);
                              setDeleteItemType('career');
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No job listings yet</p>
                    <Button className="mt-4" asChild>
                      <Link to="/admin/create-career">Post Your First Job</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>
                  All applications received through the careers page
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-b-2 border-synjoint-blue rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading applications...</p>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{app.name}</h3>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              Applied for: <span className="font-medium text-synjoint-blue">{app.position}</span>
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            {new Date(app.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm mb-3">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{app.email}</span>
                        </div>
                        
                        <div className="flex justify-between mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
                          >
                            View Details
                          </Button>
                          
                          <select 
                            className="px-2 py-1 text-xs border rounded"
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No job applications received yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  Messages received through the contact form
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-b-2 border-synjoint-blue rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading messages...</p>
                  </div>
                ) : contactMessages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{msg.name}</h3>
                          <div className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm mb-3">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{msg.email}</span>
                        </div>
                        
                        <p className="text-sm line-clamp-2 mb-3 text-gray-700 dark:text-gray-300">
                          {msg.message}
                        </p>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMessage(msg)}
                          >
                            View Message
                          </Button>
                          
                          <Button 
                            size="sm"
                            onClick={() => window.location.href = `mailto:${msg.email}?subject=Re: Your message to SYNJOINT`}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No contact messages received yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedApplication && (
        <ViewApplicationModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={updateApplicationStatus}
        />
      )}

      {selectedMessage && (
        <ViewMessageModal
          message={selectedMessage}
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        isOpen={!!deleteItemId}
        onClose={() => {
          setDeleteItemId(null);
          setDeleteItemType(null);
        }}
        onConfirm={handleDeleteItem}
        title={`Delete ${deleteItemType === 'blog' ? 'Blog Post' : 'Job Listing'}`}
        description={`Are you sure you want to delete this ${deleteItemType === 'blog' ? 'blog post' : 'job listing'}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminDashboard;
