
import { motion } from "framer-motion";

const StakeholdersSection = () => {
  const stakeholders = [
    {
      type: "Healthcare Professionals",
      icon: "👨‍⚕️",
      description: "Surgeons, orthopedists, and healthcare providers who rely on our innovative implant solutions."
    },
    {
      type: "Patients and Caregivers",
      icon: "🧑‍🤝‍🧑",
      description: "Recipients of our medical devices who benefit from improved mobility and quality of life."
    }
  ];

  const leaders = [
    {
      name: "Dr. Susheel Chaudary",
      role: "Founder & Medical Director",
      image: "/lovable-uploads/6033b195-d7ac-4581-b018-f92ee857b92b.png",
      bio: "Leading orthopedic surgeon with over 15 years of experience in joint replacement procedures."
    },
    {
      name: "Dr. Sangeeta Lamba",
      role: "Head of Research & Development",
      image: "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png",
      bio: "Specialized in biomechanical engineering with a focus on innovative orthopedic device design."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <section id="stakeholders" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Stakeholders</h2>
          <div className="w-24 h-1 bg-synjoint-orange mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The people who inspire our innovation and benefit from our solutions
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {stakeholders.map((stakeholder, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 hover-lift"
            >
              <div className="text-4xl mb-4">{stakeholder.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{stakeholder.type}</h3>
              <p className="text-gray-600 dark:text-gray-300">{stakeholder.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Our Leadership</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover-lift flex flex-col md:flex-row"
              >
                <div className="md:w-1/3">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{leader.name}</h4>
                  <p className="text-synjoint-blue dark:text-synjoint-lightblue font-medium mb-3">{leader.role}</p>
                  <p className="text-gray-600 dark:text-gray-300">{leader.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StakeholdersSection;
