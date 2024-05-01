import { Link } from "react-router-dom";

import styles from "./Images.module.css";

import image1 from "../../../assets/img1.png";
import image2 from "../../../assets/img2.png";
import image3 from "../../../assets/img3.png";
import image4 from "../../../assets/img4.png";
import image5 from "../../../assets/img5.png";
import image6 from "../../../assets/img6.png";

const images = [image1, image2, image3, image4, image5, image6];
const doctorSidebarLinks = [
  {
    id: 0,
    title: "User Profile",
    link: "profile",
  },
  {
    id: 1,
    title: "Create Medical Record",
    link: "/medical-record/create",
  },
  {
    id: 2,
    title: "Read Medical Record",
    link: "/medicalHistory",
  },
  { id: 3, title: "Read Medical History", link: "read/medicalhistory" },
  {
    id: 4,
    title: "Assign Patient",
    link: "assign-patient",
  },
  {
    id: 5,
    title: "Remove Patient",
    link: "remove-patient",
  },
];

const Images = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.imageGridContainer}>
        {images.map((image, index) => (
          <div key={index} className={styles.imageItem}>
            <img src={image} alt={`image ${index + 1}`} />
            <div className={styles.imageTitle}>
              <Link
                to={doctorSidebarLinks[index].link}
                style={{ color: "white" }}
              >
                {" "}
                {doctorSidebarLinks[index].title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
