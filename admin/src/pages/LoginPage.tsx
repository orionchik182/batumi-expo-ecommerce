import { SignIn } from "@clerk/react"


const LoginPage = () => {
  return (
    <div className="hero h-screen">
    <SignIn />
    </div>
  )
}

export default LoginPage