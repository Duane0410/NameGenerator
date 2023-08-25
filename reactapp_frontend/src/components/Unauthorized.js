import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate()

    const goBack = () => navigate(-1);

  return (
        <div className="w-40 my-5 p-5 rounded bg-white text-danger">
          <h1>Unauthorized!</h1>
          <br />
          <p>You do not have access to the requested page.</p>
            <button className="btn btn-primary btn-block" onClick={goBack}>Go back</button>
        </div>
  )
}

export default Unauthorized