import { useRef } from 'react';
import classes from './profile-form.module.css';

function ProfileForm({ onChangePassword }) {
  const oldPassRef = useRef();
  const newPassRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    const oldPassword = oldPassRef.current.value;
    const newPassword = newPassRef.current.value;

    // TODO: Add validations

    onChangePassword({
      oldPassword,
      newPassword
    });

  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPassRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' id='old-password' ref={oldPassRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
