import { GithubAuthProvider, FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { auth } from "../../config/firebase"
import { jwtDecode } from "jwt-decode"
import {UserContext} from '../../context/UserContext'
import globalStyles from '../../globals.module.css'
import styles from './styles.module.css'
import {FaSignInAlt} from 'react-icons/fa'
import { FaGoogle} from 'react-icons/fa'
import { FaGithub } from "react-icons/fa"
import { FaFacebook } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa"
import { FaUserAlt } from "react-icons/fa"
import { FaKey } from "react-icons/fa"


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMessage, shouldShowErrorMessage] = useState(false)
  const {setExp, setAuthTime, isSessionValid} = useContext(UserContext)
  const navigate = useNavigate()

  if(isSessionValid()){
    navigate('/home')
  }

  const signIn = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    shouldShowErrorMessage(false)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const {user} = userCredential
      const token = await user.getIdToken()
      const decodedToken = jwtDecode(token)
      const {exp} = decodedToken
      setExp(exp || 0)
      setAuthTime(0)
      navigate('/home')
  }catch(err: any){
    console.log(err)
    shouldShowErrorMessage(true)
    setEmail('')
    setPassword('')
  }
}

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try{
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const {email, photoURL, displayName} = user
    console.log(email, photoURL, displayName)

    const token = await auth.currentUser?.getIdToken()
    console.log(token)
    if(token){
      const decodedToken = jwtDecode(token)
      const {exp} = decodedToken
      setExp(exp || 0)
      navigate('/home')
    }
    } catch (err) {
      console.log(err)
  }
}

const signInWithGit = async () => {
  const provider = new GithubAuthProvider()
  try{
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const {email, photoURL, displayName} = user
    console.log(email, photoURL, displayName)
    const token = await auth.currentUser?.getIdToken()
    console.log(token)
    if(token){
      const decodedToken = jwtDecode(token)
      const {exp} = decodedToken
      setExp(exp || 0)
      navigate('/home')
      }
      } catch (err) {
        console.log(err)
        }
}

const signInWithFB = async () =>{
  const provider = new FacebookAuthProvider()
  try{
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const {email, displayName, photoURL} = user

    console.log(email, displayName, photoURL)
    const token = await auth.currentUser?.getIdToken()
    console.log(token)
    if(token){
      const decodedToken = jwtDecode(token)
      const {exp} = decodedToken
      setExp(exp || 0)
      navigate('/home')
      }
      } catch (err) {
        console.log(err)
        }
}

return(
  <div className={globalStyles.container}>
	<div className={globalStyles.loginForm}>
  <FaSignInAlt className={globalStyles.signInAlt}/>
	<h1>Welcome!</h1>
  <span>Entre com sua conta</span>
    
      <div className={globalStyles.socialMediaButtons}>
        <div className={globalStyles.icon}>
          <FaGoogle onClick={() => signInWithGoogle()} style={{ color: '#4285F4' }}/>
        </div>
        <div className={globalStyles.icon}>
        <FaGithub onClick={() => signInWithGit()} style={{ color: ' #171515' }}/>
        </div>
        <div className={globalStyles.icon}>
        <FaFacebook onClick={() => signInWithFB()} style={{ color: '#4267B2' }}/>
        </div>
      </div>
            <form className={globalStyles.signIn} onSubmit={(e) => signIn(e)}> 
        <span>ou use sua conta</span>
        <input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FaUserAlt className={globalStyles.iconUser}/>
        <input type="password"required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <FaKey className={globalStyles.iconKey}/>
        <p className={globalStyles.forgotPassword}>Esqueceu a senha?</p>
        <button className={globalStyles.controlButton}>Entrar <FaArrowRight className={globalStyles.arrowRight}/></button>
      </form>
      <p className={styles.redirect}>Não tem conta ainda? Clique <Link to='/create-user'> aqui</Link> para criar.</p>
      <div className={globalStyles.messagesArea}>
        {showErrorMessage && (
          <h3 className={globalStyles.errorCard}>Credenciais inválidas</h3>
        )}
      </div>
    </div>
    </div>


)
}
export default Login