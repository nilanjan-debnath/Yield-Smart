import React, { useEffect, useRef, useState } from 'react'
import { VscSend } from "react-icons/vsc";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { IoImageOutline } from "react-icons/io5";

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { addDoc, collection, getFirestore, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc, query, orderBy } from "firebase/firestore";

import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { useDispatch } from 'react-redux';
import { conversationIdFailure, conversationIdSuccess } from '../redux/conversationId/conversationSlice';
import ShowMessage from '../components/ShowMessage';
import imageCompression from 'browser-image-compression';
import ChatHeader from '../components/ChatHeader';

export default function Chat() {

    const [inputMessage, setInputMessage] = useState('');
    const fileRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUpload, setImageUpload] = useState(0);
    const [imageUploadError, setImageUploadError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const { currentConversationId } = useSelector((state) => state.conversation)
    const [conversationId, setConversationId] = useState(currentConversationId);
    const [conversationData, setConversationData] = useState(null);
    const [messageLoading, setMessageLoading] = useState(false);
    const [allChat, setAllChat] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [edit, setEdit] = useState(null);
    const [imagePop, setImagePop] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const leftDivRef = useRef(null);

    const divRef = useRef(null);
    const dispatch = useDispatch();
    const db = getFirestore(app);

    useEffect(() => {
        if (imageFile && imageFile.size <= 2000000) {
            setImagePop(true);
            handleImageUpload(imageFile);
        } else if (imageFile && imageFile.size > 2000000) {
            console.log("image size is bigger")
            handleImgCompress(imageFile).then((compressedFile) => {
                handleImageUpload(compressedFile);
            });
        }
    }, [imageFile]);

    const handleImageUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUpload(Math.round(progress));
        },
            (error) => {
                setImageUploadError(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageUrl(downloadUrl);
                });
            },
        );
    };

    const handleSend = async () => {
        if (!currentUser) return;

        try {
            setMessageLoading(true);
            dispatch(conversationIdSuccess(conversationId));
            const userDocRef = doc(db, 'users', currentUser._id);
            const userDoc = await getDoc(userDocRef);

            setAllChat((prev) => [
                ...prev,
                {
                    input: inputMessage,
                    image: imageUrl,
                    output: '',
                    datetime: showDateTime(),
                }
            ]);

            const textMessage = {
                input: inputMessage,
                output: '',
                image: imageUrl,
                datetime: showDateTime(),
            };

            setInputMessage('');
            setImageUpload(0);
            setImageFile(null);
            setImagePop(true);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                let conversationDocRef;

                if (userData.conversations && userData.conversations.includes(conversationId)) {
                    conversationDocRef = doc(db, 'conversations', conversationId);
                    await updateDoc(conversationDocRef, {
                        texts: arrayUnion(textMessage),
                    });
                } else {
                    conversationDocRef = doc(db, 'conversations', conversationId);
                    await setDoc(conversationDocRef, {
                        conversation_name: "default_conversation",
                        texts: [textMessage],
                        timestamp: serverTimestamp(),
                    });

                    await updateDoc(userDocRef, {
                        conversations: arrayUnion(conversationId),
                    });
                }
            } else {
                const conversationDocRef = doc(db, 'conversations', conversationId);
                await setDoc(conversationDocRef, {
                    conversation_name: "default_conversation",
                    texts: [textMessage],
                    timestamp: serverTimestamp(),
                });

                await setDoc(userDocRef, {
                    name: currentUser.username,
                    uid: currentUser._id,
                    conversations: [conversationId],
                    timestamp: serverTimestamp(),
                });
            }

            await handleInputAnswer();
            // setInputMessage('');
            setImageFile(null);
            setImageUrl('');
            console.log("done");
        } catch (error) {
            console.log(error);
            setMessageLoading(false);
            dispatch(conversationIdFailure(error));
        }
    };

    useEffect(() => {
        const handleConversationId = () => {
            if (conversationId === null) {
                try {
                    const uniqId = uuidv4();
                    console.log("id is given");
                    setConversationId(uniqId);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        handleConversationId();
    }, []);

    useEffect(() => {
        const fetchPrevConversation = async () => {
            if (!currentUser) return;
            try {
                const userDocRef = doc(db, 'users', currentUser._id);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (!conversationData || conversationData.length !== userData.conversations.length) {
                        const reversedConversations = userData.conversations.slice().reverse();
                        setConversationData(reversedConversations);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPrevConversation();
    }, [handleSend]);

    const handleChangeConversationId = (Id) => {
        try {
            dispatch(conversationIdSuccess(Id));
            setConversationId(Id);
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            dispatch(conversationIdFailure(error));
        }
    };

    const createNewChat = () => {
        try {
            const uniqId = uuidv4();
            console.log("chat id is given");
            setConversationId(uniqId);
            setAllChat([]);
            dispatch(conversationIdSuccess(uniqId));
        } catch (error) {
            console.log(error);
            dispatch(conversationIdFailure(error));
        }
    }

    useEffect(() => {
        const fetchConversationMessage = async () => {
            if (!currentConversationId) return;
            try {
                setFetchLoading(true);
                const messageDocRef = doc(db, 'conversations', conversationId);
                const messageDoc = await getDoc(messageDocRef);
                if (messageDoc.exists()) {
                    const messageData = messageDoc.data();
                    setAllChat(messageData.texts);
                }
                setFetchLoading(false);
            } catch (error) {
                console.log(error);
                setFetchLoading(false);
            }
        };
        fetchConversationMessage();
    }, [conversationId]);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        }
    }, [allChat]);

    const handleInputAnswer = async () => {
        try {
            const res = await fetch("/api/user/output", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: conversationId,
                    index: (edit === null ? allChat.length : edit),
                }),
            });
            console.log("edit index: ", edit);
            console.log("conversationId: ", conversationId);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                setMessageLoading(false);
                return;
            }
            setAnswer(data.output);
            setMessageLoading(false);
            setEdit(null);
            console.log("bot output: ", data.output);
            setAllChat((prev) => {
                const newChat = [...prev];
                if (edit === null) {
                    newChat[newChat.length - 1].output = data.output;
                } else {
                    newChat[edit].output = data.output;
                }
                return newChat;
            })
        } catch (error) {
            console.log("Bot error: ", error);
            setMessageLoading(false);
        }
    };

    const showDateTime = () => {
        const date = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }

        const formatedDateTime = date.toLocaleString('en-us', options);
        return formatedDateTime;
    };

    const handleClickOutside = (event) => {
        if (window.innerWidth < 768 && leftDivRef.current && !leftDivRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        <div className='w-full h-[100dvh]'>
            <div className="flex w-full h-[100dvh] relative overflow-hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden absolute top-20 right-1 p-1 bg-gray-200 rounded-full z-30">{isOpen ? <RxCross2 className='text-2xl' /> : <IoIosMenu className='text-2xl' />}</button>
                <div ref={leftDivRef} className={`sideLeft absolute top-0 w-[70%] h-full py-3 flex items-center flex-col overflow-y-auto border-r-4 border-gray-300 z-40 bg-[#F1F6F5] transition-all duration-500 md:static sm:w-[60%] md:w-[30%] xl:w-[20%] 2xl:w-[15%] ${isOpen ? 'left-0' : '-left-[100%]'} scrollbar-custom`}>
                    <button onClick={createNewChat} className="px-4 py-2 bg-[#12c992] text-white rounded-md w-[90%] h-10">New Chat</button>
                    <div className="w-full flex flex-col items-center gap-3 my-4 scrollbar-custom overflow-y-auto">
                        <h3 className="w-[90%] px-1 font-semibold mt-2 text-gray-600 text-sm">All Chats</h3>
                        {(conversationData && !conversationData.includes(conversationId)) &&
                            <div className="w-[90%] h-10 border bg-white rounded-lg overflow-hidden">
                                <button onClick={() => handleChangeConversationId(conversationId)} className={`truncate px-4 py-2 w-full transition-all duration-300 bg-blue-100`}>{conversationId}</button>
                            </div>}
                        {conversationData && (
                            conversationData.map((ele) => (
                                <div key={ele} className="w-[90%] h-10 border bg-[#F1F6F5] rounded-lg overflow-hidden">
                                    <button onClick={() => handleChangeConversationId(ele)} className={`truncate px-4 py-2 w-full transition-all duration-300 hover:bg-blue-200 ${ele === conversationId ? 'bg-blue-200' : ''}`}>{ele}</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="sideRight w-full h-full relative md:w-[70%] xl:w-[80%] 2xl:w-[85%]">
                    <ChatHeader />
                    <div ref={divRef} className={`body w-full h-[76%] px-2 py-4 overflow-y-auto scrollbar-custom lg:px-32 transition-all duration-500 bg-[#F1F6F5] ${isOpen ? 'opacity-60' : ''}`}>
                        {fetchLoading && (
                            <div className="w-full h-screen absolute left-0 top-0 flex justify-center items-center bg-[#01D2A8] z-50">
                                <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full w-16 h-16 animate-spin"></div>
                            </div>
                        )}
                        {(!fetchLoading && allChat.length) === 0 && (
                            <div style={{ alignItems: "inherit" }} className="w-full h-full flex flex-col justify-center textImage">
                                <h1 className="text-[5rem] font-semibold px-4 sm:px-8 leading-none lg:px-0 text-center lg:text-start">Hello,</h1>
                                <h1 className="text-6xl lg:text-5xl lg:px-0 xl:text-6xl 2xl:text-[5rem] font-semibold px-4 sm:px-8 py-2 text-center lg:text-start">How can I help you today?</h1>
                            </div>
                        )}
                        {(!fetchLoading && allChat.length != 0) && allChat.map((chat, index) =>
                            <ShowMessage key={index} data={chat} index={index} setEdit={setEdit} conversationId={conversationId} showDateTime={showDateTime} db={db} setAllChat={setAllChat} handleInputAnswer={handleInputAnswer} isOpen={isOpen} />
                        )}

                    </div>
                    <div className="footer w-full h-[15%] border-t-4 border-gray-200 flex flex-col items-center relative">
                        {(imageFile && imagePop) && (
                            <div className="ImagePopUp absolute -top-[12rem] left-[50%] -translate-x-[50%] bg-white h-[12rem] z-50 px-4 py-2 flex items-center justify-center sm:px-8 md:px-4 shadow-xl rounded-xl lg:-top-[15rem] lg:h-[15rem]">
                                <div className="w-full relative">
                                    <button onClick={() => setImagePop(false)} className="p-1 bg-gray-100 rounded-full float-end transition-all duration-300 hover:bg-gray-50 absolute top-0 right-0">
                                        <RxCross2 className='text-2xl' />
                                    </button>
                                    <div className="flex justify-center items-center rounded-lg w-[15rem] h-[10rem] bg-white lg:w-[20rem] lg:h-[13rem]">
                                        <img src={URL.createObjectURL(imageFile)} alt="" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="w-full h-6 overflow-hidden flex items-center">
                            {imageUploadError && (
                                <p className="text-red-600 font-semibold px-4 sm:px-8">Image upload error(uploaded image size should be less than 2MB)</p>
                            )}
                            {(imageUpload > 0 && imageUpload < 100) && (
                                <p className="text-green-400 font-semibold px-4 sm:px-8">{`File uploaded ${imageUpload}%`}</p>
                            )}
                            {(!imageUploadError && imageUpload === 100) && (
                                <p className="text-green-400 font-semibold px-4 sm:px-8">File uploaded successfully</p>
                            )}
                        </div>
                        <div className="flex bg-white w-full px-2 gap-1 sm:px-6 sm:gap-3">
                            <input ref={fileRef} onChange={(e) => setImageFile(e.target.files[0])} type="file" hidden accept='image/*' />
                            <input disabled={messageLoading} onChange={(e) => setInputMessage(e.target.value)} placeholder='Ask some thing?' className='px-4 py-2 rounded-md outline-none border border-black w-[88%]' value={inputMessage}></input>
                            <button disabled={messageLoading || isOpen} onClick={() => fileRef.current.click()} className={`p-3 transition-all duration-300 bg-gray-100  rounded-full ${isOpen ? '' : 'hover:bg-gray-300'}`}><IoImageOutline className='text-2xl' /></button>
                            <button disabled={messageLoading || inputMessage == '' || isOpen} onClick={handleSend} className="px-4 w-auto py-1 rounded-md bg-[#12c992] text-white flex justify-center items-center disabled:bg-[#2EECB3] sm:w-16 sm:py-2">
                                {messageLoading ? <div className="animate-spin h-7 w-7 border-4 border-t-4 border-t-white border-gray-300 rounded-full" ></div> : <VscSend className='text-xl sm:text-2xl' />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
