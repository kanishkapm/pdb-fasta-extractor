
import { PdbEntry, PolymerEntity, ProteinData } from '../types';

const BASE_URL = 'https://data.rcsb.org/rest/v1/core';
const FASTA_URL = 'https://www.rcsb.org/fasta/entry';

/**
 * Fetches protein data from the RCSB PDB Data API.
 * Includes explicit error catching for CORS/Network issues.
 */
export const fetchProteinData = async (pdbId: string): Promise<ProteinData> => {
  const normalizedId = pdbId.trim().toUpperCase();
  
  if (!/^[A-Z0-9]{4}$/.test(normalizedId)) {
    throw new Error(`"${normalizedId}" is not a valid PDB ID format. Expected 4 alphanumeric characters.`);
  }

  // 1. Fetch Entry Core Data
  let entryData: PdbEntry;
  try {
    const entryResponse = await fetch(`${BASE_URL}/entry/${normalizedId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!entryResponse.ok) {
      if (entryResponse.status === 404) {
        throw new Error(`PDB ID "${normalizedId}" was not found in the RCSB database.`);
      }
      throw new Error(`Server responded with status ${entryResponse.status}`);
    }
    entryData = await entryResponse.json();
  } catch (err: any) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to reach RCSB PDB servers. This may be due to a CORS restriction in your environment or an ad-blocker.');
    }
    throw err;
  }

  // 2. Fetch All Polymer Entities
  const entityPromises = entryData.rcsb_entry_container_identifiers.polymer_entity_ids.map(
    async (entityId) => {
      try {
        const resp = await fetch(`${BASE_URL}/polymer_entity/${normalizedId}/${entityId}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!resp.ok) return null;
        return resp.json();
      } catch {
        return null;
      }
    }
  );

  const entities = (await Promise.all(entityPromises)).filter(e => e !== null) as PolymerEntity[];

  // 3. Fetch FASTA file with a specific try-catch
  let fastaText = '';
  try {
    const fastaResponse = await fetch(`${FASTA_URL}/${normalizedId}`);
    if (fastaResponse.ok) {
      fastaText = await fastaResponse.text();
    } else {
      throw new Error('FASTA endpoint unreachable');
    }
  } catch (err) {
    console.warn("FASTA fetch failed or was blocked by CORS. Generating requested format from sequence data.");
    
    // Manual FASTA generation matching the requested reference format:
    // >PDBID_ENTITYID|Chain IDS|DESCRIPTION|ORGANISM
    fastaText = entities.map(e => {
      const pdbEntity = `${normalizedId}_${e.rcsb_id.split('.')[1] || e.rcsb_id}`;
      const chains = e.rcsb_polymer_entity_container_identifiers.auth_asym_ids.join(', ');
      const desc = e.rcsb_polymer_entity?.pdbx_description || 'Unknown Protein';
      const organism = e.rcsb_entity_source_organism?.[0]?.scientific_name || 'Unknown Organism';
      const seq = e.entity_poly?.pdbx_seq_one_letter_code || '';
      
      return `>${pdbEntity}|Chain ${chains}|${desc}|${organism}\n${seq}`;
    }).join('\n\n');
  }

  return {
    entry: entryData,
    entities,
    fasta: fastaText
  };
};
