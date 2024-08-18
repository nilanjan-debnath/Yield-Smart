import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { FaSearchengin } from "react-icons/fa6";
import { getStorage, uploadBytesResumable, getDownloadURL, ref, deleteObject } from "firebase/storage";
import { app } from '../firebase';
import imageCompression from 'browser-image-compression';


export default function Diagonasis() {
    const { currentUser } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imgProgress, setImgProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [output, setOutput] = useState('');
    const [outPutLoading, setOutPutLoading] = useState(false);

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
        console.log("image Loading true");
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("progress: ", Math.round(progress));
            setImgProgress(Math.round(progress));
        },
            (error) => {
                console.log("imageUplaod error: ", error);
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

    const deleteFirebaseImage = async (imgUrl) => {
        const storage = getStorage(app);
        const decodedUrl = decodeURIComponent(imgUrl);
        const fileName = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1).split('?')[0];

        console.log("file name is ", fileName);
        const storageRef = ref(storage, fileName);
        try {
            await deleteObject(storageRef);
            console.log("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const sendRequest = async () => {
        try {
            setOutPutLoading(true);
            setOutput('')
            const res = await fetch("http://localhost:5173/api/user/imageOuput", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageUrl
                }),
            });

            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setOutput(data.output);
            console.log("output: ", data.output);
            setFile(null);
            deleteFirebaseImage(imageUrl);
            setFile(null);
        } catch (error) {
            console.log(error.message);
        } finally {
            setOutPutLoading(false);
        }
    }

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
            <div className="w-full flex flex-col items-center py-8 px-4 min-h-[52svh]">
                {(imgProgress > 0 && imgProgress < 100) && (
                    <div className="w-[25rem] h-[15rem] rounded-md relative overflow-hidden">
                        <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center bg-[#01D2A8] z-50">
                            <div className="border-8 border-t-8 border-t-white border-gray-300 w-16 h-16 rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}
                {(imgProgress === 0 || imgProgress === 100) && (
                    <div onClick={() => fileRef.current.click()} className=" h-[15rem] rounded-md overflow-hidden sm:w-[25rem]">
                        <img src={imageUrl || "https://firebasestorage.googleapis.com/v0/b/yield-smart-web.appspot.com/o/website%20image%2FGroup%2015.png?alt=media&token=d460bb38-7019-4808-b143-3885bbb62dd7"} alt="" className="w-full h-full object-contain cursor-pointer" />
                    </div>
                )}
                <input ref={fileRef} onChange={(e) => setFile(e.target.files[0])} type="file" hidden accept='image/*' />
                <button onClick={sendRequest} className="flex items-center gap-2 bg-[#12CC94] text-white px-4 py-2 rounded-md font-semibold my-4 transition-all duration-300 hover:bg-[#0caa7b]"><FaSearchengin className='text-2xl' />Quick Search</button>
            </div>

            {(output.length > 0 || outPutLoading) && (
            <div className="px-3 min-h-[38svh] py-4 flex justify-center items-start border border-black sm:px-8 lg:items-center">
                <div className="flex justify-start my-2 w-[40rem]">
                    <div className="outputBox w-full p-4 bg-[#9effe2] rounded-xl">
                        {output === '' ?
                            <div className='w-full h-24 animate-pulse'>
                                <div className="w-full h-6 bg-gradient-to-r from-cyan-200 to-blue-400 my-2 rounded-lg"></div>
                                <div className="w-full h-6 bg-gradient-to-r from-cyan-200 to-blue-400 my-2 rounded-lg"></div>
                                <div className="w-[60%] h-6 bg-gray-400 my-2 rounded-lg"></div>
                            </div> : <pre className='whitespace-normal break-words'>
                                {output}
                            </pre>
                        }
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
