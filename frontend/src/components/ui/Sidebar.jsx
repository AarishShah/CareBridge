import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Clipboard,
  FolderOpen,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Clock10
} from "lucide-react";

const Sidebar = ({ userType, hoveredIndex }) => {
  const linkClasses = (index) =>
    `flex items-center space-x-2 ${
      hoveredIndex === index ? "text-blue-600" : ""
    } hover:text-blue-600`;

  return (
    <div className="bg-transparent h-full w-64 mt-12 ml-20 text-md font-semibold hidden lg:block">
      <ul className="space-y-8">
        <li>
          <Link to="#" className={linkClasses(0)}>
            <User className="h-6 w-6" />
            <span>Personal Information</span>
          </Link>
        </li>
        <li>
          <Link to="#" className={linkClasses(1)}>
            <FileText className="h-6 w-6" />
            <span>Files</span>
          </Link>
        </li>
        <li>
          <Link to="#" className={linkClasses(2)}>
            <Clipboard className="h-6 w-6" />
            <span>Prescription</span>
          </Link>
        </li>
        <li>
          <Link to="#" className={linkClasses(3)}>
            <FolderOpen className="h-6 w-6" />
            <span>Medical Records</span>
          </Link>
        </li>
        {userType === "doctor" ? (
          <li>
            <Link to="#" className={linkClasses(4)}>
              <UserPlus className="h-6 w-6" />
              <span>Assigned Patients</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link to="#" className={linkClasses(4)}>
              <UserCheck className="h-6 w-6" />
              <span>Assigned Doctors</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="#" className={linkClasses(5)}>
            <ShieldCheck className="h-6 w-6" />
            <span>Two-Factor Authentication</span>
          </Link>
        </li>
        <li>
          <Link to="#" className={linkClasses(5)}>
            <Clock10 className="h-6 w-6" />
            <span>Send Reminder</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
