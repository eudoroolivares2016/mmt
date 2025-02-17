import { MetadataService } from '../services/MetadataService'
import Draft from './Draft'
/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface FormModel {
  documentType: string;
  documentTypeForDisplay: string;
  currentSection: FormSection;
  fullData: any;
  draft: Draft;
  fullSchema: any;
  fullErrors: FormError[];
  publishErrors: string[];
  formErrors: FormError[];
  uiSchema: object;
  formSections: FormSection[];
  service: MetadataService;
  getFormSchema();
  getFormData();
  setFormData(value: { [key: string]: object })
  migratedSectionName(sectionName: string): string;
}
