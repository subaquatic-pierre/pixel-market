interface IFileInputProps {
  setFile: React.Dispatch<any>;
  setFileError: React.Dispatch<any>;
}

const FileInput: React.FC<IFileInputProps> = ({ setFile, setFileError }) => {
  const handleChange = (fileInputEvent: any) => {
    const file = fileInputEvent.target.files[0];
    const fileType = "image/jpeg";

    if (file.type.match(fileType)) {
      setFile(file);
    } else {
      setFileError("File not supported!");
    }
  };

  return (
    <input
      accept="image/*"
      type="file"
      onChange={handleChange}
      style={{ display: "none" }}
    />
  );
};

export default FileInput;
