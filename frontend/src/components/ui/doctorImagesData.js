import image1 from '../../assets/9.png';
import image2 from '../../assets/10.png';
import image3 from '../../assets/11.png';
import image4 from '../../assets/12.png';
import image5 from '../../assets/13.png';

const doctorImagesData = [
  { src: image1, heading: 'Personal Information', text: '' },
  { src: image2, heading: 'Files', text: 'Access and review patient files <br/> seamlessly to provide informed<br/> and effective care.',
    button: { text: 'View Old Medical Records'},
   },
  { src: image3, heading: 'Prescription', text: 'Create and manage patient prescriptions<br/> conveniently to ensure accurate and<br/> up-to-date medication records.',
    button: { text: 'Create Prescription'}
   },
  { src: image4, heading: 'Medical Records', text: 'View and create detailed medical records<br/> to ensure comprehensive patient care<br/> and accurate documentation.',
    buttons: [{ text: 'View Medical Records', path: "/all-medical-records"},{text: 'Create New Record'}]
   },
  { src: image5, heading: 'Assigned Patients', text: 'Easily manage and assign patients<br/> for personalized healthcare support.',
    buttons: [{ text: 'Assign Patients'}, {text: 'View Assigned Patients'}],
   },
];

export default doctorImagesData;
