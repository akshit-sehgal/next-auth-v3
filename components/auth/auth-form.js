import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import classes from './auth-form.module.css';

const createUser = async (email, password) => {
  const resp = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email, password
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || 'Something went wrong!')
  }
  return data;
};

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();


  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword
      });

      if(!result.error){
        router.replace('/profile');
      };

      return;
    }
    
    try {
      const result = await createUser(enteredEmail, enteredPassword);
      console.log(result);
    }
    catch (err) {
      console.log(err);
    }

  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
