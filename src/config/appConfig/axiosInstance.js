import axios from "axios";

import createApiInstance from "./createApiInstance";

//axios instance for create email-history
const axiosEmailHistoryInstance = axios.create({
  ...createApiInstance("emailHistory"),
});
//axios instance for create TP-Owner
const axiosTpOwnerInstance = axios.create({
  ...createApiInstance("tPOwner"),
});

//axios instance for create new references
const axiosReferenceListInstance = axios.create({
  ...createApiInstance("references"),
});

//axios instance for create new references-search
const axiosReferenceSearchInstance = axios.create({
  ...createApiInstance("referenceSearch"),
});

//axios instance for create new references-search
const axiosScoperInstance = axios.create({
  ...createApiInstance("scopers"),
});

//axios instance for create new references-search
const axiosFileMatricsTemplateInstance = axios.create({
  ...createApiInstance("fileMatricsTemplate"),
});

//axios instance for create cookie store
const axiosCookieStoreTemplateInstance = axios.create({
  ...createApiInstance("cookieStoreTemplate"),
});

//axios instance for create cookie store
const axiosFileMatricsInstance = axios.create({
  ...createApiInstance("fileMatrics"),
});

//axios instance for create cookie store
const axiosCookieStoreInstance = axios.create({
  ...createApiInstance("cookieStore"),
});

//axios instance for tp status
const axiosTPPipelineInstance = axios.create({
  ...createApiInstance("tpPipeline"),
});

//axios instance for create spyfu metrics
const axiosSpyfuMetricsInstance = axios.create({
  ...createApiInstance("spyfuMetrics"),
});

//axios instance for spyfu filter
const axiosSpyfuFilterInstance = axios.create({
  ...createApiInstance("spyfuFilter"),
});

//axios instance for create linkedin metrics
const axiosLinkedInMetricsInstance = axios.create({
  ...createApiInstance("linkedinMetrics"),
});

//axios instance for linkedin filter
const axiosLinkedInFilterInstance = axios.create({
  ...createApiInstance("linkedinFilter"),
});

//axios instance for create linkedin metrics
const axiosAlexaMetricsInstance = axios.create({
  ...createApiInstance("alexaMetrics"),
});

//axios instance for linkedin filter
const axiosAlexaFilterInstance = axios.create({
  ...createApiInstance("alexaFilter"),
});
//axios for instance for comapny updates
const axiosCompanyUpdatesInstance = axios.create({
  ...createApiInstance("companyUpdates"),
});

//axios for instance for comapny update type
const axiosCompanyUpdateType = axios.create({
  ...createApiInstance("companyUpdateType"),
});

//axios for instance for favorite
const axiosCompanyProfileFavorite = axios.create({
  ...createApiInstance("favorite"),
});

//axios for instance for fileUploads
const axiosCompanyProfileFileUploads = axios.create({
  ...createApiInstance("fileUploads"),
});

//axios for instance for documentTypes
const axiosCompanyProfileDocumentType = axios.create({
  ...createApiInstance("documentTypes"),
});

//axios for instance for uploadFile
const axiosCompanyUploadFile = axios.create({
  ...createApiInstance("uploadFile"),
});

//axios instance for getting userInfo
const axiosUserInfoInstance = axios.create({
  baseURL:
    "https://orion-portal.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
});

//axios instance for getting project
const axiosProjectsInstance = axios.create({
  ...createApiInstance("projects"),
});

//axios instance for getting template
const axiosAllTemplatesInstance = axios.create({
  ...createApiInstance("templates"),
});

//axios instance for getting notifications
const axiosNotificationsInstance = axios.create({
  ...createApiInstance("notifications"),
});

//axios instance for getting notifications template
const axiosNotificationTemplateInstance = axios.create({
  ...createApiInstance("notificationTemplate"),
});

//axios instance for getting company search
const axiosCompanySearchInstance = axios.create({
  ...createApiInstance("companySearch"),
});

//axios instance for getting company Alert
const axiosCompanyAlertInstance = axios.create({
  ...createApiInstance("companyAlert"),
});

//axios instance for getting company Alert
const axiosCompanyFavouriteInstance = axios.create({
  ...createApiInstance("companyPage"),
});

//axios instance for saving company Alert
const axiosCompanySaveAlertsInstance = axios.create({
  ...createApiInstance("alert"),
});

export {
  axiosCompanyUploadFile,
  axiosCompanySaveAlertsInstance,
  axiosCompanyFavouriteInstance,
  axiosCompanyAlertInstance,
  axiosUserInfoInstance,
  axiosReferenceListInstance,
  axiosCompanyProfileDocumentType,
  axiosCompanyProfileFileUploads,
  axiosReferenceSearchInstance,
  axiosScoperInstance,
  axiosFileMatricsTemplateInstance,
  axiosCookieStoreTemplateInstance,
  axiosFileMatricsInstance,
  axiosCookieStoreInstance,
  axiosTPPipelineInstance,
  axiosSpyfuMetricsInstance,
  axiosSpyfuFilterInstance,
  axiosLinkedInMetricsInstance,
  axiosLinkedInFilterInstance,
  axiosAlexaMetricsInstance,
  axiosAlexaFilterInstance,
  axiosCompanyUpdatesInstance,
  axiosCompanyUpdateType,
  axiosCompanyProfileFavorite,
  axiosEmailHistoryInstance,
  axiosTpOwnerInstance,
  axiosProjectsInstance,
  axiosAllTemplatesInstance,
  axiosNotificationsInstance,
  axiosNotificationTemplateInstance,
  axiosCompanySearchInstance
};
