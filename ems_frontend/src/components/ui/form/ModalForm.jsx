import React from 'react'

const ModalForm = ({
    form,
    errors,
    onChange,
    onSubmit,
    submitText = "Save"
}) => {
    
    return (
        <form className="w-3/4 mx-auto" onSubmit={onSubmit}>
            <div className="mb-4">
                <input
                    type="text"
                    name="name"
                    value={form.name || ""}
                    onChange={onChange}
                    placeholder="Enter name"
                    className="w-full p-2 rounded-md border border-[#989898]"
                />
                {errors?.name && (
                    <p className="text-red-500 text-sm">{errors.name[0]}</p>
                )}
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-[#3F3FF2] rounded-lg text-white"
            >
                {submitText}
            </button>
        </form>)
}

export default ModalForm