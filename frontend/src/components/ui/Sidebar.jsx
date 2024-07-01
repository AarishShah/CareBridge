import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Clipboard, 
  FolderOpen, 
  UserCheck,
  UserPlus
} from 'lucide-react'; 

const Sidebar = ({ userType, hoveredIndex }) => {
  const linkClasses = (index) => 
    `flex items-center space-x-2 ${hoveredIndex === index ? 'text-blue-600' : ''} hover:text-blue-600`;

  return (
    <div className="bg-transparent h-full p-4 w-64 mt-24 ml-20 text-lg font-semibold">
      <ul className="space-y-8">
        <li>
          <Link to="/personal-info" className={linkClasses(0)}>
            <User className="h-6 w-6" />
            <span>Personal Information</span>
          </Link>
        </li>
        <li>
          <Link to="/files" className={linkClasses(1)}>
            <FileText className="h-6 w-6" />
            <span>Files</span>
          </Link>
        </li>
        <li>
          <Link to="/prescription" className={linkClasses(2)}>
            <Clipboard className="h-6 w-6" />
            <span>Prescription</span>
          </Link>
        </li>
        <li>
          <Link to="/medical-records" className={linkClasses(3)}>
            <FolderOpen className="h-6 w-6" />
            <span>Medical Records</span>
          </Link>
        </li>
        {userType === 'doctor' ? (
          <li>
            <Link to="/assigned-patients" className={linkClasses(4)}>
              <UserPlus className="h-6 w-6" />
              <span>Assigned Patients</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/assigned-doctors" className={linkClasses(4)}>
              <UserCheck className="h-6 w-6" />
              <span>Assigned Doctors</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
