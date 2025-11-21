import { publicApi } from './api';

export interface ProvinceOption {
  _id: string;
  name: string;
  districts?: DistrictOption[];
}

export interface DistrictOption {
  _id: string;
  name: string;
  provinceId: string;
}

export interface SchoolOfThoughtOption {
  _id: string;
  name: string;
}

export interface CountryOption {
  _id: string;
  name: string;
}

export interface CityOption {
  _id: string;
  name: string;
}

export interface WafaqOption {
  _id: string;
  wafaq_name: string;
}

export interface NonCooperationTypeOption {
  _id: string;
  value: string;
}

// Cache for lookups
let provincesCache: ProvinceOption[] | null = null;
let districtsCache: DistrictOption[] | null = null;
let schoolOfThoughtsCache: SchoolOfThoughtOption[] | null = null;
let countriesCache: CountryOption[] | null = null;
let citiesCache: CityOption[] | null = null;
let wafaqsCache: WafaqOption[] | null = null;
let nonCooperationTypesCache: NonCooperationTypeOption[] | null = null;
let isLoadingProvinces = false;
let isLoadingDistricts = false;
let isLoadingSchoolOfThoughts = false;
let isLoadingCountries = false;
let isLoadingCities = false;
let isLoadingWafaqs = false;
let isLoadingNonCooperationTypes = false;
let provincesPromise: Promise<ProvinceOption[]> | null = null;
let districtsPromise: Promise<DistrictOption[]> | null = null;
let schoolOfThoughtsPromise: Promise<SchoolOfThoughtOption[]> | null = null;
let countriesPromise: Promise<CountryOption[]> | null = null;
let citiesPromise: Promise<CityOption[]> | null = null;
let wafaqsPromise: Promise<WafaqOption[]> | null = null;
let nonCooperationTypesPromise: Promise<NonCooperationTypeOption[]> | null = null;

/**
 * Fetch all provinces from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchProvinces = async (): Promise<ProvinceOption[]> => {
  // Return cached data if available
  if (provincesCache) {
    return provincesCache;
  }

  // Return existing promise if already loading
  if (isLoadingProvinces && provincesPromise) {
    return provincesPromise;
  }

  // Create new fetch promise
  isLoadingProvinces = true;
  provincesPromise = (async () => {
    try {
      const response = await publicApi.get('/all-provinces');
      const data = response.data?.data || response.data || [];
      
      const provinces: ProvinceOption[] = data.map((prov: any) => ({
        _id: prov._id || prov.id,
        name: prov.name,
        districts: [],
      }));

      provincesCache = provinces;
      return provinces;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    } finally {
      isLoadingProvinces = false;
      provincesPromise = null;
    }
  })();

  return provincesPromise;
};

/**
 * Fetch all districts from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchDistricts = async (): Promise<DistrictOption[]> => {
  // Return cached data if available
  if (districtsCache) {
    return districtsCache;
  }

  // Return existing promise if already loading
  if (isLoadingDistricts && districtsPromise) {
    return districtsPromise;
  }

  // Create new fetch promise
  isLoadingDistricts = true;
  districtsPromise = (async () => {
    try {
      const response = await publicApi.get('/all-districts');
      const data = response.data?.data || response.data || [];
      
      const districts: DistrictOption[] = data.map((dist: any) => ({
        _id: dist._id || dist.id,
        name: dist.name,
        provinceId: dist.province?._id || dist.prov_id?._id || dist.prov_id || dist.provinceId || '',
      }));

      districtsCache = districts;
      return districts;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    } finally {
      isLoadingDistricts = false;
      districtsPromise = null;
    }
  })();

  return districtsPromise;
};

/**
 * Fetch all school of thoughts from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchSchoolOfThoughts = async (): Promise<SchoolOfThoughtOption[]> => {
  // Return cached data if available
  if (schoolOfThoughtsCache) {
    return schoolOfThoughtsCache;
  }

  // Return existing promise if already loading
  if (isLoadingSchoolOfThoughts && schoolOfThoughtsPromise) {
    return schoolOfThoughtsPromise;
  }

  // Create new fetch promise
  isLoadingSchoolOfThoughts = true;
  schoolOfThoughtsPromise = (async () => {
    try {
      const response = await publicApi.get('/all-school-of-thoughts');
      const data = response.data?.data || response.data || [];
      
      const schoolOfThoughts: SchoolOfThoughtOption[] = data.map((sot: any) => ({
        _id: sot._id || sot.id,
        name: sot.name,
      }));

      schoolOfThoughtsCache = schoolOfThoughts;
      return schoolOfThoughts;
    } catch (error) {
      console.error('Error fetching school of thoughts:', error);
      throw error;
    } finally {
      isLoadingSchoolOfThoughts = false;
      schoolOfThoughtsPromise = null;
    }
  })();

  return schoolOfThoughtsPromise;
};

/**
 * Fetch all countries from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchCountries = async (): Promise<CountryOption[]> => {
  // Return cached data if available
  if (countriesCache) {
    return countriesCache;
  }

  // Return existing promise if already loading
  if (isLoadingCountries && countriesPromise) {
    return countriesPromise;
  }

  // Create new fetch promise
  isLoadingCountries = true;
  countriesPromise = (async () => {
    try {
      const response = await publicApi.get('/all-countries');
      const data = response.data?.data || response.data || [];
      
      const countries: CountryOption[] = data.map((country: any) => ({
        _id: country._id || country.id,
        name: country.name,
      }));

      countriesCache = countries;
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    } finally {
      isLoadingCountries = false;
      countriesPromise = null;
    }
  })();

  return countriesPromise;
};

/**
 * Fetch all cities from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchCities = async (): Promise<CityOption[]> => {
  // Return cached data if available
  if (citiesCache) {
    return citiesCache;
  }

  // Return existing promise if already loading
  if (isLoadingCities && citiesPromise) {
    return citiesPromise;
  }

  // Create new fetch promise
  isLoadingCities = true;
  citiesPromise = (async () => {
    try {
      const response = await publicApi.get('/all-cities');
      const data = response.data?.data || response.data || [];
      
      const cities: CityOption[] = data.map((city: any) => ({
        _id: city._id || city.id,
        name: city.name,
      }));

      citiesCache = cities;
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    } finally {
      isLoadingCities = false;
      citiesPromise = null;
    }
  })();

  return citiesPromise;
};

/**
 * Fetch all wafaqs from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchWafaqs = async (): Promise<WafaqOption[]> => {
  // Return cached data if available
  if (wafaqsCache) {
    return wafaqsCache;
  }

  // Return existing promise if already loading
  if (isLoadingWafaqs && wafaqsPromise) {
    return wafaqsPromise;
  }

  // Create new fetch promise
  isLoadingWafaqs = true;
  wafaqsPromise = (async () => {
    try {
      const response = await publicApi.get('/all-wafaqs');
      const data = response.data?.data || response.data || [];
      
      const wafaqs: WafaqOption[] = data.map((wafaq: any) => ({
        _id: wafaq._id || wafaq.id,
        wafaq_name: wafaq.wafaq_name || wafaq.name || '',
      }));

      wafaqsCache = wafaqs;
      return wafaqs;
    } catch (error) {
      console.error('Error fetching wafaqs:', error);
      throw error;
    } finally {
      isLoadingWafaqs = false;
      wafaqsPromise = null;
    }
  })();

  return wafaqsPromise;
};

/**
 * Fetch all non-cooperation types from the API
 * Uses caching to avoid redundant API calls
 */
export const fetchNonCooperationTypes = async (): Promise<NonCooperationTypeOption[]> => {
  // Return cached data if available
  if (nonCooperationTypesCache) {
    return nonCooperationTypesCache;
  }

  // Return existing promise if already loading
  if (isLoadingNonCooperationTypes && nonCooperationTypesPromise) {
    return nonCooperationTypesPromise;
  }

  // Create new fetch promise
  isLoadingNonCooperationTypes = true;
  nonCooperationTypesPromise = (async () => {
    try {
      const response = await publicApi.get('/all-non-cooperation-types');
      const data = response.data?.data || response.data || [];
      
      const nonCooperationTypes: NonCooperationTypeOption[] = data.map((type: any) => ({
        _id: type._id || type.id,
        value: type.value || type.name || 'N/A',
      }));
      
      nonCooperationTypesCache = nonCooperationTypes;
      return nonCooperationTypes;
    } catch (error) {
      console.error('Error fetching non-cooperation types:', error);
      throw error;
    } finally {
      isLoadingNonCooperationTypes = false;
      nonCooperationTypesPromise = null;
    }
  })();

  return nonCooperationTypesPromise;
};

/**
 * Fetch both provinces and districts and associate districts with provinces
 */
export const fetchLookups = async (): Promise<{
  provinces: ProvinceOption[];
  districts: DistrictOption[];
  schoolOfThoughts: SchoolOfThoughtOption[];
  countries: CountryOption[];
}> => {
  // Use Promise.allSettled to handle individual failures gracefully
  const results = await Promise.allSettled([
    fetchProvinces(),
    fetchDistricts(),
    fetchSchoolOfThoughts(),
    fetchCountries(),
  ]);

  // Extract results, defaulting to empty arrays on failure
  const provinces = results[0].status === 'fulfilled' ? results[0].value : [];
  const districts = results[1].status === 'fulfilled' ? results[1].value : [];
  const schoolOfThoughts = results[2].status === 'fulfilled' ? results[2].value : [];
  const countries = results[3].status === 'fulfilled' ? results[3].value : [];

  // Log any failures
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const lookupNames = ['provinces', 'districts', 'schoolOfThoughts', 'countries'];
      console.error(`Error fetching ${lookupNames[index]}:`, result.reason);
    }
  });

  // Associate districts with their provinces
  provinces.forEach((province) => {
    province.districts = districts.filter(
      (district) => district.provinceId === province._id
    );
  });

  return { provinces, districts, schoolOfThoughts, countries };
};

/**
 * Get districts for a specific province
 */
export const getDistrictsByProvince = async (
  provinceId: string
): Promise<DistrictOption[]> => {
  const districts = await fetchDistricts();
  return districts.filter((district) => district.provinceId === provinceId);
};

/**
 * Clear the lookup cache (useful for refreshing data)
 */
export const clearLookupCache = () => {
  provincesCache = null;
  districtsCache = null;
  schoolOfThoughtsCache = null;
  countriesCache = null;
  citiesCache = null;
  wafaqsCache = null;
  nonCooperationTypesCache = null;
  provincesPromise = null;
  districtsPromise = null;
  schoolOfThoughtsPromise = null;
  countriesPromise = null;
  citiesPromise = null;
  wafaqsPromise = null;
  nonCooperationTypesPromise = null;
  isLoadingProvinces = false;
  isLoadingDistricts = false;
  isLoadingSchoolOfThoughts = false;
  isLoadingCountries = false;
  isLoadingCities = false;
  isLoadingWafaqs = false;
  isLoadingNonCooperationTypes = false;
};

/**
 * Get cached provinces (returns null if not cached)
 */
export const getCachedProvinces = (): ProvinceOption[] | null => {
  return provincesCache;
};

/**
 * Get cached districts (returns null if not cached)
 */
export const getCachedDistricts = (): DistrictOption[] | null => {
  return districtsCache;
};

/**
 * Get cached school of thoughts (returns null if not cached)
 */
export const getCachedSchoolOfThoughts = (): SchoolOfThoughtOption[] | null => {
  return schoolOfThoughtsCache;
};

/**
 * Get cached countries (returns null if not cached)
 */
export const getCachedCountries = (): CountryOption[] | null => {
  return countriesCache;
};

/**
 * Get cached cities (returns null if not cached)
 */
export const getCachedCities = (): CityOption[] | null => {
  return citiesCache;
};

/**
 * Get cached wafaqs (returns null if not cached)
 */
export const getCachedWafaqs = (): WafaqOption[] | null => {
  return wafaqsCache;
};

/**
 * Get cached non-cooperation types (returns null if not cached)
 */
export const getCachedNonCooperationTypes = (): NonCooperationTypeOption[] | null => {
  return nonCooperationTypesCache;
};

