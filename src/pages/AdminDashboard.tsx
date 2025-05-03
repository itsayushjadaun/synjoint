import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Users, ArrowRight, Mail, Phone, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type JobApplication = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  message: string;
  resume_url?: string;
  status: string;
  created_at: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string; // Add phone field as optional since it might not exist in all records
  message: string;
  created_at: string;
};

const AdminDashboard = () => {
  const { user, blogs, careers } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      const fetchData = async () => {
        setLoading(true);
        
        try {
          const { data: appData, error: appError } = await supabase
            .from('job_applications' as const)
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
            .from('contacts' as const)
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
          .from('job_applications' as const)
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setApplications(data);
        }
      };
      
      const fetchContactMessages = async () => {
        const { data, error } = await supabase
          .from('contacts' as const)
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setContactMessages(data);
        }
      };
      
      fetchData();
    }
  }, [user, navigate]);
  
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
  
  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications' as const)
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      const { data } = await supabase
        .from('job_applications' as const)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        setApplications(data);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
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
                      // Properly type the item to avoid 'property name does not exist on type never'
                      const typedItem = item as any; // Using any here as a temporary solution to avoid the type error
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
                  <div className="space-y-6">
                    {applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{app.name}</h3>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              Applied for: <span className="font-medium text-synjoint-blue">{app.position}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(app.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <p className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`mailto:${app.email}`} className="text-synjoint-blue hover:underline">
                              {app.email}
                            </a>
                          </p>
                          {app.phone && (
                            <p className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`tel:${app.phone}`} className="text-synjoint-blue hover:underline">
                                {app.phone}
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter/Message:</p>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-line">{app.message}</p>
                        </div>
                        
                        {app.resume_url && (
                          <div className="mt-4 flex gap-2">
                            <a 
                              href={app.resume_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-synjoint-blue hover:underline flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Resume
                            </a>
                            <a 
                              href={app.resume_url} 
                              download
                              className="text-synjoint-blue hover:underline flex items-center"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </div>
                        )}
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <select 
                            className="px-3 py-1 border rounded text-sm"
                            value={app.status || 'new'}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `mailto:${app.email}?subject=Re: Your application for ${app.position}&body=Dear ${app.name},%0A%0A`}
                          >
                            Reply via Email
                          </Button>
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
                  <div className="space-y-6">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{msg.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(msg.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <p className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`mailto:${msg.email}`} className="text-synjoint-blue hover:underline">
                              {msg.email}
                            </a>
                          </p>
                          {msg.phone && (
                            <p className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`tel:${msg.phone}`} className="text-synjoint-blue hover:underline">
                                {msg.phone}
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Message:</p>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-line">{msg.message}</p>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="outline" 
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
    </div>
  );
};

export default AdminDashboard;
