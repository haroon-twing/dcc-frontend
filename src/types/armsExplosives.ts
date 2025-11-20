export interface PolicyAndLegislativeAmendment {
  id?: string;
  name_executive_order: string;
  area_focus: string;
  location_affected: string;
  passed_by: string;
  passed_on: string;
  expires_on: string;
  remarks: string;
}

export interface ArmsExplosivesUreaRecord {
  id: string;
  per_change_arms_inflow: number;
  per_change_explosive_inflow: number;
  per_change_illegal_urea_transportation: number;
  no_int_reports_shared_lea: number;
  no_letter_recvd_in_fdbk: number;
  per_recs_made_illegal_arms: number;
  is_recs_faster_than_mthly_inflow_ill_arms: boolean;
  per_recs_made_illegal_explosives: number;
  is_recs_faster_than_mthly_inflow_ill_exp: boolean;
  per_recs_made_illegal_urea: number;
  is_recs_faster_than_mthly_inflow_ill_urea: boolean;
  no_perpetrator_convicted: number;
  no_appreh_perp_set_freebycourt: number;
  no_perpetrator_case_remain_pending: number;
}
