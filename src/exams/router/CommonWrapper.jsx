// ModelTestExamDetailsWrapper.jsx
import { useParams, useLocation } from "react-router-dom";
import ModelTestExamDetails from "../components/molecules/packages/ModelTestExamDetails";

export default function CommonWrapper() {
  const { modelTestExamDetails } = useParams();
  const location = useLocation();

  return (
    <ModelTestExamDetails
      key={location.pathname} // URL change হলে component remount হবে
      encoded={modelTestExamDetails} // মূল hashed string
    />
  );
}
