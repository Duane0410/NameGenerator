import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate()

    const goBack = () => navigate(-1);

  return (
    <div className="login template justify-content-center align-items-center 100-w vh-100 bg-primary">
        <h1>Unauthorized</h1>
        <br />
        <p>You do not have access to the requested page.</p>
        <div>
            <button className="btn btn-outline-dark btn-block" onClick={goBack}>Go back</button>
        </div>
    </div>
  )
}

export default Unauthorized