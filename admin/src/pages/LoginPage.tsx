import { SignIn } from "@clerk/react"


const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
    <SignIn />
    </div>
  )
}

export default LoginPage