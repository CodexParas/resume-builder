import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { FaTrash, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { adminIds, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: null,
  });
  const [imageAsset, setimageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });
  const [selectedTags, setselectedTags] = useState([]);
  const {
    data: templatesData,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch,
  } = useTemplates();
  const { data: user, isLoading: userIsLoading } = useUser();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileSelect = async (e) => {
    setimageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const file = e.target.files[0];
    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setimageAsset((prev) => ({
            ...prev,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error("You are not authorized to upload files!");
          } else {
            toast.error(error.message);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageAsset((prev) => ({
              ...prev,
              uri: downloadURL,
            }));
          });
          toast.success("File uploaded successfully!");
          setInterval(() => {
            setimageAsset((prev) => ({ ...prev, isImageLoading: false }));
          }, 1000);
        }
      );
    } else {
      setimageAsset((prev) => ({ ...prev, isImageLoading: false }));
      toast.info("File format not allowed!");
    }
  };
  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };
  const deleteImage = async () => {
    setInterval(() => {
      setimageAsset((prev) => ({
        ...prev,
        uri: null,
        progress: 0,
        isImageLoading: false,
      }));
    }, 2000);
    const deleteRef = ref(storage, imageAsset?.uri);
    setimageAsset((prev) => ({ ...prev, isImageLoading: true }));
    deleteObject(deleteRef).then(() => {
      toast.success("File deleted successfully!");
    });
  };
  const handleSelectTags = (tag) => {
    if (selectedTags.includes(tag)) {
      // remove tag
      setselectedTags((prev) => prev.filter((item) => item !== tag));
    } else {
      // add tag
      setselectedTags([...selectedTags, tag]);
    }
  };
  const pushToCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageUrl: imageAsset.uri,
      tags: selectedTags,
      name:
        templatesData && templatesData.length > 0
          ? `Template${templatesData.length + 1}`
          : `Template1`,
      timeStamp,
    };
    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prev) => ({ ...prev, title: "", imageUrl: null }));
        setselectedTags([]);
        setimageAsset((prev) => ({
          ...prev,
          uri: null,
          progress: 0,
          isImageLoading: false,
        }));
        templatesRefetch();
        toast.success("Template created successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageUrl);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template._id))
        .then(() => {
          toast.success("Template deleted successfully!");
          templatesRefetch();
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  };
  useEffect(() => {
    if (!userIsLoading && !adminIds.includes(user?.uid)) {
      navigate("/", { replace: true });
    }
  }, [user, userIsLoading]);
  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex flex-col items-center justify-start gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>
        {/* template id section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-txtLight uppercase text-base font-semibold">
            TempID :{" "}
          </p>
          <p className="text-txtDark text-sm font-bold capitalize">
            {templatesData && templatesData.length > 0
              ? `Template${templatesData.length + 1}`
              : `Template1`}
          </p>
        </div>
        {/* template name section */}
        <input
          type="text"
          name="title"
          placeholder="Template title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-md outline-none border border-gray-300 bg-transparent text-lg text-txtPrimary focus:text-txtDark focus:shadow-md"
        />
        {/* file uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col gap-4 items-center justify-center">
                <PuffLoader color="#498FCD" size={60} />
                <p className="text-xl">{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full h-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex flex-col items-center justify-center cursor-pointer gap-2">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtPrimary">
                          Click to Upload
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="h-full w-full overflow-hidden relative rounded-md">
                    <img
                      src={imageAsset?.uri}
                      alt="template"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {/* delete action */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-md flex items-center justify-center cursor-pointer"
                      onClick={deleteImage}
                    >
                      <FaTrash className="text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
        {/* tags */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, i) => (
            <div
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
              key={i}
              onClick={() => handleSelectTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>
        {/* save button */}
        <button
          type="button"
          className="w-full bg-blue-700 text-white rounded-md py-3"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>
      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 w-full px-2 flex-1 py-4">
        {templatesIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader color="#498FCD" size={60} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templatesData && templatesData.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {templatesData.map((template) => (
                    <div
                      className="w-full h-[500px] rounded-md overflow-hidden relative"
                      key={template._id}
                    >
                      <img
                        src={template?.imageUrl}
                        alt={template?.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-md flex items-center justify-center cursor-pointer"
                        onClick={() => removeTemplate(template)}
                      >
                        <FaTrash className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <PuffLoader color="#498FCD" size={60} />
                  <p className="text-2xl tracking-wider capitalize text-txtPrimary">
                    No Data
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
