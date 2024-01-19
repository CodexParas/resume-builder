import React from "react";
import { Filter, MainSpinner, TemplateDesign } from "../components";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";

const HomeContainer = () => {
  const {
    data: templates,
    isError: templatesError,
    isLoading: templatesLoading,
  } = useTemplates();
  if (templatesLoading) {
    return <MainSpinner />;
  }
  return (
    <div className="w-full px-4 lg:px-12 py-6 flex items-center justify-start flex-col">
      {/* filter section */}
      <Filter />
      {/* render resume templates */}
      {templatesError ? (
        <React.Fragment>
          <p className="text-lg text-txtDark">
            Something went Wrong...Please try again later
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <RenderATemplate templates={templates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
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
      ) : (
        <React.Fragment>
          <p className="text-lg text-txtDark">
            No Templates Found...Please try again later
          </p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default HomeContainer;
