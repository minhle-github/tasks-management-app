import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../auth/auth.service';
import { selectAllUsers, selectUserIds, useGetUsersQuery } from './users.service';

const UsersList = () => {
  const navigate = useNavigate();

  const { isLoading } = useGetUsersQuery();

  const [logout] = useLogoutMutation();

  const users = useAppSelector(selectAllUsers).toString();
  const ids = useAppSelector(selectUserIds).toString();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {isLoading ? (
        <p>"Loading..."</p>
        ) : (
          <>
            <div>{users}</div>
            <div>{ids}</div>
            <button type="button" onClick={handleLogout}>Log out</button>
          </>
        )
      }
    </>
  )
}

export default UsersList