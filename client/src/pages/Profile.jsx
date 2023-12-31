import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { app } from '../firebase';
import AVATAR_DEFAULT from '../assets/avatar.jpg';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOut,
} from '../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector(
    (state) => state.user,
  );
  const fileRef = useRef();
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(
      storageRef,
      image,
    );
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred /
            snapshot.totalBytes) *
          100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) =>
            setFormData({
              ...formData,
              avatar: downloadURL,
            }),
        );
      },
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `/api/user/update/${user._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      console.log(data);
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `/api/user/delete/${user._id}`,
        {
          method: 'DELETE',
        },
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log('signout error: ', error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-4xl text-center my-8'>
        Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={
            formData.avatar || user.avatar || AVATAR_DEFAULT
          }
          alt='avatar'
          className='w-24 h-24 self-center cursor-pointer rounded-full object-cover'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Uploading Image Error: file size less than 2MB
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>
              Image Uploaded successfully!
            </span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          id='username'
          defaultValue={user.username}
          className='bg-gray-100 rounded-md p-3'
          placeholder='username'
          onChange={handleChange}
        />
        <input
          type='email'
          id='email'
          defaultValue={user.email}
          className='bg-gray-100 rounded-md p-3'
          placeholder='email'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          className='bg-gray-100 rounded-md p-3'
          placeholder='password'
          onChange={handleChange}
        />
        <button className='bg-gray-300 text-white p-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200'>
          {isLoading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex mt-4 justify-between'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-500 cursor-pointer'
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className='cursor-pointer'
        >
          Sign out
        </span>
      </div>
      {error && (
        <p className='text-red-700 mt-4'>
          Something went wrong.
        </p>
      )}
      {updateSuccess && (
        <p className='text-green-700 mt-4'>
          Updated successfully.
        </p>
      )}
    </div>
  );
}
