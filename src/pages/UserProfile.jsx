import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesign } from "../components";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";

const UserProfile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser();
  const [activeTab, setactiveTab] = useState("collections");
  const { data: templates } = useTemplates();
  const { data: savedResumes, isLoading: resumeLoading } = useQuery(
    ["savedResumes"],
    async () => await getSavedResumes(user?.uid)
  );
  console.log(savedResumes);

  useEffect(() => {
    if (!user && !userLoading) {
      navigate("/auth", { replace: true });
    }
  }, [userLoading]);
  if (userLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col py-12 items-center justify-center">
      <div className="w-full h-72">
        <img
          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
          alt="User thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <React.Fragment>
              <img
                src={user?.photoURL}
                className="rounded-full object-cover w-24 h-24 border-2 border-white -mt-12 shadow-md relative"
                referrerPolicy="no-referrer"
                alt="Profile"
                loading="lazy"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="h-24 w-24 rounded-full flex items-center justify-center border-2 border-white bg-blue-700 shadow-md -mt-12 absolute">
                <p className="text-white text-3xl uppercase">
                  {user?.email[0]}
                </p>
              </div>
            </React.Fragment>
          )}
          <p className="text-3xl text-txtDark">{user?.displayName}</p>
        </div>
        {/* tabs */}
        <div className="flex items-center justify-center mt-12">
          <div
            className="px-4 py-2 flex items-center justify-center flex-col gap-2 rounded-md group cursor-pointer"
            onClick={() => setactiveTab("collections")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white text-blue-600 shadow-md"
              }`}
            >
              Collections
            </p>
          </div>
          <div
            className="px-4 py-2 flex items-center justify-center flex-col gap-2 rounded-md group cursor-pointer"
            onClick={() => setactiveTab("resumes")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "resumes" && "bg-white text-blue-600 shadow-md"
              }`}
            >
              My Resumes
            </p>
          </div>
        </div>
        {/* tab content */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections?.length > 0 && user?.collections ? (
                  <RenderATemplate
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                  />
                ) : (
                  <div className="col-span-12 w-full flex items-center justify-center flex-col gap-3">
                    <img
                      src={NoData}
                      alt="No Data"
                      className="w-32 h-auto object-contain"
                    />
                    <p className="text-lg text-txtDark">No Data</p>
                  </div>
                )}
              </React.Fragment>
            )}
            {resumeLoading ? (
              <MainSpinner />
            ) : (
              <React.Fragment>
                {activeTab === "resumes" && (
                  <React.Fragment>
                    {savedResumes?.length > 0 && savedResumes ? (
                      <RenderATemplate templates={savedResumes} />
                    ) : (
                      <div className="col-span-12 w-full flex items-center justify-center flex-col gap-3">
                        <img
                          src={NoData}
                          alt="No Data"
                          className="w-32 h-auto object-contain"
                        />
                        <p className="text-lg text-txtDark">No Data</p>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates.map((template, index) => (
              <TemplateDesign
                index={index}
                key={template._id}
                data={template}
              />
            ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default UserProfile;
