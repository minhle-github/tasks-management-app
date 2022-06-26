import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFormInput from "../../../../hooks/useFormInput";
import { useRegisterMutation } from "../../auth.service";
import styles from '../Form.module.scss';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const NAME_REGEX = /^[A-z][A-z\s]{0,23}$/

const Register = () => {
  const errParagraph = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  
  const {value: firstname, formAttributeObj: firstnameAttribs, reset: resetFirstname, valid: validFirstname} = useFormInput(useState(''), NAME_REGEX);
  const {value: lastname, formAttributeObj: lastnameAttribs, reset: resetLastname, valid: validLastname} = useFormInput(useState(''), NAME_REGEX);
  const {value: email, formAttributeObj: emailAttribs, reset: resetEmail, valid: validEmail} = useFormInput(useState(''), EMAIL_REGEX);
  const {value: username, formAttributeObj: userAttribs, reset: resetUsername, valid: validUsername} = useFormInput(useState(''), USER_REGEX);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const [register, {isLoading}] = useRegisterMutation();

  const reset = () => {
    resetFirstname();
    resetLastname();
    resetUsername();
    resetEmail();
    setPassword('');
    setConfirmPassword('');
  }

  useEffect(() => {
    setErrMsg('');
  }, [username, password, confirmPassword, firstname, lastname, email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setMatchPassword(password === confirmPassword);
  }, [password, confirmPassword]);

  const valid = validUsername && validPassword && matchPassword && validEmail && validFirstname && validLastname && !isLoading;

  const handleFormSubmitted = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await register({username, password, email, firstname, lastname}).unwrap();
      reset();
      navigate('/login');
    } catch (err: any) {
      if (!err?.originalStatus) {
        setErrMsg('No Server Response');
      } else if (err.originalStatus === 400) {
        setErrMsg('Missing somefields');
      } else if (err.originalStatus === 409) {
        setErrMsg('Username exists already');
      } else {
        setErrMsg('Register failed');
      }
      if (errParagraph && errParagraph.current) errParagraph.current.focus();
    }
  }
  const handlePasswordChanged = (e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value);
  const handleConfirmPwdChanged = (e: React.FormEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value);

  const content = isLoading ? <h1>Loading...</h1> : (
    <div className={styles.form}>
      <section className={styles.formMain}>
        <h1 className={styles.formHeader}>Register</h1>
        <form className={styles.formBody} onSubmit={handleFormSubmitted}>
          <div className={styles.txtField}>
            <input 
              type="text"
              id="username"
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
              onChange={handlePasswordChanged}
              required
            />
            <span></span>
            <label htmlFor="password">Password:</label>
          </div>
          <div className={styles.txtField}>
            <input 
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={handleConfirmPwdChanged}
              required
            />
            <span></span>
            <label htmlFor="confirm_password">Confirm password:</label>
          </div>
          <div className={styles.txtField}>
            <input 
              type="email"
              id="email"
              {...emailAttribs}
              required
            />
            <span></span>
            <label htmlFor="email">Email:</label>
          </div>
          <div className={styles.txtField}>
            <input 
              type="text"
              id="firstname"
              {...firstnameAttribs}
              required
            />
            <span></span>
            <label htmlFor="firstname">Firstname:</label>
          </div>
          <div className={styles.txtField}>
            <input 
              type="text"
              id="lastname"
              {...lastnameAttribs}
              required
            />
            <span></span>
            <label htmlFor="lastname">Lastname:</label>
          </div>
          <button className={`${styles.formBtn} btnFancyPrimary`} disabled={!valid}>Sign In</button>
          <p className={styles.loginLink}>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </section>
    </div>
  )

  return content;
}

export default Register