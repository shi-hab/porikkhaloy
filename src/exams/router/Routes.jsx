import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ErrorPage from "../../ErrorPage";
import NotFoundPage from "../../NotFoundPage";
import BuyQuotaPage from "../pages/BuyQuotaPage";
import ExamAnswersPageForHistory from "../pages/ExamAnswersPageForHistory";
import ExamHistoryPage from "../pages/ExamHistoryPage";
import ExamOnGoingPage from "../pages/ExamOnGoingPage";
import ExamResultPage from "../pages/ExamResultPage";
import LoginPage from "../pages/LoginPage";
import { MTDetailsPage } from "../pages/packages/MTDetailsPage";
import MTExamOnGoingPage from "../pages/packages/MTExamOnGoingPage";
import MTExamResultPage from "../pages/packages/MTExamResultPage";
import MTExamViewSubmissionPage from "../pages/packages/MTExamViewSubmissionPage";
import PackageDetailsPage from "../pages/packages/PackageDetailsPage";
import PackagesPage from "../pages/packages/PackagesPage";
import QuestionListForStudentPage from "../pages/QuestionListForStudentPage";
import RegisterPage from "../pages/RegisterPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import ExamStartingPage from "./../pages/ExamStartingPage";
import PrivateRoutes from "./PrivateRoutes";
import HomPage from "../pages/HomPage";
import ModelTestMeritList from "../pages/ModelTestMeritList";
import ExamStart from "../pages/ExamStart";
import ForgetPass from "../pages/ForgetPass";
import ResetPassword from "../pages/ResetPassword";
import VerifyAccount from "../pages/VerifyAccount";
import Dashboard from "../pages/Dashboard";
import Packages from "../pages/Packages";
import Subscription from "../pages/Subscription";
import QuestionFeedbacks from "../pages/QuestionFeedbacks";
import MentorFeedbacks from "../pages/MentorFeedbacks";
import LeaderBoard from "../pages/LeaderBoard";
import SocialLoginSuccess from "./../components/molecules/auth/SocialLoginSuccess";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "./../pages/TermsAndConditions";
import EnrollmentForm from "../components/molecules/packages/EnrollmentForm.js";
import Affiliate from "../pages/affiliates/Affiliate";
import AffiliateDashboard from "../pages/affiliates/Dashboard";
import CreateCoupon from "../pages/affiliates/CreateCoupon";
import WithdrawHistory from "../pages/affiliates/WithdrawHistory";
import Calender from "../pages/admissionCalender/Calender";
import CalenderDetails from "../pages/admissionCalender/CalenderDetails";
import SubscriptionShow from "../components/subscriptions/SubscriptionShow";
import { SubscriptionsEnrollmentForm } from "../components/subscriptions/SubscriptionsEnrollmentForm";
import ModelTestExamDetails from "../components/molecules/packages/ModelTestExamDetails";
import StudentBookMark from "../pages/QuestionMark/StudentBookMark";
import StreakProfilePage from "../pages/studentDashboard/StreakProfilePage";
import StartingPage from "../pages/QuizBattle/HomePage/StartingPage";
import QuizBattleRunning from "../pages/QuizBattle/HomePage/QuizBattleRunning";
import SliderImageSkeleton from "../components/atoms/skeletons/HomePage/SliderImageSkeleton";
import FocusKitHome from "../pages/FocusKit/FocusKitHome";
import FreeExamBatch from "../pages/FreeExam/FreeExamBatch";
import SubscriptionView from "../components/subscriptions/SubscriptionView";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomPage />,
      },
      {
        path: "/free-batch",
        element: <FreeExamBatch />,
      },
      {
        path: "/QuizBattle",
        element: <StartingPage />,
      },
      {
        path: "/quiz-battle-running",
        element: <QuizBattleRunning />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/social-login-success",
        element: <SocialLoginSuccess />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/registration",
        element: <RegisterPage />,
      },
      {
        path: "/exam",
        element: (
          <PrivateRoutes>
            <ExamStartingPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/exam/start",
        element: (
          <PrivateRoutes>
            <ExamStart />
          </PrivateRoutes>
        ),
      },
      {
        path: "/exam-on-going",
        element: (
          <PrivateRoutes>
            <ExamOnGoingPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/exam-result",
        element: (
          <PrivateRoutes>
            <ExamResultPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/exams",
        element: (
          <PrivateRoutes>
            <ExamStartingPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/verify-email",
        element: <VerifyAccount />,
      },
      {
        path: "/exam-history/:id",
        element: (
          <PrivateRoutes>
            <ExamAnswersPageForHistory />
          </PrivateRoutes>
        ),
      },
      {
        path: "/questions",
        element: <QuestionListForStudentPage />,
      },
      {
        path: "/leaderboard",
        element: <LeaderBoard />,
      },
      {
        path: "/user",
        element: (
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: "profile",
            element: (
              <PrivateRoutes>
                <StudentProfilePage />
              </PrivateRoutes>
            ),
          },
          {
            path: "streak",
            element: (
              <PrivateRoutes>
                <StreakProfilePage />
              </PrivateRoutes>
            ),
          },
          {
            path: "exam-history",
            element: (
              <PrivateRoutes>
                <ExamHistoryPage />
              </PrivateRoutes>
            ),
          },
          {
            path: "packages",
            element: (
              <PrivateRoutes>
                <Packages />
              </PrivateRoutes>
            ),
          },
          {
            path: "subscription",
            element: (
              <PrivateRoutes>
                <Subscription />
              </PrivateRoutes>
            ),
          },
          {
            path: "question-feedback",
            element: (
              <PrivateRoutes>
                <QuestionFeedbacks />
              </PrivateRoutes>
            ),
          },
          {
            path: "mentor-feedback",
            element: (
              <PrivateRoutes>
                <MentorFeedbacks />
              </PrivateRoutes>
            ),
          },
          {
            path: "book-mark",
            element: (
              <PrivateRoutes>
                <StudentBookMark />
              </PrivateRoutes>
            ),
          },
        ],
      },
      {
        path: "/package",
        element: <PackagesPage />,
      },
      {
        path: "/subscriptions",
        element: <SubscriptionShow />,
      },
      {
        path: "/subscriptions/view/:id",
        element: <SubscriptionView />,
      },
      {
        path: "/subscriptions/:checkoutId",
        element: <SubscriptionsEnrollmentForm />,
      },
      {
        path: "/forgot-password",
        element: <ForgetPass />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/package/:id",
        element: <PackageDetailsPage />,
      },
      {
        path: "/package/:id/enroll",
        element: <EnrollmentForm />,
      },
      {
        path: "buy-quota",
        element: (
          <PrivateRoutes>
            <BuyQuotaPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/package/:packageId/model-test/:modelTestId",
        element: (
          <PrivateRoutes>
            <MTDetailsPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/package/:packageId/model-test-merit-list/:modelTestId",
        element: (
          <PrivateRoutes>
            <ModelTestMeritList />
          </PrivateRoutes>
        ),
      },
      {
        path: "/package/:packageIdurl/:modelTestIdurl",
        element: <ModelTestExamDetails />,
      },
      {
        path: "/package/:packageId/model-test/:modelTestId/exam-ongoing",
        element: (
          <PrivateRoutes>
            <MTExamOnGoingPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/model-test/:modelTestId/mtexam-result",
        element: (
          <PrivateRoutes>
            <MTExamResultPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/model-test/:modelTestId/mtexam-result/:studentId/:attemptId",
        element: (
          <PrivateRoutes>
            <MTExamViewSubmissionPage />
          </PrivateRoutes>
        ),
      },

      // affiliate system route
      {
        path: "/affiliate",
        element: <Affiliate />,
      },
      {
        path: "/affiliate/dashboard",
        element: (
          <PrivateRoutes>
            <AffiliateDashboard />
          </PrivateRoutes>
        ),
      },
      {
        path: "/affiliate/coupon",
        element: (
          <PrivateRoutes>
            <CreateCoupon />
          </PrivateRoutes>
        ),
      },
      {
        path: "/affiliate/withdraw-history",
        element: (
          <PrivateRoutes>
            <WithdrawHistory />
          </PrivateRoutes>
        ),
      },

      // Admission Calender
      {
        path: "/admission-calender",
        element: <Calender />,
      },
      {
        path: "/admission-calender/:id",
        element: <CalenderDetails />,
      },

      // FocusKit
      {
        path: "/FocusKit",
        element: <FocusKitHome />,
      },
      {
        path: "/skeleton",
        element: <SliderImageSkeleton />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default Routes;
