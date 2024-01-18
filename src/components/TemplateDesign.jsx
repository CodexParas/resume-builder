import React, { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { fadeInOutWithOpacity, scaleInOut } from "../animations";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import { saveToCollection, saveToFavourites } from "../api";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesign = ({ data, index }) => {
  const [isHover, setIsHover] = useState(false);
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: templateRefetch } = useTemplates();
  const navigate = useNavigate();
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  };
  const addToFavourite = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templateRefetch();
  };
  const handleRouteNavigation = () => {
    navigate(`/resume-detail/${data._id}`, { replace: true });
  };
  return (
    <motion.div key={data._id} {...scaleInOut(index)}>
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-gray-200 overflow-hidden relative"
      >
        <img
          src={data?.imageUrl}
          alt={data.title}
          className="h-full w-full object-cover"
        />
        <AnimatePresence>
          {isHover && (
            <motion.div
              {...fadeInOutWithOpacity}
              className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col justify-start items-center px-4 py-3 z-50 cursor-pointer"
              onClick={handleRouteNavigation}
            >
              <div className="flex flex-col items-end justify-start w-full gap-4">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Remove Collection"
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
                      ? "Remove Favorite"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onHandle}
      className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md hover:shadow-md relative"
    >
      <Icon className="text-txtPrimary text-xl" />
      <AnimatePresence>
        {isHover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 after:h-2 after:bg-gray-200 after:rotate-45 after:absolute after:-right-1 after:top-[14px]"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesign;
