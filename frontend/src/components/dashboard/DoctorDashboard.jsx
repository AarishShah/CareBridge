import Images from "../dashboard/home/Images";
import Navbar from "./Navbar";
import {
  HomeSharp,
  ArticleOutlined,
  AccountCircleSharp,
  LogoutSharp,
} from "@mui/icons-material";

const doctorSidebarLinks = [
  {
    id: 0,
    title: "Home",
    link: "",
    icon: <HomeSharp />,
  },
  {
    id: 1,
    title: "Medical History",
    link: "medicalhistory",
    icon: <ArticleOutlined />,
  },
  {
    id: 2,
    title: "Profile",
    link: "profile",
    icon: <AccountCircleSharp />,
  },
  { id: 3, title: "Logout", icon: <LogoutSharp /> },
];

function DoctorDashboard() {
  return (
    <div>
      {/* <Dashboard sidebarLinks={doctorSidebarLinks} /> */}
      <Navbar userType="doctor"/>
      <Images />
    </div>
  );
}

export default DoctorDashboard;
