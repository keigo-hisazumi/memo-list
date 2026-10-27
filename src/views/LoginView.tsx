import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/shared/components/LoginPage'

export default function LoginView() {
  const navigate = useNavigate()
  const { register, login } = useAuth()

  return (
    <LoginPage
      appName="MemoList"
      tagline="シンプルで使いやすいメモアプリ"
      onLogin={login}
      onSignup={register}
      onSuccess={() => navigate('/')}
    />
  )
}
