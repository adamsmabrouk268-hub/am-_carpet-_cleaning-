import { BeforeAfterItem, ServiceItem, StateCoverage } from '../types';
import { BEFORE_AFTER, SERVICES, STATES_DATA, SERVICED_ZIPS } from '../data/initialData';

export const DEFAULT_ADMIN_EMAIL = 'adminProClean@gmail.com';
export const DEFAULT_ADMIN_PASS = 'adams@268#';

const KEY_ADMIN_PASS = 'proclean_admin_custom_pass';
const KEY_GALLERY = 'proclean_gallery_items_v2';
const KEY_SERVICES = 'proclean_services_catalog_v2';
const KEY_STATES = 'proclean_states_coverage_v2';
const KEY_ZIPS = 'proclean_serviced_zips_v2';

export const DATA_CHANGED_EVENT = 'proclean_data_updated';

export function notifyDataChanged(topic: 'password' | 'gallery' | 'services' | 'states') {
  try {
    window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail: { topic } }));
  } catch {
    // ignore
  }
}

// ============================================================================
// 1. ADMIN PASSWORD MANAGEMENT
// ============================================================================

export function getAdminPassword(): string {
  try {
    const custom = localStorage.getItem(KEY_ADMIN_PASS);
    return custom && custom.trim().length > 0 ? custom : DEFAULT_ADMIN_PASS;
  } catch {
    return DEFAULT_ADMIN_PASS;
  }
}

export function setAdminPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.trim().length < 6) {
    return false;
  }
  try {
    localStorage.setItem(KEY_ADMIN_PASS, newPassword.trim());
    notifyDataChanged('password');
    return true;
  } catch (err) {
    console.error('Failed to save new admin password:', err);
    return false;
  }
}

export function verifyAdminPassword(input: string): boolean {
  return input === getAdminPassword();
}

export function resetAdminPasswordToDefault(): void {
  try {
    localStorage.removeItem(KEY_ADMIN_PASS);
    notifyDataChanged('password');
  } catch (err) {
    console.error(err);
  }
}

// ============================================================================
// 2. BEFORE & AFTER GALLERY MANAGEMENT
// ============================================================================

export function getStoredGallery(): BeforeAfterItem[] {
  try {
    const raw = localStorage.getItem(KEY_GALLERY);
    if (!raw) {
      localStorage.setItem(KEY_GALLERY, JSON.stringify(BEFORE_AFTER));
      return BEFORE_AFTER;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : BEFORE_AFTER;
  } catch (err) {
    console.error('Failed to load gallery items:', err);
    return BEFORE_AFTER;
  }
}

export function saveStoredGallery(items: BeforeAfterItem[]): void {
  try {
    localStorage.setItem(KEY_GALLERY, JSON.stringify(items));
    notifyDataChanged('gallery');
  } catch (err) {
    console.error('Failed to save gallery items:', err);
  }
}

export function addGalleryTransformation(data: Omit<BeforeAfterItem, 'id'>): BeforeAfterItem {
  const current = getStoredGallery();
  const id = `trans-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newItem: BeforeAfterItem = {
    ...data,
    id
  };
  const updated = [newItem, ...current];
  saveStoredGallery(updated);
  return newItem;
}

export function deleteGalleryTransformation(id: string): boolean {
  const current = getStoredGallery();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length !== current.length) {
    saveStoredGallery(filtered);
    return true;
  }
  return false;
}

export function resetGalleryToDefault(): BeforeAfterItem[] {
  try {
    localStorage.setItem(KEY_GALLERY, JSON.stringify(BEFORE_AFTER));
    notifyDataChanged('gallery');
  } catch (e) {
    console.error(e);
  }
  return BEFORE_AFTER;
}

// ============================================================================
// 3. SERVICES CATALOG MANAGEMENT
// ============================================================================

export function getStoredServices(): ServiceItem[] {
  try {
    const raw = localStorage.getItem(KEY_SERVICES);
    if (!raw) {
      localStorage.setItem(KEY_SERVICES, JSON.stringify(SERVICES));
      return SERVICES;
    }
    const parsed = JSON.parse(raw);
    const valid = Array.isArray(parsed) && parsed.length > 0 ? parsed : SERVICES;
    // Filter out removed water/string treatment if present in cached localStorage
    const filtered = valid.filter(
      (s: ServiceItem) => s.id !== 'water_string_treatment' && (s.category as string) !== 'water_treatment'
    );
    // Ensure newly introduced default services (such as painting) are populated into existing storage
    const hasPainting = filtered.some((s: ServiceItem) => s.category === 'painting');
    if (!hasPainting) {
      const paintingDefaults = SERVICES.filter((s) => s.category === 'painting');
      const merged = [...filtered, ...paintingDefaults];
      localStorage.setItem(KEY_SERVICES, JSON.stringify(merged));
      return merged;
    }
    if (filtered.length !== valid.length) {
      localStorage.setItem(KEY_SERVICES, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    console.error('Failed to load services catalog:', err);
    return SERVICES;
  }
}

export function saveStoredServices(services: ServiceItem[]): void {
  try {
    localStorage.setItem(KEY_SERVICES, JSON.stringify(services));
    notifyDataChanged('services');
  } catch (err) {
    console.error('Failed to save services catalog:', err);
  }
}

export function addStoredService(serviceData: Omit<ServiceItem, 'id'>): ServiceItem {
  const current = getStoredServices();
  const id = serviceData.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 30) + `_${Date.now().toString().slice(-4)}`;

  const newService: ServiceItem = {
    ...serviceData,
    id
  };
  const updated = [...current, newService];
  saveStoredServices(updated);
  return newService;
}

export function deleteStoredService(id: string): boolean {
  const current = getStoredServices();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length !== current.length) {
    saveStoredServices(filtered);
    return true;
  }
  return false;
}

export function updateStoredService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
  const current = getStoredServices();
  let updatedService: ServiceItem | null = null;
  const nextList = current.map((s) => {
    if (s.id === id) {
      updatedService = { ...s, ...updates };
      return updatedService;
    }
    return s;
  });
  if (updatedService) {
    saveStoredServices(nextList);
  }
  return updatedService;
}

export function resetServicesToDefault(): ServiceItem[] {
  try {
    localStorage.setItem(KEY_SERVICES, JSON.stringify(SERVICES));
    notifyDataChanged('services');
  } catch (e) {
    console.error(e);
  }
  return SERVICES;
}

// ============================================================================
// 4. STATES & COVERAGE AREA MANAGEMENT
// ============================================================================

export function getStoredStates(): StateCoverage[] {
  try {
    const raw = localStorage.getItem(KEY_STATES);
    if (!raw) {
      localStorage.setItem(KEY_STATES, JSON.stringify(STATES_DATA));
      return STATES_DATA;
    }
    const parsed = JSON.parse(raw);
    // If stored states contain non-WA states or lack WA, update to Washington state definition
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      parsed.some((s: StateCoverage) => s.stateCode !== 'WA') ||
      !parsed.some((s: StateCoverage) => s.stateCode === 'WA')
    ) {
      localStorage.setItem(KEY_STATES, JSON.stringify(STATES_DATA));
      return STATES_DATA;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load states coverage:', err);
    return STATES_DATA;
  }
}

export function saveStoredStates(states: StateCoverage[]): void {
  try {
    localStorage.setItem(KEY_STATES, JSON.stringify(states));
    notifyDataChanged('states');
  } catch (err) {
    console.error('Failed to save states coverage:', err);
  }
}

export function getStoredServicedZips(): { [zip: string]: { city: string; state: string; area: string } } {
  try {
    const raw = localStorage.getItem(KEY_ZIPS);
    if (!raw) {
      localStorage.setItem(KEY_ZIPS, JSON.stringify(SERVICED_ZIPS));
      return SERVICED_ZIPS;
    }
    const parsed = JSON.parse(raw);
    // If stored zips have old Texas/Florida zips or lack Washington zips, sync with SERVICED_ZIPS
    if (!parsed || typeof parsed !== 'object' || parsed['77001'] || !parsed['98003']) {
      localStorage.setItem(KEY_ZIPS, JSON.stringify(SERVICED_ZIPS));
      return SERVICED_ZIPS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load serviced zips:', err);
    return SERVICED_ZIPS;
  }
}

export function saveStoredServicedZips(zips: { [zip: string]: { city: string; state: string; area: string } }): void {
  try {
    localStorage.setItem(KEY_ZIPS, JSON.stringify(zips));
    notifyDataChanged('states');
  } catch (err) {
    console.error('Failed to save serviced zips:', err);
  }
}

export function addStoredState(payload: {
  stateCode: string;
  stateName: string;
  cityName: string;
  zips: string[];
  popularZips?: string[];
  description: string;
  metroArea?: string;
}): StateCoverage {
  const currentStates = getStoredStates();
  const currentZips = getStoredServicedZips();

  const code = payload.stateCode.trim().toUpperCase();
  const name = payload.stateName.trim();
  const city = payload.cityName.trim();
  const cleanZips = Array.from(
    new Set(payload.zips.map((z) => z.trim()).filter((z) => /^\d{5}$/.test(z)))
  );
  const popular = (payload.popularZips || cleanZips.slice(0, 3)).filter((z) => cleanZips.includes(z));

  // Check if state already exists
  const existingStateIndex = currentStates.findIndex((s) => s.stateCode.toUpperCase() === code);

  let updatedState: StateCoverage;

  if (existingStateIndex >= 0) {
    const existing = currentStates[existingStateIndex];
    // Check if city already exists in state
    const cityIndex = existing.cities.findIndex((c) => c.cityName.toLowerCase() === city.toLowerCase());
    if (cityIndex >= 0) {
      // Merge zips
      const existingCity = existing.cities[cityIndex];
      const mergedZips = Array.from(new Set([...existingCity.zips, ...cleanZips]));
      existing.cities[cityIndex] = {
        ...existingCity,
        zips: mergedZips,
        popularZips: Array.from(new Set([...existingCity.popularZips, ...popular])),
        description: payload.description || existingCity.description
      };
    } else {
      existing.cities.push({
        cityName: city,
        zips: cleanZips,
        popularZips: popular,
        description: payload.description
      });
    }
    currentStates[existingStateIndex] = { ...existing };
    updatedState = currentStates[existingStateIndex];
  } else {
    // New state
    updatedState = {
      stateCode: code,
      stateName: name,
      cities: [
        {
          cityName: city,
          zips: cleanZips,
          popularZips: popular,
          description: payload.description
        }
      ]
    };
    currentStates.push(updatedState);
  }

  // Update ZIPs dictionary mapping
  cleanZips.forEach((zip) => {
    currentZips[zip] = {
      city,
      state: code,
      area: payload.metroArea || payload.description || `${city} Metro Area`
    };
  });

  saveStoredStates(currentStates);
  saveStoredServicedZips(currentZips);

  return updatedState;
}

export function deleteStoredState(stateCode: string): boolean {
  const current = getStoredStates();
  const targetCode = stateCode.trim().toUpperCase();
  const filtered = current.filter((s) => s.stateCode.toUpperCase() !== targetCode);

  if (filtered.length !== current.length) {
    saveStoredStates(filtered);

    // Also remove from serviced zips
    const currentZips = getStoredServicedZips();
    const updatedZips: { [zip: string]: { city: string; state: string; area: string } } = {};
    Object.entries(currentZips).forEach(([zip, data]) => {
      if (data.state.toUpperCase() !== targetCode) {
        updatedZips[zip] = data;
      }
    });
    saveStoredServicedZips(updatedZips);
    return true;
  }
  return false;
}

export function resetStatesToDefault(): StateCoverage[] {
  try {
    localStorage.setItem(KEY_STATES, JSON.stringify(STATES_DATA));
    localStorage.setItem(KEY_ZIPS, JSON.stringify(SERVICED_ZIPS));
    notifyDataChanged('states');
  } catch (e) {
    console.error(e);
  }
  return STATES_DATA;
}

// Aliases for convenience across components
export const getStoredServicesCatalog = getStoredServices;
export const getStoredStatesCoverage = getStoredStates;

