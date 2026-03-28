import { faFile, faFileExcel, faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import AttachmentList from '../AttachmentList';
import axiosInstance from '../../../axios';

const ImportFileForm = ({ onClose, type }) => {
    const hiddenFileInput = useRef(null);

    const handleClick = () => hiddenFileInput.current.click();

    const [attachments, setAttachments] = useState([]);

    // Handle file selection
    const maxFiles = 1; // or 5, 10, etc.
    // console.log('type', type)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAttachments([file]);

        e.target.value = null;
    };
    console.log(attachments)
    const [uploading, setUploading] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!attachments.length) {
            alert('Please select a file');
            return;
        }
        setUploading(true)
        try {
            const formData = new FormData();
            formData.append('file', attachments[0]); // IMPORTANT
            if (type == 'department') {

                const res = await axiosInstance.post(
                    '/import/department',
                    formData);

                alert('Department imported successfully');
            }
            else if (type == 'expense') {
                const res = await axiosInstance.post(
                    '/import/expense',
                    formData);

                alert('expenses imported successfully');
            }
            setAttachments([]);
        } catch (error) {
            console.error(error)
        }
        finally {
            setUploading(false)
        }
    }


    return (
        <div>
            <form action="">
                <div className="flex justify-center items-center">
                    <div className="mt-3 w-3/5 rounded-lg border border-[#D1D1D1] h-36 flex justify-center items-center"
                        onClick={handleClick}
                    >
                        <div className="flex-col text-lg text-center">
                            <input type="file" className='hidden'
                                ref={hiddenFileInput}
                                onChange={handleFileChange}
                                accept=".xlsx,.xls,.csv" />
                            <FontAwesomeIcon icon={faFileExcel} className='text-5xl text-gray-800' />
                            <div className="">Choose File</div>

                        </div>

                    </div>

                </div>
                <AttachmentList
                    existingFiles={[]}
                    attachments={attachments}
                    removeExistingFile={() => { }}
                    removeNewFile={() => setAttachments([])} />
                <div className="mt-6 w-full text-center">
                    <button type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" onClick={handleSubmit}>{uploading ? 'Uploading..' : 'Upload'}</button>
                </div>

            </form>
        </div>
    )
}

export default ImportFileForm