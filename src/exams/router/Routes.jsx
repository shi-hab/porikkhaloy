import { createBrowserRouter } from "react-router-dom";

import App from "../../App";
import ErrorPage from "../../ErrorPage";
import NotFoundPage from "../../NotFoundPage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomeEntry from "./HomeEntry";
import GuestRoute from "./GuestRoute";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoute from "./PublicRoute";

// Pages
import BuyQuotaPage from "../pages/BuyQuotaPage";
import ExamAnswersPageForHistory from "../pages/ExamAnswersPageForHistory";
import ExamHistoryPage from "../pages/ExamHistoryPage";
import ExamOnGoingPage from "../pages/ExamOnGoingPage";
import ExamResultPage from "../pages/ExamResultPage";
import ExamStartingPage from "./../pages/ExamStartingPage";
import ExamStart from "../pages/ExamStart";

import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import StudentProfilePage from "../pages/StudentProfilePage";
import StreakProfilePage from "../pages/studentDashboard/StreakProfilePage";

import Packages from "../pages/Packages";
import PackagesPage from "../pages/packages/PackagesPage";
import PackageDetailsPage from "../pages/packages/PackageDetailsPage";

import Subscription from "../pages/Subscription";
import SubscriptionShow from "../components/subscriptions/SubscriptionShow";
import SubscriptionView from "../components/subscriptions/SubscriptionView";
import { SubscriptionsEnrollmentForm } from "../components/subscriptions/SubscriptionsEnrollmentForm";

import QuestionListForStudentPage from "../pages/QuestionListForStudentPage";
import QuestionFeedbacks from "../pages/QuestionFeedbacks";
import MentorFeedbacks from "../pages/MentorFeedbacks";
import StudentBookMark from "../pages/QuestionMark/StudentBookMark";

import StudentLeaderboardPage from "../pages/GamificationLeaderboard/StudentLeaderboardPage";

import { MTDetailsPage } from "../pages/packages/MTDetailsPage";
import MTExamOnGoingPage from "../pages/packages/MTExamOnGoingPage";
import MTExamResultPage from "../pages/packages/MTExamResultPage";
import MTExamViewSubmissionPage from "../pages/packages/MTExamViewSubmissionPage";

import ModelTestMeritList from "../pages/ModelTestMeritList";
import ModelTestExamDetails from "../components/molecules/packages/ModelTestExamDetails";

import TestPaperPage from "../pages/DigitalTestPaper/TestPaperPage";
import TestPaperQuestionCard from "../pages/DigitalTestPaper/TestPaperQuestionCard";

import FreeExamBatch from "../pages/FreeExam/FreeExamBatch";

import StartingPage from "../pages/QuizBattle/HomePage/StartingPage";
import QuizBattleRunning from "../pages/QuizBattle/HomePage/QuizBattleRunning";

import FocusKitHome from "../pages/FocusKit/FocusKitHome";

import ForgetPass from "../pages/ForgetPass";
import ResetPassword from "../pages/ResetPassword";
import VerifyAccount from "../pages/VerifyAccount";

import SocialLoginSuccess from "./../components/molecules/auth/SocialLoginSuccess";

import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "./../pages/TermsAndConditions";

import EnrollmentForm from "../components/molecules/packages/EnrollmentForm";

import Affiliate from "../pages/affiliates/Affiliate";
import AffiliateDashboard from "../pages/affiliates/Dashboard";
import CreateCoupon from "../pages/affiliates/CreateCoupon";
import WithdrawHistory from "../pages/affiliates/WithdrawHistory";

import Calender from "../pages/admissionCalender/Calender";
import CalenderDetails from "../pages/admissionCalender/CalenderDetails";
import { LeaderboardSkeleton } from "../pages/GamificationLeaderboard/components/LeaderboardSkeleton";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      // =====================================================
      // PUBLIC ROUTES
      // শুধুমাত্র এই ৩টা route public
      // =====================================================

      {
        path: "/",
        element: <HomeEntry />,
      },

      {
        element: <GuestRoute />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/registration",
            element: <RegisterPage />,
          },
          // Social Login
          {
            path: "/social-login-success",
            element: <SocialLoginSuccess />,
          },

          // Public-looking pages — এখন private
          {
            path: "/privacy-policy",
            element: <PrivacyPolicy />,
          },
          {
            path: "/terms-and-conditions",
            element: <TermsAndConditions />,
          },
          {
            path: "/forgot-password",
            element: <ForgetPass />,
          },
          {
            path: "/reset-password",
            element: <ResetPassword />,
          }
        ],
      },


      // নতুন: login ছাড়া/সহ দুইভাবেই accessible
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/package",
            element: <PackagesPage />,
          },
          {
            path: "/package/:id",
            element: <PackageDetailsPage />,
          },
          {
            path: "/package/:packageIdurl/:modelTestIdurl",
            element: <ModelTestExamDetails />,
          },
        ],
      },

      // =====================================================
      // PRIVATE ROUTES
      // / ছাড়া বাকি সব route
      // =====================================================

      {
        element: <PrivateRoutes />,
        children: [
          // Dashboard
          {
            path: "/dashboard",
            element: <HomePage />,
          },

          // Free Batch
          {
            path: "/free-batch",
            element: <FreeExamBatch />,
          },

          // Quiz Battle
          {
            path: "/QuizBattle",
            element: <StartingPage />,
          },
          {
            path: "/quiz-battle-running",
            element: <QuizBattleRunning />,
          },



          // Exams
          {
            path: "/exam",
            element: <ExamStartingPage />,
          },
          {
            path: "/exam/start",
            element: <ExamStart />,
          },
          {
            path: "/exam-on-going",
            element: <ExamOnGoingPage />,
          },
          {
            path: "/exam-result",
            element: <ExamResultPage />,
          },
          {
            path: "/exams",
            element: <ExamStartingPage />,
          },

          // Verify
          {
            path: "/verify-email",
            element: <VerifyAccount />,
          },

          // Exam History
          {
            path: "/exam-history/:id",
            element: <ExamAnswersPageForHistory />,
          },

          {
            path: "/questions",
            element: <QuestionListForStudentPage />,
          },

          // Digital Test Paper
          {
            path: "/digital-testpaper",
            element: <TestPaperPage />,
          },
          {
            path: "/testpaper-que",
            element: <TestPaperQuestionCard />,
          },

          // Leaderboard
          {
            path: "/leaderboard",
            element: <StudentLeaderboardPage />,
          },

          // User Dashboard
          {
            path: "/user",
            element: <Dashboard />,
            errorElement: <ErrorPage />,

            children: [
              {
                path: "profile",
                element: <StudentProfilePage />,
              },
              {
                path: "streak",
                element: <StreakProfilePage />,
              },
              {
                path: "exam-history",
                element: <ExamHistoryPage />,
              },
              {
                path: "packages",
                element: <Packages />,
              },
              {
                path: "subscription",
                element: <Subscription />,
              },
              {
                path: "question-feedback",
                element: <QuestionFeedbacks />,
              },
              {
                path: "mentor-feedback",
                element: <MentorFeedbacks />,
              },
              {
                path: "book-mark",
                element: <StudentBookMark />,
              },
            ],
          },

          // Packages
          // {
          //   path: "/package",
          //   element: <PackagesPage />,
          // },
          // {
          //   path: "/package/:id",
          //   element: <PackageDetailsPage />,
          // },
          // Package Landing Page (by slug)

          {
            path: "/package/:id/enroll",
            element: <EnrollmentForm />,
          },

          // Subscriptions
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

          // Buy Quota
          {
            path: "buy-quota",
            element: <BuyQuotaPage />,
          },

          // Model Tests
          {
            path: "/package/:packageId/model-test/:modelTestId",
            element: <MTDetailsPage />,
          },
          {
            path: "/package/:packageId/model-test-merit-list/:modelTestId",
            element: <ModelTestMeritList />,
          },

          {
            path: "/package/:packageId/model-test/:modelTestId/exam-ongoing",
            element: <MTExamOnGoingPage />,
          },
          {
            path: "/model-test/:modelTestId/mtexam-result",
            element: <MTExamResultPage />,
          },
          {
            path: "/model-test/:modelTestId/mtexam-result/:studentId/:attemptId",
            element: <MTExamViewSubmissionPage />,
          },

          // Affiliate
          {
            path: "/affiliate",
            element: <Affiliate />,
          },
          {
            path: "/affiliate/dashboard",
            element: <AffiliateDashboard />,
          },
          {
            path: "/affiliate/coupon",
            element: <CreateCoupon />,
          },
          {
            path: "/affiliate/withdraw-history",
            element: <WithdrawHistory />,
          },

          // Admission Calendar
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

          // Skeleton
          {
            path: "/skeleton",
            element: <LeaderboardSkeleton />,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 404
  // =====================================================

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default Routes;