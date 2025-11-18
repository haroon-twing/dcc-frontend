import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import { CommunicationProvider } from './contexts/CommunicationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import './App.css';

const LoginPage = React.lazy(() => import('./pages/Login'));
const RegisterPage = React.lazy(() => import('./pages/Register'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const LeadsPage = React.lazy(() => import('./pages/Leads'));
const InboxPage = React.lazy(() => import('./pages/Inbox'));
const UsersPage = React.lazy(() => import('./pages/Users'));
const RolesPage = React.lazy(() => import('./pages/Roles'));
const DepartmentsPage = React.lazy(() => import('./pages/Departments'));
const SectionsPage = React.lazy(() => import('./pages/Sections'));
const ProgramsPage = React.lazy(() => import('./pages/Programs'));
const MadarisDashboardPage = React.lazy(() => import('./pages/MadarisDashboard'));
const MadarisListPage = React.lazy(() => import('./pages/MadarisList'));
const MadarisDetailsPage = React.lazy(() => import('./pages/MadarisDetails'));
const NonCooperativePage = React.lazy(() => import('./pages/NonCooperativePage'));
const ActionAgainstIllegalMadarisPage = React.lazy(() => import('./pages/ActionAgainstIllegalMadarisPage'));
const SafeCityDashboardPage = React.lazy(() => import('./pages/SafeCityDashboard'));
const SafeCityListPage = React.lazy(() => import('./pages/SafeCityList'));
const SafeCityDetailsPage = React.lazy(() => import('./pages/SafeCityDetails'));
const NGODashboardPage = React.lazy(() => import('./pages/NGODashboard'));
const NGOListPage = React.lazy(() => import('./pages/NGOList'));
const NGODetailsPage = React.lazy(() => import('./pages/NGODetails'));
const OpsResponseDashboardPage = React.lazy(() => import('./pages/OpsResponseDashboard'));
const OpsResponseListPage = React.lazy(() => import('./pages/OpsResponseList'));
const OpsResponseDetailsPage = React.lazy(() => import('./pages/OpsResponseDetails'));
const PIFTACReportsPage = React.lazy(() => import('./pages/PIFTACReports'));
const ProscribedTerroristOrganizationPage = React.lazy(() => import('./pages/ProscribedTerroristOrganization'));
const CoordinationLEAsPage = React.lazy(() => import('./pages/CoordinationLEAs'));
const RecoveryPage = React.lazy(() => import('./pages/Recovery'));
const ReportsPage = React.lazy(() => import('./pages/Reports'));
const IntelligenceCycleDashboardPage = React.lazy(() => import('./pages/IntelligenceCycleDashboard'));
const IntelligenceCycleListPage = React.lazy(() => import('./pages/IntelligenceCycleList'));
const OfficesEstablishedPIFTACPage = React.lazy(() => import('./pages/OfficesEstablishedPIFTAC'));
const OperationalFacilitiesPIFTACPage = React.lazy(() => import('./pages/OperationalFacilitiesPIFTAC'));
const ConnectivityStatusPage = React.lazy(() => import('./pages/ConnectivityStatus'));
const AllocationIDsPIFTACPage = React.lazy(() => import('./pages/AllocationIDsPIFTAC'));
const PIFTACReportsIntelligencePage = React.lazy(() => import('./pages/PIFTACReportsIntelligence'));
const PredictiveAnalysisDetailPage = React.lazy(() => import('./pages/PredictiveAnalysisDetail'));
const SourceReliabilityIndexPage = React.lazy(() => import('./pages/SourceReliabilityIndex'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CommunicationProvider>
          <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/madaris" element={<Navigate to="/madaris/dashboard" replace />} />
          <Route path="/safe-city" element={<Navigate to="/safe-city/dashboard" replace />} />
          <Route path="/ngo" element={<Navigate to="/ngo/dashboard" replace />} />
          <Route path="/ops-response" element={<Navigate to="/ops-response/dashboard" replace />} />
          <Route path="/intelligence-cycle" element={<Navigate to="/intelligence-cycle/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute>
              <Layout>
                <LeadsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/madaris/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <MadarisDashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/madaris/list" element={
            <ProtectedRoute>
              <Layout>
                <MadarisListPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/madaris/details" element={
            <ProtectedRoute>
              <Layout>
                <MadarisDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/madaris/non-cooperative" element={
            <ProtectedRoute>
              <Layout>
                <NonCooperativePage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/madaris/action-against-illegal-madaris" element={
            <ProtectedRoute>
              <Layout>
                <ActionAgainstIllegalMadarisPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/safe-city/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <SafeCityDashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/safe-city/list" element={
            <ProtectedRoute>
              <Layout>
                <SafeCityListPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/safe-city/details" element={
            <ProtectedRoute>
              <Layout>
                <SafeCityDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ngo/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <NGODashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ngo/list" element={
            <ProtectedRoute>
              <Layout>
                <NGOListPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ngo/details" element={
            <ProtectedRoute>
              <Layout>
                <NGODetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <OpsResponseDashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/list" element={
            <ProtectedRoute>
              <Layout>
                <OpsResponseListPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/details" element={
            <ProtectedRoute>
              <Layout>
                <OpsResponseDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/piftac-reports" element={
            <ProtectedRoute>
              <Layout>
                <PIFTACReportsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/proscribed-terrorist-organization" element={
            <ProtectedRoute>
              <Layout>
                <ProscribedTerroristOrganizationPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/coordination-leas" element={
            <ProtectedRoute>
              <Layout>
                <CoordinationLEAsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/recovery" element={
            <ProtectedRoute>
              <Layout>
                <RecoveryPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/ops-response/reports" element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <IntelligenceCycleDashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/list" element={
            <ProtectedRoute>
              <Layout>
                <IntelligenceCycleListPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/offices-established-piftac" element={
            <ProtectedRoute>
              <Layout>
                <OfficesEstablishedPIFTACPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/operational-facilities-piftac" element={
            <ProtectedRoute>
              <Layout>
                <OperationalFacilitiesPIFTACPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/connectivity-status" element={
            <ProtectedRoute>
              <Layout>
                <ConnectivityStatusPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/allocation-ids-piftac" element={
            <ProtectedRoute>
              <Layout>
                <AllocationIDsPIFTACPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/piftac-reports" element={
            <ProtectedRoute>
              <Layout>
                <PIFTACReportsIntelligencePage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/predictive-analysis" element={
            <ProtectedRoute>
              <Layout>
                <PredictiveAnalysisDetailPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/intelligence-cycle/source-reliability" element={
            <ProtectedRoute>
              <Layout>
                <SourceReliabilityIndexPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <Layout>
                <InboxPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/roles" element={
            <ProtectedRoute>
              <Layout>
                <RolesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/departments" element={
            <ProtectedRoute>
              <Layout>
                <DepartmentsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/sections" element={
            <ProtectedRoute>
              <Layout>
                <SectionsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/programs" element={
            <ProtectedRoute>
              <Layout>
                <ProgramsPage />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
          </React.Suspense>
        </CommunicationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
