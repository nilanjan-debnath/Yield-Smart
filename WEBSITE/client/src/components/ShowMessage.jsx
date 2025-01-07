import React, { useEffect, useRef, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, uploadBytesResumable, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { FcEditImage } from "react-icons/fc";
import { app } from '../firebase';

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ShowMessage({ data, index, setEdit, conversationId, showDateTime, db, setAllChat, handleInputAnswer, isOpen }) {
    const [isShow, setIsShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [input, setInput] = useState(data.input);
    const imageRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(data.image);
    const [loading, setLoading] = useState(false);

    const handleMouseEnter = () => {
        setIsShow(!isShow);
    }

    const handleEdit = async () => {
        setEditShow(!editShow);
        console.log("index: ", index, input);
        setEdit(index);
    }

    const handleClose = () => {
        setEditShow(false);
        setInput(data.input);
        setEdit(null);
    }

    const handleSend = async () => {
        try {
            setLoading(true);
            const conversationRef = doc(db, 'conversations', conversationId);
            const conversationDoc = await getDoc(conversationRef);

            const newText = {
                input: input,
                image: imageUrl,
                output: '',
                datetime: showDateTime(),
            }

            if (conversationDoc.exists()) {
                const data = conversationDoc.data();
                if (index >= 0 && index < data.texts.length) {
                    data.texts[index] = newText;
                }
                await updateDoc(conversationRef, {
                    texts: data.texts
                });
            } else {
                console.log("doc not exist");
                setLoading(false);
            }

            setAllChat((prev) => {
                const newChat = [...prev];
                newChat[index] = newText;
                return newChat;
            })
            setLoading(false);
            setEditShow(false);
            setImageUrl('');
            setFile(null);
            await handleInputAnswer();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const uploadImageFirebase = async (file) => {
        setLoading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
            (error) => {
                console.log("image upload error", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageUrl(downloadUrl);
                    console.log(downloadUrl);
                    setLoading(false);
                    deleteFirebaseImage(data.image);
                });
            },
        );
    };

    useEffect(() => {
        if (file) {
            uploadImageFirebase(file);
        }
    }, [file]);

    const deleteFirebaseImage = async (imgUrl) => {
        const storage = getStorage(app);
        // Extracting the file name from the URL
        const decodedUrl = decodeURIComponent(imgUrl); // Decode the URL
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

    return (
        <div className='w-full p-2'>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseEnter} className={`flex justify-end items-center gap-2 relative ${editShow ? 'mb-12' : ''}`}>
                <button onClick={handleEdit} className={`w-10 h-10 flex justify-center items-center bg-blue-100 transition-all duration-300 rounded-full ${isShow ? 'opacity-100' : 'opacity-0'}`}><CiEdit className='text-xl' /></button>
                <div className="inputBox max-w-[80%] p-4 bg-[#2EECB3] rounded-xl my-2 sm:max-w-[60%]">
                    <pre className='whitespace-normal break-words'>
                        {data.input}
                    </pre>
                </div>
                <div className={`${editShow ? '' : 'hidden'} editBox absolute right-0 top-0 w-full h-full`}>
                    <textarea onChange={(e) => setInput(e.target.value)} id="" className='w-full h-full resize-none border border-blue-500 px-4 py-2 rounded-md bg-blue-200 outline-none' defaultValue={data.input}></textarea>
                    <div className="flex gap-2 float-end">
                        <button onClick={handleClose || isOpen} className="px-4 py-2 w-20 rounded-full border-blue-500 border-2 text-blue-500">Close</button>
                        <button disabled={loading || isOpen} onClick={handleSend} className="px-4 py-2 w-20 rounded-full bg-blue-500 text-white">{loading ? 'Saving..' : 'Send'}</button>
                    </div>
                </div>
            </div>
            {data.image != '' && (
                <div className="flex justify-end items-center gap-2 py-1">
                    <div className="w-36 h-36 overflow-hidden border-2 rounded-md relative">
                        <input ref={imageRef} onChange={(e) => setFile(e.target.files[0])} type="file" className="" hidden accept='image/*' />
                        <img src={imageUrl === '' ? data.image : imageUrl} alt="" className={`w-full h-full object-contain ${editShow ? 'opacity-80' : ''}`} />
                        <button disabled={isOpen} onClick={() => imageRef.current.click()} className={`absolute right-0 bottom-0 p-2 bg-gray-200 rounded-full ${editShow ? '' : 'hidden'}`}><FcEditImage className='text-xl' /></button>
                    </div>
                </div>
            )}
            <div className="flex justify-start my-2">
                <div className="outputBox max-w-[90%] p-4 bg-[#9EF4E6] rounded-xl sm:max-w-[80%]">
                    {data.output === '' ?
                        <div className='w-[64vw] h-24 animate-pulse sm:w-[52vw] md:w-[35vw] lg:w-[23vw] xl:w-[33vw] 2xl:w-[37rem]'>
                            <div className="w-full h-6 bg-gradient-to-r from-cyan-200 to-blue-400 my-2 rounded-lg"></div>
                            <div className="w-full h-6 bg-gradient-to-r from-cyan-200 to-blue-400 my-2 rounded-lg"></div>
                            <div className="w-[60%] h-6 bg-gray-400 my-2 rounded-lg"></div>
                        </div> : <pre className='whitespace-normal break-words' dangerouslySetInnerHTML={{ __html: data.output.replace(/\n/g, '<br>') }} />
                    }
                </div>
            </div>
        </div>
    )
}
