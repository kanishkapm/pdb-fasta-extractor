
export interface PdbEntry {
  rcsb_id: string;
  struct: {
    title: string;
  };
  rcsb_entry_info: {
    resolution_combined?: number[];
    polymer_entity_count: number;
    deposited_model_count: number;
  };
  exptl: Array<{
    method: string;
  }>;
  rcsb_entry_container_identifiers: {
    polymer_entity_ids: string[];
  };
}

export interface PolymerEntity {
  rcsb_id: string;
  rcsb_polymer_entity: {
    pdbx_description: string;
  };
  rcsb_entity_source_organism?: Array<{
    scientific_name: string;
  }>;
  rcsb_polymer_entity_container_identifiers: {
    auth_asym_ids: string[];
  };
  entity_poly: {
    pdbx_seq_one_letter_code: string;
  };
}

export interface ProteinData {
  entry: PdbEntry;
  entities: PolymerEntity[];
  fasta: string;
}
