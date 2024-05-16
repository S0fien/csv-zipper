import ErrorMessage from "./ErrorMessage.tsx";
import React, { useContext } from "react";
import { FileContext } from "../context/FileContext.ts";

const FormFeedback = () => {
  const [context] = useContext(FileContext);
  const { isUploading, error, isAwaitingServer} = context
  if (!isUploading && !error && isAwaitingServer)
      return (
      <div>
        <p className="ant-upload-text">We've successfully downloaded your file.</p>
        <p className="ant-upload-hint">Your file is now up to compression...</p>
      </div>
    )
if (isUploading)
  return (
  <div>
    <p className="ant-upload-text">You're uploading your file to our server.</p>
    <p className="ant-upload-hint">A Loader should appear...</p>
  </div>
)
 if (error)
 return <ErrorMessage message={error.message} />
}

export default FormFeedback