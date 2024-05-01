import React from "react";
import { Link } from "react-router-dom";
import styles from "./PatientImages.module.css";

import image1 from "../../../assets/img1.png";
import image2 from "../../../assets/img2.png";
import image3 from "../../../assets/img3.png";
import image4 from "../../../assets/img4.png";
import image5 from "../../../assets/img5.png";

const images = [image1, image2, image3, image4, image5];
const doctorSidebarLinks = [
  {
    id: 0,
    title: "User Profile",
    link: "profile",
  },
  {
    id: 1,
    title: "Read Medical Record",
    link: "/medicalHistory",
  },
  { id: 2, title: "Read Medical History", link: "read/medicalhistory" },
  {
    id: 3,
    title: "Assign Doctor",
    link: "assign-doctor",
  },
  {
    id: 4,
    title: "Remove Doctor",
    link: "remove-doctor",
  },
];

const PatientImages = () => {
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
                {doctorSidebarLinks[index].title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientImages;
