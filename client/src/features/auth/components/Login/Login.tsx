import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { persitor } from "../../../../app/store";
import useFormInput from "../../../../hooks/useFormInput";
import { useLoginMutation } from "../../auth.service";
import styles from '../Form.module.scss';

const Login = () => {
  const userInput = useRef<HTMLInputElement>(null);
  const errParagraph = useRef<HTMLParagraphElement>(null);
  const {value: username, formAttributeObj: userAttribs, reset: resetUsername} = useFormInput(useState(''));
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist') as string) as boolean || false);

  const [login, { isLoading }] = useLoginMutation();

  const valid = username && password && !isLoading;

  useEffect(() => {
    if (userInput && userInput.current) userInput.current.focus()
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleFormSubmitted = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await login({username, password}).unwrap();

      resetUsername();
      setPassword('');

      navigate("/users");
    } catch (err: any) {
      if (!err?.originalStatus) {
        setErrMsg('No Server Response');
      } else if (err.originalStatus === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.originalStatus === 401) {
        setErrMsg('Username or password invalid');
      } else {
        setErrMsg('Login failed');
      }
      if (errParagraph && errParagraph.current) errParagraph.current.focus();
    }
  }

  const handlePasswordInputChanged = (e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value);

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    if (!persist) {
      persitor.pause();
    } else {
      persitor.persist();
    }
  }, [persist])

  const content = isLoading ? <h1>Loading...</h1> : (
    <div className={styles.form}>
      <section className={styles.formMain}>
        <h1 className={styles.formHeader}>Login</h1>
        <form className={styles.formBody} onSubmit={handleFormSubmitted}>
          <div className={styles.txtField}>
            <input 
              type="text"
              id="username"
              ref={userInput}
              {...userAttribs}
              autoComplete="off"
              required
            />
            <span></span>
            <label htmlFor="usernname">Username:</label>
          </div>
          <div className={styles.txtField}>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordInputChanged}
              required
            />
            <span></span>
            <label htmlFor="password">Password:</label>
          </div>
          <button className={`${styles.formBtn} btnFancyPrimary`} type="submit" disabled={!valid as boolean}>Sign In</button>
          <label htmlFor="persist">Trust this device </label>
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <p className={styles.loginLink}>Already have an account? <Link to="/register">Sign up</Link></p>
        </form>
      </section>
    </div>
  )

  return content;
}

export default Login;