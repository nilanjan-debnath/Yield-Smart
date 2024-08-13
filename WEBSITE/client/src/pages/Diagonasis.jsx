import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { FaSearchengin } from "react-icons/fa6";
import { getStorage, uploadBytesResumable, getDownloadURL, ref, } from "firebase/storage";
import { app } from '../firebase';
import imageCompression from 'browser-image-compression';


export default function Diagonasis() {
    const { currentUser } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (file && file.size <= 2000000) {
            handleUploadImage(file);
        } else if (file && file.size > 2000000) {
            console.log("image size is bigger")
            handleImgCompress(file).then((compressedFile) => {
                handleUploadImage(compressedFile);
            });
        }
    }, [file]);

    const handleUploadImage = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("progress: ", Math.round(progress));
        },
            (error) => {
                setImgUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageUrl(downloadUrl);
                });
            },
        );
    };

    const handleImgCompress = async (file) => {
        const imageFile = file;

        const options = {
            maxSizeMB: 1, // Compress to 1MB
            maxWidthOrHeight: imageFile.height, // Keep original height
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(imageFile, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };

    return (
        <div>
            <div className="w-full py-2 bg-[#9EFFE2] flex items-center justify-between px-4 border-b-2 border-[#4AD0DB] shadow-md sm:px-8">
                <Link to='/dashboard'>
                    <FaArrowLeftLong className='text-2xl' />
                </Link>
                <Link to='/profile'>
                    <div className="rounded-full overflow-hidden border-2 border-[#00623D] mx-2 w-10 sm:h-10">
                        <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
                    </div>
                </Link>
            </div>
            <div className="w-full flex flex-col items-center py-8 px-4 min-h-[92svh]">
                <div onClick={() => fileRef.current.click()} className="w-[25rem] h-[15rem] rounded-md">
                    <img src={imageUrl || "https://firebasestorage.googleapis.com/v0/b/yield-smart-web.appspot.com/o/website%20image%2FGroup%2015.png?alt=media&token=d460bb38-7019-4808-b143-3885bbb62dd7"} alt="" className="w-full h-full object-contain cursor-pointer" />
                </div>
                <input ref={fileRef} onChange={(e) => setFile(e.target.files[0])} type="file" hidden accept='image/*' />
                <button className="flex items-center gap-2 bg-[#12CC94] text-white px-4 py-2 rounded-md font-semibold my-4 transition-all duration-300 hover:bg-[#0caa7b]"><FaSearchengin className='text-2xl' />Quick Search</button>
            </div>
        </div>
    )
}
