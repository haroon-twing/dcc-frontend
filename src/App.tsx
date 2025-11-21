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
const ExtortionIncidentDetailsPage = React.lazy(() => import('./pages/ExtortionIncidentDetails'));
const ProscribedTerroristOrganizationPage = React.lazy(() => import('./pages/ProscribedTerroristOrganization'));
const CoordinationLEAsPage = React.lazy(() => import('./pages/CoordinationLEAs'));
const RecoveryPage = React.lazy(() => import('./pages/Recovery'));
const ReportsPage = React.lazy(() => import('./pages/Reports'));
const IntelligenceCycleDashboardPage = React.lazy(() => import('./pages/IntelligenceCycleDashboard'));
const IntelligenceCycleListPage = React.lazy(() => import('./pages/IntelligenceCycleList'));
const IntelligenceCycleListDetailsPage = React.lazy(() => import('./pages/IntelligenceCycleListDetails'));
const OfficesEstablishedPIFTACPage = React.lazy(() => import('./pages/OfficesEstablishedPIFTAC'));
const OfficesEstablishedDetailsPage = React.lazy(() => import('./pages/OfficesEstablishedDetails'));
const OperationalFacilitiesPIFTACPage = React.lazy(() => import('./pages/OperationalFacilitiesPIFTAC'));
const OperationalFacilitiesDetailsPage = React.lazy(() => import('./pages/OperationalFacilitiesDetails'));
const ConnectivityStatusPage = React.lazy(() => import('./pages/ConnectivityStatus'));
const ConnectivityStatusDetailsPage = React.lazy(() => import('./pages/ConnectivityStatusDetails'));
const AllocationIDsPIFTACPage = React.lazy(() => import('./pages/AllocationIDsPIFTAC'));
const AllocationIDsPIFTACDetailsPage = React.lazy(() => import('./pages/AllocationIDsPIFTACDetails'));
const PIFTACReportsIntelligencePage = React.lazy(() => import('./pages/PIFTACReportsIntelligence'));
const ArmsExplosivesUreaDetailsPage = React.lazy(() => import('./pages/ArmsExplosivesUreaDetails'));
const ArmsExplosivesUreaEditPage = React.lazy(() => import('./pages/ArmsExplosivesUreaEdit'));
const PIFTACReportsIntelligenceDetailsPage = React.lazy(() => import('./pages/PIFTACReportsIntelligenceDetails'));
const PredictiveAnalysisDetailPage = React.lazy(() => import('./pages/PredictiveAnalysisDetail'));
const PredictiveAnalysisDetailsPage = React.lazy(() => import('./pages/PredictiveAnalysisDetails'));
const SourceReliabilityIndexPage = React.lazy(() => import('./pages/SourceReliabilityIndex'));
const SourceReliabilityDetailsPage = React.lazy(() => import('./pages/SourceReliabilityDetails'));
const IllegalSpectrumDashboardPage = React.lazy(() => import('./pages/IllegalSpectrumDashboard'));
const ExtortionPage = React.lazy(() => import('./pages/Extortion'));
const ExtortionDetailsPage = React.lazy(() => import('./pages/ExtortionDetails'));
const MajorExtortionistDetailsPage = React.lazy(() => import('./pages/MajorExtortionistDetails'));
const ArmsExplosivesUreaPage = React.lazy(() => import('./pages/ArmsExplosivesUrea'));
const IllegalSimsPage = React.lazy(() => import('./pages/IllegalSims'));
const IllegalSimsDetailsPage = React.lazy(() => import('./pages/IllegalSimsDetails'));
const PrevalenceOfOutOfZoneSimsDetailsPage = React.lazy(() => import('./pages/PrevalenceOfOutOfZoneSimsDetails'));
const IllegalWarehousesPage = React.lazy(() => import('./pages/IllegalWarehouses'));
const NCPVehiclesPage = React.lazy(() => import('./pages/NCPVehicles'));
const HumanTraffickingPage = React.lazy(() => import('./pages/HumanTrafficking'));
const SmugglingPage = React.lazy(() => import('./pages/Smuggling'));
const HawalaHundiPage = React.lazy(() => import('./pages/HawalaHundi'));
const HawalaHundiDetailsPage = React.lazy(() => import('./pages/HawalaHundiDetails'));
const MajorHawalaHundiDealerDetailsPage = React.lazy(() => import('./pages/MajorHawalaHundiDealerDetails'));
const HawalaHundiIncidentsDetailsPage = React.lazy(() => import('./pages/HawalaHundiIncidentsDetails'));
const BlackMarketDronesPage = React.lazy(() => import('./pages/BlackMarketDrones'));
const BlackMarketDronesDetailsPage = React.lazy(() => import('./pages/BlackMarketDronesDetails'));
const ActionAgainstIllegalVendorsDetails = React.lazy(() => import('./pages/ActionAgainstIllegalVendorsDetails'));
const PolicyAndLegislativeAmendmentDetails = React.lazy(() => import('./pages/PolicyAndLegislativeAmendmentDetails'));
const IncidentsOfCrackdownDetails = React.lazy(() => import('./pages/IncidentsOfCrackdownDetails'));
const MajorBlackMarketVendorDetails = React.lazy(() => import('./pages/MajorBlackMarketVendorDetails'));

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
          <Route path="/illegal-spectrum" element={<Navigate to="/illegal-spectrum/dashboard" replace />} />
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
          <Route path="/intelligence-cycle/list/details" element={
            <ProtectedRoute>
              <Layout>
                <IntelligenceCycleListDetailsPage />
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
          <Route path="/intelligence-cycle/offices-established-piftac/details" element={
            <ProtectedRoute>
              <Layout>
                <OfficesEstablishedDetailsPage />
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
          <Route path="/intelligence-cycle/operational-facilities-piftac/details" element={
            <ProtectedRoute>
              <Layout>
                <OperationalFacilitiesDetailsPage />
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
          <Route path="/intelligence-cycle/connectivity-status/details" element={
            <ProtectedRoute>
              <Layout>
                <ConnectivityStatusDetailsPage />
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
          <Route path="/intelligence-cycle/allocation-ids-piftac/details" element={
            <ProtectedRoute>
              <Layout>
                <AllocationIDsPIFTACDetailsPage />
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
          <Route path="/intelligence-cycle/piftac-reports/details" element={
            <ProtectedRoute>
              <Layout>
                <PIFTACReportsIntelligenceDetailsPage />
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
          <Route path="/intelligence-cycle/predictive-analysis/details" element={
            <ProtectedRoute>
              <Layout>
                <PredictiveAnalysisDetailsPage />
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
          <Route path="/intelligence-cycle/source-reliability/details" element={
            <ProtectedRoute>
              <Layout>
                <SourceReliabilityDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <IllegalSpectrumDashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/extortion" element={
            <ProtectedRoute>
              <Layout>
                <ExtortionPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/extortion/details" element={
            <ProtectedRoute>
              <Layout>
                <ExtortionDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/extortion/incidents/details" element={
            <ProtectedRoute>
              <Layout>
                <ExtortionIncidentDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/extortion/major-extortionists/details" element={
            <ProtectedRoute>
              <Layout>
                <MajorExtortionistDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/arms-explosives-urea" element={
            <ProtectedRoute>
              <Layout>
                <ArmsExplosivesUreaPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/arms-explosives-urea/policy-legislative-amendments/view/:id" element={
            <ProtectedRoute>
              <Layout>
                <PolicyAndLegislativeAmendmentDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/incidents-crackdown/details" element={
            <ProtectedRoute>
              <Layout>
                <IncidentsOfCrackdownDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/arms-explosives-urea/view/:id" element={
            <ProtectedRoute>
              <Layout>
                <ArmsExplosivesUreaDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/arms-explosives-urea/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <ArmsExplosivesUreaEditPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/illegal-sims" element={
            <ProtectedRoute>
              <Layout>
                <IllegalSimsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/illegal-sims/details" element={
            <ProtectedRoute>
              <Layout>
                <IllegalSimsDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/illegal-sims/prevalence-out-zone-sims/:id" element={
            <ProtectedRoute>
              <Layout>
                <PrevalenceOfOutOfZoneSimsDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/illegal-warehouses" element={
            <ProtectedRoute>
              <Layout>
                <IllegalWarehousesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/ncp-vehicles" element={
            <ProtectedRoute>
              <Layout>
                <NCPVehiclesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/human-trafficking" element={
            <ProtectedRoute>
              <Layout>
                <HumanTraffickingPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/smuggling" element={
            <ProtectedRoute>
              <Layout>
                <SmugglingPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/hawala-hundi" element={
            <ProtectedRoute>
              <Layout>
                <HawalaHundiPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/hawala-hundi/details" element={
            <ProtectedRoute>
              <Layout>
                <HawalaHundiDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/major-hawala-hundi-dealer/details" element={
            <ProtectedRoute>
              <Layout>
                <MajorHawalaHundiDealerDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/hawala-hundi/incidents/details" element={
            <ProtectedRoute>
              <Layout>
                <HawalaHundiIncidentsDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/black-market-drones" element={
            <ProtectedRoute>
              <Layout>
                <BlackMarketDronesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/black-market-drones/details" element={
            <ProtectedRoute>
              <Layout>
                <BlackMarketDronesDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/black-market-drones/vendors/details" element={
            <ProtectedRoute>
              <Layout>
                <MajorBlackMarketVendorDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/illegal-spectrum/action-against-illegal-vendors/details" element={
            <ProtectedRoute>
              <Layout>
                <ActionAgainstIllegalVendorsDetails />
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
