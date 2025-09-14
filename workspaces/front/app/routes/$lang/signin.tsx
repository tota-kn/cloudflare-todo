import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { signIn, signUp } from "../../utils/auth-client"

/**
 * サインイン・サインアップタブページのコンポーネント
 * URLパラメータ{lang}に対応し、タブ切り替え機能を提供
 */
export default function SignInPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")

  // URLクエリパラメータからタブ状態を初期化
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setActiveTab("signup")
    } else {
      setActiveTab("signin")
    }
  }, [searchParams])

  /**
   * タブを切り替える関数
   * URLクエリパラメータも同期更新
   */
  const handleTabChange = (tab: "signin" | "signup") => {
    setActiveTab(tab)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("tab", tab)
    setSearchParams(newSearchParams)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* タブヘッダー */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("signin")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "signin"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange("signup")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "signup"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="transition-all duration-200">
          {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  )
}

/**
 * サインインフォームコンポーネント
 */
function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="max-w-md border rounded-lg shadow-sm">
      <div className="p-6 pb-0">
        <h1 className="text-lg md:text-xl font-semibold">Sign In</h1>
        <p className="text-xs md:text-sm text-gray-600">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="p-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="signin-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
              }}
              value={email}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="signin-password" className="text-sm font-medium">
                Password
              </label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>

            <input
              id="signin-password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="signin-remember"
              checked={rememberMe}
              onChange={() => {
                setRememberMe(!rememberMe)
              }}
              className="h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="signin-remember" className="text-sm font-medium">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              await signIn.email(
                {
                  email,
                  password,
                  callbackURL: "/",
                },
                {
                  onRequest: () => {
                    setLoading(true)
                  },
                  onResponse: () => {
                    setLoading(false)
                  },
                }
              )
            }}
          >
            {loading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <span>Login</span>
            )}
          </button>

          <div className="w-full gap-2 flex items-center justify-between flex-col">
            <button
              className="w-full gap-2 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              disabled={loading}
              onClick={async () => {
                await signIn.social(
                  {
                    provider: "google",
                    callbackURL: "/",
                  },
                  {
                    onRequest: () => {
                      setLoading(true)
                    },
                    onResponse: () => {
                      setLoading(false)
                    },
                  }
                )
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * サインアップフォームコンポーネント
 */
function SignUpForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * 画像ファイルの変更を処理する関数
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="z-50 rounded-md rounded-t-none max-w-md border rounded-lg shadow-sm">
      <div className="p-6 pb-0">
        <h1 className="text-lg md:text-xl font-semibold">Sign Up</h1>
        <p className="text-xs md:text-sm text-gray-600">
          Enter your information to create an account
        </p>
      </div>
      <div className="p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="signup-first-name"
                className="text-sm font-medium"
              >
                First name
              </label>
              <input
                id="signup-first-name"
                placeholder="Max"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFirstName(e.target.value)
                }}
                value={firstName}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="signup-last-name" className="text-sm font-medium">
                Last name
              </label>
              <input
                id="signup-last-name"
                placeholder="Robinson"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLastName(e.target.value)
                }}
                value={lastName}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="signup-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
              }}
              value={email}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              placeholder="Password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="signup-password-confirmation"
              className="text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              id="signup-password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirmation(e.target.value)
              }
              autoComplete="new-password"
              placeholder="Confirm Password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="signup-image" className="text-sm font-medium">
              Profile Image (optional)
            </label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <input
                  id="signup-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {imagePreview && (
                  <button
                    type="button"
                    className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                image: image ? await convertImageToBase64(image) : "",
                callbackURL: "/",

                fetchOptions: {
                  onResponse: () => {
                    setLoading(false)
                  },
                  onRequest: () => {
                    setLoading(true)
                  },
                  onError: (ctx) => {
                    console.error("Sign up error:", ctx.error.message)
                  },
                  onSuccess: async () => {
                    window.location.href = "/dashboard"
                  },
                },
              })
            }}
          >
            {loading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              "Create an account"
            )}
          </button>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Secured by <span className="text-orange-400">better-auth.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * ファイルをBase64文字列に変換する関数
 */
async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
