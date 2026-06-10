import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function getErrorMessage(e: unknown): string {
  if (typeof e === 'object' && e !== null && 'code' in e) {
    switch ((e as { code: string }).code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'メールアドレスまたはパスワードが正しくありません'
      case 'auth/email-already-in-use':
        return 'このメールアドレスはすでに使用されています'
      case 'auth/weak-password':
        return 'パスワードは6文字以上にしてください'
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません'
      case 'auth/too-many-requests':
        return 'しばらくしてから再度お試しください'
    }
  }
  return 'エラーが発生しました。もう一度お試しください'
}

export default function LoginView() {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)
    try {
      if (isRegistering) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err) {
      setErrorMessage(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="app-title">MemoList</h1>
        <h2 className="form-title">{isRegistering ? '新規登録' : 'ログイン'}</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="6文字以上"
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading && <span className="loading-spinner"></span>}
            {isRegistering ? '登録する' : 'ログイン'}
          </button>
        </form>

        <button
          onClick={() => { setIsRegistering(r => !r); setErrorMessage('') }}
          className="btn-toggle"
        >
          {isRegistering ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントをお持ちでない方はこちら'}
        </button>
      </div>
      <style>{styles}</style>
    </div>
  )
}

const styles = `
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.app-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.form-title {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #444;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #667eea;
}

.error-message {
  font-size: 0.875rem;
  color: #e53935;
  text-align: center;
  padding: 0.5rem;
  background: #ffebee;
  border-radius: 6px;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #5a6fd6;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-toggle {
  display: block;
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: center;
  text-decoration: underline;
}

.btn-toggle:hover {
  color: #5a6fd6;
}
`
