
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import CareerCard from "../components/CareerCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Careers = () => {
  const { careers, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900"
          >
            Career Opportunities
          </motion.h1>
          
          {isAdmin && (
            <Link to="/admin/create-career">
              <Button className="bg-synjoint-blue hover:bg-synjoint-blue/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </Link>
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Join Our Team</h2>
              <p className="text-gray-600 mb-6">
                At Synjoint Techno, we're always looking for talented individuals who are passionate about
                medical technology and innovation. Join us in our mission to develop cutting-edge medical
                solutions that improve lives.
              </p>
              
              {careers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {careers.map((career) => (
                    <motion.div
                      key={career.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <CareerCard {...career} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No career opportunities available at the moment.</p>
                </div>
              )}
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Why Join Us?</h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Innovative Work Environment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Professional Growth Opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Competitive Benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Work-Life Balance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;
