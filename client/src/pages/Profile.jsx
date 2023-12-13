import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { app } from '../firebase';
import AVATAR_DEFAULT from '../assets/avatar.jpg';

export default function Profile() {
  const { currentUser } = useSelector(
    (state) => state.user,
  );
  const fileRef = useRef();
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-4xl text-center my-8'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={
            formData.avatar !== ''
              ? formData.avatar
              : currentUser.avatar !== ''
              ? currentUser.avatar
              : AVATAR_DEFAULT
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
          defaultValue={currentUser.username}
          className='bg-gray-100 rounded-md p-3'
          placeholder='username'
        />
        <input
          type='email'
          id='email'
          defaultValue={currentUser.email}
          className='bg-gray-100 rounded-md p-3'
          placeholder='email'
        />
        <input
          type='password'
          id='password'
          className='bg-gray-100 rounded-md p-3'
          placeholder='password'
        />
        <button className='bg-gray-300 text-white p-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200'>
          Update
        </button>
      </form>
      <div className='flex mt-4 justify-between'>
        <span className='text-red-500 cursor-pointer'>
          Delete Account
        </span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
}
