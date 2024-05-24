import image from '../../assets/7.png';
import image1 from '../../assets/2.png';

const AuthForm = ({ heading, children }) => {
  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <img src={image} alt="" className='hidden md:block md:w-1/2 object-cover' />
      <div className='flex flex-col items-center w-full md:w-1/2 p-4 md:p-8'>
        <img src={image1} alt="" className='h-16 w-16 rounded-full mt-16 mb-8' />
        <h2 className='text-2xl font-bold mb-16'>{heading}</h2>
        <form className='w-full max-w-sm'>
          <div className='flex flex-col text-lg'>
            {children}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
