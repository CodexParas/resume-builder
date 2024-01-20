import React, { useEffect } from "react";
import { Filter, MainSpinner, TemplateDesign } from "../components";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "react-query";
import filterTemplates from "../utils/filterTemplates";

const HomeContainer = () => {
  const {
    data: templates,
    isError: templatesError,
    isLoading: templatesLoading,
  } = useTemplates();
  const { data: filterData } = useQuery("globalFilter");
  filterData?.searchTerm;

  if (templatesLoading) {
    return <MainSpinner />;
  }
  const filteredTemplates = filterTemplates(templates, filterData?.searchTerm);
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
          <RenderATemplate templates={filteredTemplates} />
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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <AnimatePresence>
              {templates.map((template, index) => (
                <TemplateDesign
                  index={index}
                  key={template._id}
                  data={template}
                />
              ))}
            </AnimatePresence>
          </div>
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
