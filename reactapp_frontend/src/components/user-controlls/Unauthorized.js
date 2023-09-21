import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate()

    const goBack = () => navigate(-1);

  return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className="w-40 my-5 p-5 rounded bg-white text-danger">
            <h1>Unauthorized!</h1>
            <br />
            <p>You do not have access to the requested page.</p><br/><br/><br/>
            <button className="btn btn-primary btn-block mt-5" onClick={goBack}>Go back</button>
        </div>
      </div>
  )
}

export default Unauthorized