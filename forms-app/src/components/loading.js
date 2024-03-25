
import './styles.css'; 

const Loading = ({ isOpen }) => {


  return (
    <>
    {isOpen && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
}

export default Loading;