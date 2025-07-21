export default function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">Couple Login</h1>

      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="forgot-password">
        <a href="#">Forgot your password?</a>
      </p>
    </div>
  );
}

// all this is skeleton code - feel free to modify the structure, content and styles as needed