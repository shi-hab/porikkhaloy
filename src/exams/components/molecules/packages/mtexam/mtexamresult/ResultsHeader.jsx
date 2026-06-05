import { Card } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Skeleton } from "antd";
import React from "react";


export const ResultsHeader = ({ modelTestDetails, totalMarks, loading }) => {

    return (
      <Card className="p-2 dark:bg-gray-900 dark:border-gray-700">
        {loading ? (
          <div className="flex justify-between items-center">
            <Skeleton paragraph={{ rows: 1 }} active />
            <div className="flex items-center gap-3">
              <Skeleton.Button active className="!h-14" />
              <Skeleton.Button active className="!h-14" />
            </div>
          </div>
        ) : (
          <div className="text-center p-2 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-600 rounded-md shadow-sm">
            <div>
              <h1 className="text-lg font-bold text-center text-blue-900 dark:text-blue-200">
                {parseHtmlContent(modelTestDetails?.title)}
              </h1>
            </div>
          </div>
        )}
      </Card>
    );
};
