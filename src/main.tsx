import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convex } from '@/lib/convex';
import '@/index.css'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { RegisterStudentPage } from '@/pages/RegisterStudentPage'
import { StudentDetailsPage } from '@/pages/StudentDetailsPage'
import { RegisterTutorPage } from '@/pages/RegisterTutorPage'
import { TutorDetailsPage } from '@/pages/TutorDetailsPage'
import { StudentSchedulePage } from '@/pages/StudentSchedulePage'
import { TutorSchedulePage } from '@/pages/TutorSchedulePage'
import { PaymentsDuesPage } from '@/pages/PaymentsDuesPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/students/register", element: <RegisterStudentPage /> },
      { path: "/students/details", element: <StudentDetailsPage /> },
      { path: "/tutors/register", element: <RegisterTutorPage /> },
      { path: "/tutors/details", element: <TutorDetailsPage /> },
      { path: "/schedules/student", element: <StudentSchedulePage /> },
      { path: "/schedules/tutor", element: <TutorSchedulePage /> },
      { path: "/payments/dues", element: <PaymentsDuesPage /> },
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ConvexAuthProvider client={convex}>
          <RouterProvider router={router} />
        </ConvexAuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)