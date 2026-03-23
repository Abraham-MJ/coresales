import { IspPlan, Product, LeadStatus } from '../entities/Catalog';
import { SalesRep } from '../entities/User';
import { Branch, Zone } from '../entities/Sale';

export interface ICatalogRepository {
  getIspPlans(workspace_id: string): Promise<IspPlan[]>;
  getProducts(workspace_id: string): Promise<Product[]>;
  getLeadStatuses(workspace_id: string): Promise<LeadStatus[]>;
  getSalesReps(workspace_id: string): Promise<SalesRep[]>;
  getBranches(workspace_id: string): Promise<Branch[]>;
  getZones(workspace_id: string, branch_id?: string): Promise<Zone[]>;
}
