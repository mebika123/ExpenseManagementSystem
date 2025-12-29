import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AttachmentList = ({
    existingFiles = [],
    attachments = [],
    removeExistingFile,
    removeNewFile,
}) => {
    const renderFileItem = ({ url, name, onRemove, key }) => (
        <li key={key} className="w-full">
            <div className="relative">
                <div className="flex border border-gray-300 items-center h-10 rounded-md px-6 shadow-xs shadow-indigo-200/50">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-center truncate"
                    >
                        {name}
                    </a>
                </div>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute top-0 bottom-0 m-auto right-2 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={onRemove}
                />
            </div>
        </li>
    );

    return (
        <div className="flex gap-2 mt-2 justify-center items-center w-full">
            {(existingFiles.length > 0 || attachments.length > 0) && (
                <ul className="mt-3 space-y-1 grid md:grid-cols-2 gap-3 w-full lg:w-4/5">

                    {/* Existing files from backend */}
                    {existingFiles.map((file) =>
                        renderFileItem({
                            key: `existing-${file.id}`,
                            url: `http://localhost:8000/storage/${file.path}`, 
                            name: file.filename,
                            onRemove: () => removeExistingFile(file.id),
                        })
                    )}

                    {/* Newly added files */}
                    {attachments.map((file, index) =>
                        renderFileItem({
                            key: `new-${index}`,
                            url: URL.createObjectURL(file),
                            name: file.name,
                            onRemove: () => removeNewFile(index),
                        })
                    )}

                </ul>
            )}
        </div>
    );
};

export default AttachmentList;
