// import { useNavigate, useLocation } from "react-router";
// import { useState, useContext } from "react";
// import useAuth from "./hooks/useAuth";
// import axios from "axios";

// const SignIn = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/linkpage";
//   const { auth, setAuth } = useAuth();
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const API = axios.create({
//     baseURL: "http://localhost:5000",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/Login-marketer", {
//         name,
//         password,
//       }).then((res) => {
//         if (res?.data.name) {
//           const role = res?.data.role;
//           setAuth({ role: `${role}`, name: `${name}` });
//           setName("");
//           setPassword("");
//           navigate(from, { replace: true });
//         } else {
//           console.log("incorrect submission");
//           setError(res.message);
//         }
//       });
//     } catch (err) {
//       if (!err?.response) {
//         setError("no server response");
//       } else {
//         setError("registeration failed");
//       }
//     }
//   };

//   return (
//     <div className='App'>
//       <form onSubmit={handleSubmit}>
     
//                 <h3 className="text-center">Sign Up</h3>
//                 <div className="mb-2">
//                 <label htmlFor="email" >Name</label>
//                 <input type="text" placeholder=" enter name" className="form-control"></input>
//                 </div>
//                 <div className="mb-2">
//                 <label htmlFor="email" >Contact No.</label>
//                 <input type="numeric" placeholder=" enter Contact" className="form-control"></input>
//                 </div>
//                 <div className="mb-2">
//                 <label htmlFor="email" >Email</label>
//                 <input type="email" placeholder=" enter email" className="form-control"></input>
//                 </div>
//                 <div className="mb-2">
//                 <label htmlFor="password" >Password</label>
//                 <input type="password" placeholder=" enter password" className="form-control"></input> 
//                 </div>
//                 <div className="d-grid">
//                 {/* <Link to='/' className="ms-2"> */}<button className="btn btn-primary">Register</button>
//                 </div>
            
//         </form>
//     </div>
//   );
// };

// export default SignIn;