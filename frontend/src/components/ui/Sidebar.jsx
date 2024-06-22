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

const Sidebar = ({ userType }) => {
  return (
    <div className="bg-transparent h-full p-4 w-64 mt-24 ml-20 text-lg font-semibold">
      <ul className="space-y-8">
        <li>
          <Link to="/personal-info" className="flex items-center space-x-2 hover:text-blue-600">
            <User className="h-6 w-6" />
            <span>Personal Information</span>
          </Link>
        </li>
        <li>
          <Link to="/files" className="flex items-center space-x-2 hover:text-blue-600">
            <FileText className="h-6 w-6" />
            <span>Files</span>
          </Link>
        </li>
        <li>
          <Link to="/prescription" className="flex items-center space-x-2 hover:text-blue-600">
            <Clipboard className="h-6 w-6" />
            <span>Prescription</span>
          </Link>
        </li>
        <li>
          <Link to="/medical-records" className="flex items-center space-x-2 hover:text-blue-600">
            <FolderOpen className="h-6 w-6" />
            <span>Medical Records</span>
          </Link>
        </li>
        {userType === 'doctor' ? (
          <li>
            <Link to="/assigned-patients" className="flex items-center space-x-2 hover:text-blue-600">
              <UserPlus className="h-6 w-6" />
              <span>Assigned Patients</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/assigned-doctors" className="flex items-center space-x-2 hover:text-blue-600">
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
