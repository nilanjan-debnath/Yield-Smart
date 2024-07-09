import React, { useEffect, useRef, useState } from 'react'
import { VscSend } from "react-icons/vsc";
import { MdOutlineAttachFile } from "react-icons/md";

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { addDoc, collection, getFirestore, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";

import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { useDispatch } from 'react-redux';
import { conversationIdFailure, conversationIdSuccess } from '../redux/conversationId/conversationSlice';

export default function Chat() {

    const [inputMessage, setInputMessage] = useState('');
    console.log(inputMessage);
    const [chatData, setChatData] = useState({
        input: '',
        image: '',
        output: ''
    });
    const fileRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUpload, setImageUpload] = useState(0);
    const [imageUploadError, setImageUploadError] = useState(null);
    // console.log(imageUrl);
    const { currentUser } = useSelector((state) => state.user);
    const {currentConversationId} = useSelector((state) => state.conversation)
    const [conversationId, setConversationId] = useState( currentConversationId);
    console.log("conversationid: ", conversationId);
    console.log("currentConversation: ", currentConversationId);

    const dispatch = useDispatch();
    const db = getFirestore(app);

    const chat = {
        "input": "What is the name of this tree?",
        "output": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim aperiam doloremque maxime dolorem fugit, aut assumenda commodi culpa dignissimos velit."
    }

    useEffect(() => {
        if (imageFile) {
            handleImageUpload(imageFile);
        }
    }, [imageFile]);

    const handleImageUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`file upload progress is ${progress}%`);
            setImageUpload(Math.random(progress));
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

    // [...userDoc.data().conversation[0].texts, message]

    const handleSend = async () => {
        if (!currentUser) return;
        
        try {
            dispatch(conversationIdSuccess(conversationId));
            const userDocRef = doc(db, 'users', currentUser._id);
            const userDoc = await getDoc(userDocRef);
    
            const textMessage = {
                input: inputMessage,
                output: '',
                file: imageUrl,
            };
    
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
    
            setInputMessage('');
            setImageFile(null);
            console.log("done");
        } catch (error) {
            console.log(error);
            dispatch(conversationIdFailure(error));
        }
    };

    useEffect(() => {
        const handleConversationId = () => {
            if(conversationId === null){
                try{
                    const uniqId = uuidv4();
                    console.log("id is given");
                    setConversationId(uniqId);
                }catch(error){
                    console.log(error);
                }
            }
        };
        handleConversationId();
    }, []);
    

    return (
        <div className='w-full h-[92vh]'>
            <div className="flex w-full h-[92vh]">
                <div className="sideLeft w-[15%] bg-green-600 h-full"></div>
                <div className="sideRight w-[85%] bg-yellow-300 h-full">
                    <div className="header w-full h-[85%] bg-red-500"></div>
                    <div className="footer w-full h-[15%] bg-blue-500 flex justify-center items-start">
                        <div className="flex bg-white w-full px-6 justify-end gap-3 relative">
                            <input ref={fileRef} onChange={(e) => setImageFile(e.target.files[0])} type="file" hidden accept='image/*' />
                            <input onChange={(e) => setInputMessage(e.target.value)} placeholder='Ask some thing?' className='px-4 py-2 rounded-md outline-none border border-black w-[88%]' value={inputMessage}></input>
                            <button onClick={() => fileRef.current.click()} className="p-3 transition-all duration-300 hover:bg-gray-300 rounded-full"><MdOutlineAttachFile className='text-2xl' /></button>
                            <button onClick={handleSend} className="px-4 w-16 py-2 rounded-md bg-blue-500 text-white flex justify-center items-center"><VscSend className='text-2xl' /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
