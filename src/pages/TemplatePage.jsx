import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTemplateDetails, saveToCollection, saveToFavourites } from "../api";
import MainSpinner from "../components/MainSpinner";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import { TemplateDesign } from "../components";

const TemplatePage = () => {
  const { templateID } = useParams();
  const navigate = useNavigate();
  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );
  const { data: user, refetch: userRefetch } = useUser();
  const { data: templates, refetch: templatesRefetch } = useTemplates();
  if (isLoading) {
    return <MainSpinner />;
  }
  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Something went Wrong...Please try again later.
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
          onClick={() => navigate("/", { replace: true })}
        >
          Home
        </button>
      </div>
    );
  }
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  };
  const addToFavourite = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    refetch();
    templatesRefetch();
  };
  return (
    <div className="w-fullflex flex-col items-center justify-start px-4 py-12">
      {/* breadcrumb */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p>/</p>
        <p>{data.name}</p>
      </div>
      {/* template details */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/* load the temp image */}
          <img
            className="w-full h-auto object-contain rounded-md"
            src={data?.imageUrl}
            alt={data?.name}
          />
          {/* load the temp description */}
          <div className="w-full flex flex-col gap-2 items-start justify-start">
            {/* title section */}
            <div className="w-full flex items-start justify-between">
              {/* title */}
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {/* likes */}
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-red-500 text-base" />
                  <p className="text-base font-semibold text-txtPrimary">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>
            {user && (
              <div className="w-full flex gap-4 items-start justify-start">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Remove from Collection"
                      : "Add to Collection"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  onHandle={addToCollection}
                />
                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Remove from Favorite"
                      : "Add to Favorite"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFavourite}
                />
              </div>
            )}
          </div>
        </div>
        {/* right section */}
        <div className="col-span-1 lg:col-span-4 flex flex-col items-center justify-start px-3 gap-6">
          {/* discover more */}
          <div
            className="w-full h-72 rounded-md overflow-hidden object-fill relative"
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2012/03/01/00/55/flowers-19830_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 flex items-center justify-center">
              <Link
                to={"/"}
                className="text-white border-2 border-gray-50 px-4 py-2 rounded-md"
              >
                Discover More
              </Link>
            </div>
          </div>
          {/* edit section */}
          {user && (
            <Link
              className="flex items-center justify-center bg-emerald-500 w-full cursor-pointer rounded-md px-4 py-3"
              to={`/resume/${data?.name}/?templateID=${templateID}`}
            >
              <p className="text-white font-semibold text-lg">
                Edit this template
              </p>
            </Link>
          )}
          {/* tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            {data?.tags?.map((tag, index) => (
              <p
                key={index}
                className="text-xs text-txtPrimary border-gray-300 border px-2 py-1 rounded-md whitespace-nowrap"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
      {templates?.filter((template) => template._id !== data._id)?.length >
        0 && (
        <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-txtDark">
            You might also like
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <React.Fragment>
              <AnimatePresence>
                {templates
                  ?.filter((template) => template._id !== data._id)
                  .map((template, index) => (
                    <TemplateDesign
                      index={index}
                      key={template._id}
                      data={template}
                    />
                  ))}
              </AnimatePresence>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  return (
    <div
      className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:shadow-md hover:bg-gray-300 cursor-pointer"
      onClick={onHandle}
    >
      <Icon className="text-txtPrimary text-lg" />
      <p className="text-txtPrimary whitespace-nowrap">{label}</p>
    </div>
  );
};

export default TemplatePage;
