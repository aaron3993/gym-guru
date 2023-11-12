import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth, db } from '../../firebase';
import "./Register.css"
 
const Register = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const user = userCredential.user;
          const docRef = await addDoc(collection(db, "users"), {
            uid: user.uid,
            email: user.email,
            // Add any additional user data you want to store in Firestore
            // For example: first name, last name, etc.
          });
          console.log("Document written with ID: ", docRef.id);
          navigate("/login")
      } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
      }
            // ..
 
   
    }
 
  return (
    <main >        
        <section>
            <div className="signup-container">
                <div>                  
                    <p className='title'> Gym Guru </p>                                                                            
                    <form>                                                                                            
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"                                
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"              
                            />
                        </div>                                             
                        
                        <button
                            type="submit" 
                            onClick={onSubmit}                        
                        >  
                            Sign up                                
                        </button>
                                                                     
                    </form>
                   
                    <p>
                        Already have an account?{' '}
                        <NavLink to="/login" >
                            Sign in
                        </NavLink>
                    </p>                   
                </div>
            </div>
        </section>
    </main>
  )
}
 
export default Register